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
          /*
           * ★例外: 章の「軽い索引」だけは data チャンクに入れない★
           *
           * ■ なぜ例外が必要か（実測で分かった穴）
           *   src/data/chapterIndex.generated.ts は
           *   「章ID・章名・大問数」だけを持つ 24,972 バイトの軽いファイルで、
           *   ホーム画面が教科データ本体（約2.6MB）を読まずに
           *   進捗の分母を出せるようにするために作った。
           *
           *   ところが上の `id.includes('/src/data/')` は
           *   src/data 配下を無条件に data チャンクへ送るので、
           *   この索引も 3,055,906 バイトの data チャンクの中に
           *   埋め込まれてしまっていた（ビルド結果を grep して確認。
           *   data チャンク側に problemCount が 162 個、
           *   index チャンク側には 3 個しか無かった）。
           *
           *   つまり「ホームは索引だけ読む」ようにコードを直しても、
           *   ★配信の単位が 3MB のままなので効果が出ない★。
           *   索引を作った意味そのものが消えていた。
           *
           * ■ なぜこの例外は安全か（真っ白問題を再発させない根拠）
           *   上に書いたとおり、data チャンクを分割してはいけない理由は
           *   「全教科を集めるハブがあるとチャンク単位の循環が生まれる」
           *   ことだった。
           *   一方この索引は ★他のモジュールを一切 import しない葉★ である
           *   （自動生成の時点で import 文を出さない設計にしてあり、
           *   tests/chapterIndex.test.ts が import 文の存在を禁止している）。
           *   出ていく辺が 0 本のモジュールは、
           *   どのチャンクに置いてもチャンク間の循環に加われない。
           *   よって Cannot access 'D' before initialization は起こり得ない。
           *
           * ■ undefined を返す（＝専用チャンクを作らない）理由
           *   索引を使うのはホーム画面で、ホームはアプリ本体（index チャンク）に
           *   含まれている。専用チャンクにすると
           *   起動時に HTTP リクエストが1本増えるだけで得がない。
           *   undefined を返してアプリ本体と同じチャンクに載せるのが最小構成。
           */
          if (id.includes('/src/data/chapterIndex.generated')) return undefined;

          /*
           * ★例外2: 章カタログも data チャンクに入れない★
           *
           * ■ 何が起きていたか（実測）
           *   src/data/chapterCatalog.ts は先生ダッシュボードのために
           *   「章ID・章名・大問数」を返すだけのファイルで、
           *   もう教科データ本体を一切 import していない
           *   （実行時 import は chapterIndex.generated の1本だけ。
           *     allChapters と studySummary は import type なので実行時に消える）。
           *
           *   ところが上の `id.includes('/src/data/')` は src/data 配下を
           *   無条件に data チャンクへ送るため、軽くしたこのファイルも
           *   3MB の data チャンクに入れられていた。
           *   さらに悪いことに、★このファイルが data チャンクに居ると
           *   索引まで data チャンク側へ引き寄せられた★。
           *   ビルド結果を grep すると
           *     直前のビルド : index に problemCount 165 個 / data に   0 個
           *     このビルド   : index に problemCount   3 個 / data に 164 個
           *   と逆転していた。索引を index 側へ置く例外1が、
           *   ★実質的に無効化されていた★ ということである。
           *
           *   これは前にも踏んだ落とし穴と同じで、
           *   「ソースの依存を軽くしても、配信の単位（チャンク）が
           *   3MB のままなら効果は出ない」。依存グラフだけを見て
           *   満足せず、必ず dist を grep して確かめる必要がある。
           *
           * ■ なぜこの例外は安全か（真っ白問題の再発根拠がない）
           *   data チャンクを割ってはいけない理由は
           *   「全教科を集めるハブがチャンク間の循環を作る」ことだった。
           *   chapterCatalog.ts の実行時の行き先は
           *   chapterIndex.generated（＝何も import しない葉）だけなので、
           *   このファイルから data チャンクへ向かう辺は1本も無い。
           *   辺が無ければチャンク間の循環に加われないので、
           *   Cannot access 'D' before initialization は起こり得ない。
           *
           *   ★この前提は思い込みではなく機械検査してある★
           *   tests/screenDataWeight.test.ts が chapterCatalog.ts の
           *   到達先（実行時 import のみを辿る）を測っており、
           *   教科データ本体へ届いた時点で必ず落ちる。
           *   落ちたときは、この例外行も一緒に見直すこと。
           */
          if (id.includes('/src/data/chapterCatalog')) return undefined;

          /*
           * ★例外3: 教科名の対応表も data チャンクに入れない★
           *
           * ■ 何が起きていたか（実測。★この例外を書き忘れて実際に後退させた★）
           *   教科名の対応表を1か所に集約するため
           *   src/data/subjectLabels.ts を新しく作った。
           *   このファイルの実コードはたった 443 バイトで、
           *   実行時に読むのは chapterIndex.generated（＝何も import しない葉）
           *   1本だけである。
           *
           *   ところが例外を書かなかったので、上の
           *   `id.includes('/src/data/')` に拾われて 3MB の data チャンクへ入り、
           *   ★起動画面（SubjectSelection）が data チャンクを参照する形★
           *   になった。その結果、例外1で index 側に置いていた索引まで
           *   data チャンク側へ引き寄せられた。ビルド結果を grep すると
           *     この例外を書く前 : index の problemCount   5 個 / data に 162 個
           *     例外を書いたあと : index の problemCount 167 個 / data に   0 個
           *   と逆転していた。チャンクの大きさも
           *     index 1,052.63 → 1,033.63 kB（-19.00）
           *     data  3,041.81 → 3,060.79 kB（+18.98）
           *   とほぼ同量が移動しており、「減った」のではなく
           *   ★索引が重い側へ移っただけ★だった。
           *
           *   つまり例外2のコメントに書いてある落とし穴を、
           *   まったく同じ形でもう一度踏んだということである。
           *   ★軽くした data 層のファイルを新設したら、必ずこの例外も足す。★
           *   忘れても気づけるように、
           *   tests/chapterIndex.test.ts に「軽い data ファイルには
           *   例外が必要」を自動判定する検査を追加した（順序だけでなく
           *   ★例外の書き忘れそのもの★ を検出する）。
           *
           * ■ なぜこの例外は安全か（真っ白問題の再発根拠がない）
           *   data チャンクを割ってはいけない理由は
           *   「チャンク間に循環ができる」ことだった。実測すると
           *     subjectLabels へ入ってくる辺:
           *       SubjectSelection.tsx（index 側）
           *       chapterCatalog.ts（例外2で index 側）
           *       → data チャンクから来る辺は1本も無い
           *     subjectLabels から出ていく辺:
           *       chapterIndex.generated（例外1で index 側）
           *       → data チャンクへ向かう辺も1本も無い
           *   どちら向きにも辺が無いので、チャンク間の循環に加われない。
           *
           * ■ ★なぜ advancedFields.ts には同じ例外を付けないのか★
           *   同じく軽い葉（実コード 600 バイト）だが、こちらは
           *   chemistryAdvancedData.ts（＝data チャンク側）から
           *   再公開のために import されている。
           *   例外にすると「data チャンク → index チャンク」の辺ができ、
           *   index → data の辺と合わせて循環になる恐れがある。
           *   （前に per-subject 分割で出した
           *     Cannot access 'D' before initialization がこれ。）
           *   実際に例外を追加して測ったが、ビルド結果のハッシュは
           *   1バイトも変わらず効果が無かったので、その設定は取り消した。
           *   軽い葉なら何でも例外にしていい、という話ではない。
           *   ★入ってくる辺・出ていく辺の両方を数えて判断すること。★
           */
          if (id.includes('/src/data/subjectLabels')) return undefined;

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
