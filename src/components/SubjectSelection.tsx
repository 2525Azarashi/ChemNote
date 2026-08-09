/**
 * ===================================================================
 * 科目選択画面（＝アプリのタイトル画面）
 * ===================================================================
 * ログイン（オンボーディング）直後に最初に表示される画面。
 *
 * 役割は2つ:
 *  1. アプリの「顔」＝タイトル画面（ロゴ・キャッチコピー・世界観の提示）
 *  2. 学習する科目の選択（化学基礎／化学／英語リスニング）
 *
 * 設計方針
 *  - Home.tsx と同じ淡いピンク基調（#D9466E / #E8688E / #FBE0E9 / #FDFBF7）と
 *    ノート罫線＋桜の世界観をそのまま引き継ぎ、「別アプリ感」を出さない。
 *  - 科目カードは「今すぐ入れる科目」と「準備中の科目」を一目で区別できるよう、
 *    色・影・カーソル・バッジ・aria-disabled を明確に変える。
 *  - 準備中の科目を押しても行き止まりにせず、
 *    「公開されたら知りたい」意思をフィードバック機能に接続して回収する。
 *
 * カルーセル方式にした理由
 *  - 科目が 3 つ以上になったため、従来の 2 カラムグリッドでは
 *    縦に伸びて 1 画面に収まらない。
 *  - そこで、**カード 1 枚の大きさは従来と完全に同じまま**
 *    （スマホ＝幅いっㅤい / md 以上＝从前の2カラム分の幅 = 50% - gap/2）で
 *    横スクロールとし、番号（ドット）と矢印で送れるようにした。
 *  - CSS の scroll-snap を使うので、スマホのスワイプも PC の矢印も同じ挙動になる。
 *  - カード自体はボタンなので Tab でも到達でき、フォーカス時に
 *    ブラウザが自動スクロールする。加えて←→キーでも送れる。
 *  - 全カード・全操作はタップ領域 44px 以上を確保。
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Lock,
  Sparkles,
  BookOpen,
  FlaskConical,
  Headphones,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { auth } from '../firebase';
import { MntbLogo } from './MntbLogo';
import { SakuraPetals } from './SakuraPetals';
import { NotebookScenery } from './NotebookScenery';
import { FeedbackModal } from './FeedbackModal';
import { GoogleLinkBanner } from './GoogleLinkBanner';
import { chemistryData } from '../data/chemistryData';
import { getAllAdvancedChapters } from '../data/chemistryAdvancedData';

/** アプリが扱う科目の識別子 */
export type SubjectId = 'chemistry_basic' | 'chemistry' | 'english_listening';

/** 科目ID → 画面に出す科目名（App 側のバッジ表示などでも使う） */
export const SUBJECT_LABELS: Record<SubjectId, string> = {
  chemistry_basic: '化学基礎',
  chemistry: '化学',
  english_listening: '英語リスニング',
};

/** 未知の値が入っていても安全に科目名を引く */
export function getSubjectLabel(id: string | null | undefined): string {
  return SUBJECT_LABELS[(id || '') as SubjectId] || SUBJECT_LABELS.chemistry_basic;
}

/** 保存済みの科目ID が今の定義に存在するか */
export function isSubjectId(value: string | null | undefined): value is SubjectId {
  return Boolean(value && value in SUBJECT_LABELS);
}

interface SubjectDefinition {
  id: SubjectId;
  /** カードの主タイトル */
  title: string;
  /** 主タイトルの下に出す英字（デザイン用の添え字） */
  latin: string;
  /** 1行の説明 */
  description: string;
  /** カード内に並べる収録内容のハイライト */
  highlights: string[];
  /** 選択できるか（false なら「準備中」表示） */
  available: boolean;
  /** カードのアイコン */
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

interface SubjectSelectionProps {
  /** 科目を選んだとき（現状は化学基礎のみ遷移する） */
  onSelectSubject: (subject: SubjectId) => void;
  /** ゲスト利用中かどうか（挨拶の出し分けに使う） */
  isGuest: boolean;
  /**
   * ホームから「学習を始める」で来たときだけ渡される。
   * オンボーディング直後（＝戻る先が無い）ときは undefined のままにして、
   * 行き止まりにならないよう戻るボタン自体を出さない。
   */
  onBack?: () => void;
}

export function SubjectSelection({ onSelectSubject, isGuest, onBack }: SubjectSelectionProps) {
  /**
   * 「公開されたら知らせて」モーダルで、どの科目が押されたかを覚えておく。
   * 以前は文面が「化学」固定だったため、科目が増えると誤った案内になってしまう。
   */
  const [notifySubject, setNotifySubject] = useState<SubjectDefinition | null>(null);

  /** 表示名（プロフィール → Firebase 表示名 → ゲスト の順で解決） */
  const displayName = useMemo(() => {
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const raw = localStorage.getItem(`profile_${uid}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) return String(parsed.name);
      }
    } catch {
      /* localStorage が使えない環境は表示名なしで続行 */
    }
    return auth.currentUser?.displayName || (isGuest ? 'ゲスト' : 'ユーザー');
  }, [isGuest]);

  /** 化学基礎の収録ボリューム（数字をハードコードせずデータから算出する） */
  const basicStats = useMemo(() => {
    const chapters = chemistryData.parts.flatMap((p: any) => p.chapters);
    let questions = 0;
    chapters.forEach((c: any) => {
      questions += (c.practiceProblems || []).length + (c.miniTest || []).length;
    });
    return { chapters: chapters.length, questions };
  }, []);

  /** 化学（発展）の収録ボリューム。問題は順次追加するため、単元数だけ先に表示する。 */
  const advancedStats = useMemo(() => {
    const chapters = getAllAdvancedChapters();
    let questions = 0;
    chapters.forEach((c) => {
      questions += (c.practiceProblems || []).length + (c.miniTest || []).length;
    });
    return { chapters: chapters.length, questions };
  }, []);

  const subjects: SubjectDefinition[] = useMemo(() => [
    {
      id: 'chemistry_basic',
      title: '化学基礎',
      latin: 'Basic Chemistry',
      description: '共通テスト「化学基礎」を、教科書の順番どおりに完全網羅。',
      highlights: [
        `全${basicStats.chapters}単元・演習${basicStats.questions}問を収録`,
        '出題傾向データ（2016〜2026年）に完全対応',
        'ロジックツリー・模擬試験・復習リスト対応',
      ],
      available: true,
      icon: BookOpen,
    },
    {
      id: 'chemistry',
      title: '化学',
      latin: 'Chemistry',
      description: '理論・無機・有機を、教科書の順番どおりに配置。単元から選んで学習できます。',
      highlights: [
        `全${advancedStats.chapters}単元を教科書順で収録（問題は順次追加中）`,
        '理論化学・無機化学・有機化学を分野別に選択',
        '化学基礎と同じ単元画面・同じ演習の進め方',
      ],
      available: true,
      icon: FlaskConical,
    },
    {
      id: 'english_listening',
      title: '英語リスニング',
      latin: 'English Listening',
      description: '共通テスト「英語リスニング」対策。現在、鋭意制作中です。',
      highlights: [
        '第1〜6問の設問形式別トレーニング',
        '1回読み・複数話者への対応力',
        'ディクテーションと聞き取りメモの型',
      ],
      available: false,
      icon: Headphones,
    },
  ], [basicStats, advancedStats]);

  // ===================================================================
  // カルーセル（横スクロール）の制御
  // ===================================================================
  // カード1枚のサイズは従来のまま（min-h-[248px] / p-6 md:p-7 / rounded-[24px]、
  // md以上では従来の2カラム時と同じ幅）。変えたのは「並べ方」だけ。
  // グリッド → CSS scroll-snap の横並びにしたので、
  // スマホのスワイプも PC の矢印クリックもまったく同じ挙動になる。
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * トラック内のカード要素だけを取り出す。
   * 前後に「中央寄せ用のスペーサー」を置いているため、
   * children の添字ではなく data 属性で引く。
   */
  const getCards = useCallback((): HTMLElement[] => {
    const track = trackRef.current;
    if (!track) return [];
    return Array.from(track.querySelectorAll<HTMLElement>('[data-subject-card]'));
  }, []);

  /** 指定枚目のカードを表示領域の中央に寄せる */
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = getCards();
    if (cards.length === 0) return;
    const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
    if (!card) return;
    // scrollIntoView はページ全体を動かしてしまう環境があるため、
    // トラックの scrollLeft を自分で計算して動かす。
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: 'smooth',
    });
  }, [getCards]);

  /** スクロール位置から「今どのカードが中央か」を求め、ドット表示に反映する */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const center = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        getCards().forEach((el, i) => {
          const cardCenter = el.offsetLeft + el.clientWidth / 2;
          const distance = Math.abs(cardCenter - center);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = i;
          }
        });
        setActiveIndex(nearest);
      });
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    // 幅が変わると中央判定もずれるため、リサイズでも再計算する
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [subjects.length, getCards]);

  /** ←→ キーでも送れるようにする（キーボード操作の救済） */
  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  const canScrollPrev = activeIndex > 0;
  const canScrollNext = activeIndex < subjects.length - 1;

  return (
    <div className="w-full min-h-[100dvh] sm:min-h-0 flex flex-col relative overflow-hidden rounded-none sm:rounded-[32px] bg-gradient-to-b from-[#FFF1F5] via-[#FDFBF7] to-[#F8E7EE]">

      {/* ===== 背景（Home と同じ世界観：ノート罫線＋風景＋桜） ===== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'linear-gradient(transparent calc(2.5rem - 1px), #F0C7D2 calc(2.5rem - 1px))',
          backgroundSize: '100% 2.5rem',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none opacity-5 fabric-texture" aria-hidden="true" />
      <NotebookScenery />
      <SakuraPetals count={40} />

      {/* ===== ホームへ戻る（ホームの「学習を始める」から来たときだけ） =====
          オンボーディング直後は戻る先が無いので表示しない。 */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="ホームに戻る"
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-30 flex items-center gap-1.5 rounded-full border border-[#F4A9C4]/70 bg-white/95 px-3.5 py-2 text-[12px] font-bold text-[#D9466E] shadow-[0_8px_20px_-10px_rgba(217,70,110,0.5)] backdrop-blur-sm transition-all hover:bg-white hover:border-[#E8688E] active:scale-95 min-h-[44px] cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="font-modern">ホーム</span>
        </button>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5 sm:px-8 md:px-12 pt-10 sm:pt-12 md:pt-14 relative z-10 flex flex-col justify-center">

        {/* ===== タイトル（アプリの顔） ===== */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          {/* ロゴのみを大きく置く。
              以前はロゴの下に「まなとび」「まなびの、とびらを開こう」の
              文字を重ねていたが、ロゴ自体がアプリ名を表しており冗長なため撤去した。 */}
          <div className="flex justify-center">
            <MntbLogo size="hero" />
          </div>

          <p className="mt-5 text-[13px] sm:text-sm text-[#5D6D7E] font-modern leading-relaxed">
            ようこそ、<span className="font-bold text-[#1B2631]">{displayName}</span>さん。<br className="sm:hidden" />
            学習する科目を選んでください。
          </p>
        </motion.header>

        {/* ===== Googleアカウント連携のおすすめ（ゲスト利用中のみ） ===== */}
        {isGuest && <GoogleLinkBanner />}

        {/* ===== 科目カード（カルーセル：横スクロールで選ぶ） =====
            ウィンドウ（表示領域）と1枚のカードの大きさは従来どおり。
            max-w-4xl・gap も 2カラム時代と同じ値を保っている。 */}
        <div className="relative max-w-4xl w-full mx-auto">

          {/* 左右の矢印（PC向けの導線。スマホではスワイプで送れるので隠す） */}
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={!canScrollPrev}
            aria-label="前の科目を表示する"
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border backdrop-blur-sm transition-all ${
              canScrollPrev
                ? 'bg-white/95 border-[#F4A9C4]/70 text-[#D9466E] shadow-[0_10px_24px_-12px_rgba(217,70,110,0.55)] hover:bg-white hover:border-[#E8688E] active:scale-95'
                : 'bg-white/50 border-[#E4E8EC] text-[#C6CFD6] cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={!canScrollNext}
            aria-label="次の科目を表示する"
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border backdrop-blur-sm transition-all ${
              canScrollNext
                ? 'bg-white/95 border-[#F4A9C4]/70 text-[#D9466E] shadow-[0_10px_24px_-12px_rgba(217,70,110,0.55)] hover:bg-white hover:border-[#E8688E] active:scale-95'
                : 'bg-white/50 border-[#E4E8EC] text-[#C6CFD6] cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* スクロールトラック本体
              - snap-x snap-mandatory：1枚ずつピタッと止まる
              - carousel-x：スクロールバーを隠す（代わりに矢印・ドット・案内文を出す）
              - overscroll-x-contain：端まで送ってもページ全体が動かない
              - 前後のスペーサーで、1枚目と最後の1枚もきちんと中央に寄せられる */}
          <div
            ref={trackRef}
            role="group"
            aria-label="科目を横スクロールで選択"
            tabIndex={0}
            onKeyDown={handleTrackKeyDown}
            className="carousel-x flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#E8688E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-[26px] overscroll-x-contain"
          >
          {/* 先頭スペーサー（1枚目を中央に寄せるための余白。md以上は2枚並ぶので不要） */}
          <div className="shrink-0 w-[7vw] md:hidden" aria-hidden="true" />

          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            const handleClick = () => {
              if (subject.available) onSelectSubject(subject.id);
              else setNotifySubject(subject);
            };

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + index * 0.1 }}
                data-subject-card
                /* 1枚の幅は従来の見た目を維持：
                   スマホ＝ほぼ全幅（従来1カラム相当）／
                   md以上＝従来2カラム時とまったく同じ幅（50% − gap/2 = 50% − 12px）。
                   shrink-0 で潰れないようにし、snap-center で中央に吸着させる。 */
                className="shrink-0 snap-center w-[86vw] max-w-[420px] md:w-[calc(50%-12px)] md:max-w-none"
              >
                <button
                  onClick={handleClick}
                  aria-label={
                    subject.available
                      ? `${subject.title}を学習する`
                      : `${subject.title}は準備中です。公開のお知らせを希望する`
                  }
                  className={`group relative w-full h-full text-left rounded-[24px] p-6 md:p-7 border transition-all duration-200 overflow-hidden min-h-[248px] flex flex-col ${
                    subject.available
                      ? 'bg-white/92 backdrop-blur-sm border-[#F4A9C4]/55 shadow-[0_16px_38px_-18px_rgba(217,70,110,0.55)] hover:border-[#E8688E] hover:shadow-[0_22px_46px_-18px_rgba(217,70,110,0.62)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.995]'
                      : 'bg-[#F7F5F3]/85 backdrop-blur-sm border-[#D7DDE3]/70 shadow-none hover:border-[#B8C4CE] hover:bg-[#F2F0EE]/90'
                  }`}
                >
                  {/* 利用可能カードだけ、上端にアクセントの帯を引く */}
                  {subject.available && (
                    <span
                      className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E8688E] via-[#D9466E] to-[#E89AAF]"
                      aria-hidden="true"
                    />
                  )}

                  {/* 右上のステータスバッジ */}
                  <span
                    className={`absolute top-5 right-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold font-modern tracking-wider ${
                      subject.available
                        ? 'bg-[#FBE0E9] text-[#D9466E]'
                        : 'bg-[#E4E8EC] text-[#8895A0]'
                    }`}
                  >
                    {subject.available
                      ? (<><Sparkles className="w-3 h-3" aria-hidden="true" />公開中</>)
                      : (<><Lock className="w-3 h-3" aria-hidden="true" />準備中</>)}
                  </span>

                  {/* アイコン */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mb-4 mt-1 transition-transform ${
                      subject.available
                        ? 'bg-[#FBE0E9] text-[#D9466E] group-hover:scale-105'
                        : 'bg-[#E4E8EC] text-[#8895A0]'
                    }`}
                  >
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>

                  {/* タイトル */}
                  <h2
                    className={`font-handwriting font-bold text-[26px] md:text-[30px] leading-tight ${
                      subject.available ? 'text-[#1B2631]' : 'text-[#8895A0]'
                    }`}
                  >
                    {subject.title}
                  </h2>
                  <p
                    className={`text-[10px] font-modern tracking-[0.22em] mt-1 mb-3 ${
                      subject.available ? 'text-[#E8688E]' : 'text-[#B8C4CE]'
                    }`}
                  >
                    {subject.latin.toUpperCase()}
                  </p>

                  {/* 説明 */}
                  <p
                    className={`text-xs md:text-[13px] font-modern leading-relaxed mb-4 ${
                      subject.available ? 'text-[#5D6D7E]' : 'text-[#8895A0]'
                    }`}
                  >
                    {subject.description}
                  </p>

                  {/* 収録ハイライト */}
                  <ul className="space-y-1.5 mb-5">
                    {subject.highlights.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-2 text-[11px] md:text-xs font-modern leading-snug ${
                          subject.available ? 'text-[#5D6D7E]' : 'text-[#A3AEB8]'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-[1px] shrink-0 ${
                            subject.available ? 'text-[#E8688E]' : 'text-[#C6CFD6]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* フッター行（CTA） */}
                  <div className="mt-auto pt-3 border-t border-dashed border-[#E4E8EC] flex items-center justify-between">
                    <span
                      className={`text-[13px] font-bold font-modern tracking-wide ${
                        subject.available ? 'text-[#D9466E]' : 'text-[#8895A0]'
                      }`}
                    >
                      {subject.available ? 'この科目ではじめる' : '公開のお知らせを受け取る'}
                    </span>
                    {subject.available ? (
                      <ArrowRight
                        className="w-5 h-5 text-[#E8688E] group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    ) : (
                      <Bell className="w-4 h-4 text-[#8895A0]" aria-hidden="true" />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}

          {/* 末尾スペーサー（最後の1枚も中央に寄せられるようにする） */}
          <div className="shrink-0 w-[7vw] md:hidden" aria-hidden="true" />
          </div>

          {/* ドット（今何枚目かを示し、タップで直接飛べる）
              タップ領域 44px を確保するため、見える丸は小さくしても
              ボタン自体には十分な余白を持たせている。 */}
          <div className="flex items-center justify-center gap-1 mt-3" role="tablist" aria-label="科目の選択位置">
            {subjects.map((subject, i) => (
              <button
                key={subject.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`${subject.title}を表示する`}
                onClick={() => scrollToIndex(i)}
                className="w-11 h-11 flex items-center justify-center group"
              >
                <span
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? 'w-6 h-2 bg-gradient-to-r from-[#E8688E] to-[#D9466E]'
                      : 'w-2 h-2 bg-[#F4A9C4]/60 group-hover:bg-[#E8688E]/70'
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ===== 補足 ===== */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center text-[11px] text-[#8895A0] font-modern mt-7 leading-relaxed"
        >
          横にスワイプ（または←→キー）で他の科目を見られます。<br className="sm:hidden" />
          科目はあとから画面下の「ホーム」からいつでも切り替えられます。
        </motion.p>
      </div>

      {/* 準備中の科目を押したときの受け皿（フィードバックとして回収する）
          文面は押された科目名に合わせる（以前は「化学」固定だった）。 */}
      {notifySubject && (
        <FeedbackModal
          screen="title"
          category="request"
          initialMessage={`「${notifySubject.title}」の公開を希望します。`}
          description={`「${notifySubject.title}」は現在準備中です。公開のお知らせ希望や、優先してほしい分野をお聞かせください`}
          context={{ requestedSubject: notifySubject.id, isGuest }}
          onClose={() => setNotifySubject(null)}
        />
      )}
    </div>
  );
}
