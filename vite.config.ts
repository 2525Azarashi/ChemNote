import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // Inline assets smaller than 2MB (including our 1.1MB BGM), but never inline
    // webfonts. KaTeX ships woff2/woff/ttf for every math face; base64-inlining
    // them would add ~1.5MB to the render-blocking CSS even though the browser
    // only ever downloads the woff2 it needs.
    assetsInlineLimit: (filePath: string, content: Buffer) => {
      if (/\.(woff2?|ttf|otf|eot)$/i.test(filePath)) return false;
      return content.length < 2000000;
    },
    /*
     * ★ビルド設定（すべて実測に基づく。詳細は docs/BUILD.md）★
     *
     * ■ 前提: OOM の原因は環境であって、アプリの構造ではない
     *   GenSpark のサンドボックスは「メモリ 985MB / swap 0」。
     *   ここでは素の vite build が
     *     ✓ 2250 modules transformed → Killed（終了コード 137 = SIGKILL）
     *   となる。swap を 4GB 足すと、コードも設定も一切変えずに成功する。
     *   → 本番（Vercel 等）は十分なメモリがあるため元から問題は起きない。
     *
     * ■ 実測（swap 有効下でピーク RSS を比較。985MB に収まるかの判定に使う）
     *     素の設定                    : peak 809MB / 17s
     *     + manualChunks              : peak 805MB / 15s  ← メモリ効果なし（誤差）
     *     + maxParallelFileOps: 2     : peak 776MB / 16s  ← -33MB の実効果
     *   ★manualChunks はメモリ対策としては効かない★ ので、
     *   「メモリのために入れている」とは書かない。残す理由は下に書いた配信面の利点。
     *   なお sourcemap: false は Vite の既定値と同じなので、明示せず削除した。
     */
    reportCompressedSize: false,
    rollupOptions: {
      // Rollup が同時に開くファイル数を絞る。既定は CPU 数に応じて増えるため、
      // 並列数がそのままメモリのピークに乗る。実測で -33MB。
      // 出力内容は並列数に影響されないので、成果物は同一。
      maxParallelFileOps: 2,
      output: {
        /*
         * ■ manualChunks を残す理由（メモリではなく「配信とキャッシュ」）
         *   分割前は index.js が単一チャンクで 5,243.21 kB。
         *   これを vendor 系 + data + index に分けると、
         *   ・ライブラリ（firebase / katex / react 等）は変更頻度が低いので、
         *     アプリを更新してもブラウザのキャッシュが効き続ける
         *   ・教科データを追加したとき、再ダウンロードされるのは data だけ
         *   今後アプリが大きくなるほど効く設定なので残す。
         *
         * ■ UI に影響しない理由
         *   manualChunks は「同じモジュール群をどのファイルに出力するか」だけを
         *   決める設定で、import される内容・実行順序・副作用は変えない。
         *   静的 import は従来どおり全部読み込まれ（dist/index.html で
         *   全チャンクが modulepreload される）、
         *   画面・デザイン・フォント・遷移・アニメーションは変化しない。
         *   （lazy 化＝読み込み「時期」を変える対応とは別物。今回は変えていない）
         */
        manualChunks: (id: string) => {
          // node_modules は変更頻度が低いので、用途ごとに固定チャンクへ。
          if (id.includes('node_modules')) {
            if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'vendor-firebase';
            if (id.includes('/katex/')) return 'vendor-katex';
            if (id.includes('/motion') || id.includes('/framer-motion')) return 'vendor-motion';
            if (id.includes('/lucide-react/')) return 'vendor-icons';
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/'))
              return 'vendor-react';
            return 'vendor';
          }

          /*
           * ★教科データは1つのチャンクにまとめる（分割してはいけない）★
           *
           * ■ 最初は教科ごとに分けたが、それは動かなかった
           *   data-chemistry / data-english-listening / data-biology … と
           *   教科別に分けたところ、ビルドは成功するのに本番の画面が
           *   真っ白になった。ブラウザのエラーは
           *     Cannot access 'D' before initialization
           *   で、Rollup も明確に警告を出していた:
           *     Circular chunk: data-chemistry -> data-english-listening -> data-chemistry
           *     Circular chunk: data-english-grammar -> data-chemistry -> data-english-grammar
           *
           * ■ なぜ起きるか（依存グラフを機械的に解析して特定した）
           *   ★ファイル単位の循環依存は 0 件★ である（164ファイル / 383辺を
           *   Tarjan の SCC で検査。相互 import も 0 件）。
           *   つまり「教科データ同士が循環している」わけではない。
           *   原因は src/data/chapterCatalog.ts が
           *     chemistryData / chemistryAdvancedData / englishListeningData /
           *     mathData / biologyBasicData / englishGrammarData
           *   の全教科をまとめて import している「ハブ」だからである。
           *   このハブを教科別チャンクのどれか1つに入れると、
           *   そのチャンクが他の全教科チャンクに依存し、
           *   さらに他教科がハブ側の共有物を参照して戻るため、
           *   ファイル単位では循環していないのに
           *   ★チャンク単位でだけ循環が生まれる★。
           *   ESM はチャンク間の初期化順を決められず
           *   「Cannot access 'D' before initialization」で真っ白になる。
           *
           * ■ したがって src/data はまとめて 1 チャンクにする
           *   これで「巨大な単一 index.js」を割る目的は達成できる
           *   （index / data / vendor 系に分かれる）。
           *   将来 data チャンクを教科別に割りたい場合は、
           *   先に chapterCatalog のような「全教科を集めるハブ」を
           *   解消する（章の定義を各教科側から登録する形にする）ことが前提。
           *   ハブを残したままチャンクだけ割ると必ず真っ白になる。
           */
          if (id.includes('/src/data/')) return 'data';

          return undefined;
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
