/**
 * ===================================================================
 * 英文法　PART1-a：文型 / 時制 / 完了形 / 助動詞 / 態
 * ===================================================================
 *
 * ■ 網羅の担保方法（★本データの核心★）
 *   ご要望「全網羅」を口約束にしないため、次の規約を守っている。
 *
 *     ★単元が宣言した topics（5つ）に、問題を1問ずつ対応させる★
 *
 *   各問の `topic` には englishGrammarData.ts の topics 文字列を
 *   ★一字一句そのまま★ 書き写す。こうすると
 *   「単元が扱うと宣言した論点に、対応する問題が存在するか」を
 *   検査（tests/englishGrammar.test.ts）で機械的に確認できる。
 *   文字列がずれた瞬間に検査が落ちるので、単元の宣言と問題の中身が
 *   食い違ったまま放置されることがない。
 *
 * ■ 1問ずつ手で書いている理由
 *   ご指摘「コードで形式的に作ると問題によっておかしくなる可能性がある」。
 *   英文法は単元ごとに「誤答肢の作り方」がまるで違う。
 *     ・時制  → 別の時制を並べる
 *     ・語法  → 前置詞の有無を並べる
 *     ・準動詞→ to do / doing / done を並べる
 *   これを共通ロジックで自動生成すると、単元によって
 *   「誰も選ばない誤答肢」や「2つ正解になる肢」が必ず生まれる。
 *   よって誤答肢は1問ずつ「その単元で実際に受験生が間違える形」を
 *   選んで手書きしている。
 */

import { buildEgSet, type EgItem, type GrammarProblem } from './englishGrammarKit';

// =====================================================================
// eg1_1　① 基本5文型と自動詞・他動詞
// =====================================================================

const EG1_1_ITEMS: EgItem[] = [
  {
    topic: '第1文型 SV と第2文型 SVC の見分け（be 動詞以外の SVC）',
    focus: 'be 動詞以外の SVC',
    sentence: 'Your plan ______ good to me. Let us go with it.',
    choices: ['sounds', 'hears', 'listens', 'is heard'],
    answer: '①',
    rate: 71,
    full: 'Your plan sounds good to me. Let us go with it.',
    translation: 'あなたの計画は私には良さそうに聞こえます。それでいきましょう。',
    keyPhrases: [
      { phrase: 'sounds good', meaning: '良さそうに聞こえる ※sound＋形容詞で SVC（第2文型）' },
      { phrase: 'sound', meaning: '〜に聞こえる・思われる（be 動詞の代わりに C を取る動詞）' },
    ],
    theme: 'be 動詞以外でも C（補語）を取る動詞がある（sound / look / feel / taste / become / go）',
    type: '文型判断型',
    difficulty: 2,
    steps: [
      '① 空所の直後を見る。good は形容詞で、名詞ではない',
      '② 形容詞が置けるのは C（補語）の位置だけ。よって空所は SVC の V',
      '③ 「S＝C」の関係が成り立つか確認する（your plan＝good）。成り立てば SVC で確定',
      '④ 選択肢のうち、後ろに形容詞を直接置ける動詞を選ぶ',
    ],
    commentary: [
      '空所の直後にあるのは good という形容詞です。形容詞は目的語（O）にはなれず、置けるのは補語（C）の位置だけなので、この文は S＋V＋C の第2文型だと決まります。',
      'be 動詞以外にも C を取る動詞があり、sound（〜に聞こえる）・look（〜に見える）・feel（〜に感じる）・taste（〜な味がする）・become / go / turn（〜になる）が代表です。ここでは「あなたの計画＝良さそう」という S＝C の関係が成り立つので sounds が入ります。',
      '② の hears は「（音を）耳にする」という他動詞で、後ろには名詞が必要です。hears good とは言えません。',
      '③ の listens は自動詞で、聞く対象を言うときは listen to ~ と前置詞が必要です。しかもここは「聞く」動作の話ではありません。',
      '④ の is heard は受動態で「聞かれる」。主語は plan なので「計画が聞かれる」となり意味が通りません。日本語の「〜に聞こえる」に引きずられて受動態を選ばないよう注意してください。',
    ],
  },
  {
    topic: '第3文型 SVO と第4文型 SVOO（give 型・二重目的語）',
    focus: '目的語を2つ取る動詞',
    sentence: 'The new software ______ us a great deal of time every month.',
    choices: ['saves', 'saves for', 'saves to', 'is saved'],
    answer: '①',
    rate: 68,
    full: 'The new software saves us a great deal of time every month.',
    translation: 'その新しいソフトは毎月、私たちの多くの時間を節約してくれる。',
    keyPhrases: [
      { phrase: 'saves us a great deal of time', meaning: '私たちの多くの時間を節約する ※save A B の第4文型' },
      { phrase: 'a great deal of time', meaning: 'かなりの時間（time は不可算なので many ではなく a great deal of）' },
    ],
    theme: '第4文型（SVOO）は「人に物を与える／もたらす」型。前置詞を挟まない',
    type: '文型判断型',
    difficulty: 2,
    steps: [
      '① 空所のあとに us（人）と a great deal of time（物）が続いていることを確認する',
      '② 名詞が2つ並ぶなら、その動詞は第4文型（SVOO）を取っていると考える',
      '③ 第4文型では動詞と1つ目の目的語の間に前置詞を入れない',
      '④ 「人に〜をもたらす」で第4文型を取る動詞（give / save / cost / take / owe）を思い出す',
    ],
    commentary: [
      '空所の後ろには us（人）と a great deal of time（物）という名詞が2つ並んでいます。動詞のあとに名詞が2つ続くのは第4文型 SVOO の形です。',
      'save は「save＋人＋時間や手間」で「人の〜を省いてやる」という第4文型を作ります。同じ型を取る仲間として give（与える）・cost（〜の費用がかかる）・take（〜の時間がかかる）・owe（借りがある）をまとめて覚えておくと、この型の問題は一気に解けるようになります。',
      '② の saves for、③ の saves to は前置詞を挟んでいます。第4文型は前置詞なしで名詞2つを並べる形なので誤りです。なお第3文型に書き換えるときは save time for us のように「物→前置詞→人」の順になり、前置詞が現れる位置が空所とは逆であることに注意してください。',
      '④ の is saved は受動態です。受動態にすると後ろに目的語を2つ置くことはできません。また主語 software が「節約される」のではなく「節約してくれる」側なので、意味の方向も逆です。',
    ],
  },
  {
    topic: '第5文型 SVOC（O と C に主述関係がある）',
    focus: 'SVOC に as を入れない',
    sentence: 'The members ______ him chairman for another two years.',
    choices: ['elected', 'elected as', 'elected to be as', 'were elected'],
    answer: '①',
    rate: 59,
    full: 'The members elected him chairman for another two years.',
    translation: 'メンバーはさらに2年間、彼を議長に選出した。',
    keyPhrases: [
      { phrase: 'elected him chairman', meaning: '彼を議長に選んだ ※elect O C の第5文型（as は不要）' },
      { phrase: 'for another two years', meaning: 'さらに2年間（another＋複数名詞で「さらに〜」）' },
    ],
    theme: 'SVOC の C には名詞も入る。elect / call / name / make は as を入れない',
    type: '文型判断型',
    difficulty: 3,
    steps: [
      '① 空所のあとに him（O）と chairman（C）が並んでいることを確認する',
      '② O と C の間に「彼＝議長」という主述関係があるかを確かめる。あれば第5文型',
      '③ 第5文型の C は前置詞なしで直接置く。as を入れるかは動詞ごとに決まっている',
      '④ elect / call / name / make は as を取らない、と動詞単位で覚える',
    ],
    commentary: [
      'him と chairman が並び、「彼＝議長」という主述関係が成り立ちます。これは S＋V＋O＋C の第5文型で、C には形容詞だけでなく名詞も入ります。',
      '決め手は「as を入れるかどうか」です。elect（選出する）・call（呼ぶ）・name（名づける）・make（〜にする）・consider（みなす）は C を前置詞なしで直接置きます。よって ① elected が正解です。',
      '② の elected as は、regard A as B / think of A as B のように as を必要とする動詞と混同した形です。as を取る動詞と取らない動詞は動詞ごとに決まっているので、文型のルールとしてではなく、動詞1語ずつセットで覚えてください。',
      '③ の elected to be as は to be と as を重ねた形で、英語として成立しません。なお elect him to be chairman なら可能で、この to be は省略できます。',
      '④ の were elected は受動態です。受動態にすると目的語 him を後ろに置けません。「メンバーが選ぶ」側なので態の方向も逆で、He was elected chairman. なら正しい文になります。',
    ],
  },
  {
    topic: '自動詞と他動詞の区別（discuss / marry / enter に前置詞は不要）',
    focus: '他動詞に前置詞を付けない',
    sentence: 'We will discuss ______ at the meeting tomorrow morning.',
    choices: ['about the budget', 'the budget', 'on the budget', 'of the budget'],
    answer: '②',
    rate: 64,
    full: 'We will discuss the budget at the meeting tomorrow morning.',
    translation: '私たちは明日の朝の会議で予算について話し合う予定だ。',
    keyPhrases: [
      { phrase: 'discuss the budget', meaning: '予算について話し合う ※discuss は他動詞なので about は不要' },
      { phrase: 'discuss', meaning: '〜について論じる（＝talk about ~ を1語にした動詞）' },
    ],
    theme: '日本語の「〜について」に引かれて前置詞を足してしまう他動詞（discuss / mention / marry / enter / reach / attend）',
    type: '語法判断型',
    difficulty: 2,
    steps: [
      '① discuss が他動詞か自動詞かを判定する。他動詞なら目的語を直接取る',
      '② 訳から考えない。「〜について」という日本語があっても前置詞が必要とは限らない',
      '③ 前置詞つきの選択肢をまとめて切る',
      '④ 残った「動詞＋名詞」の形を選ぶ',
    ],
    commentary: [
      'discuss は他動詞で、「〜について」という前置詞の意味まで動詞1語に含んでいます。つまり discuss ＝ talk about なので、about を重ねる必要はありません。正解は ② the budget です。',
      'この型でねらわれる他動詞はほぼ決まっています。discuss（〜について話し合う）・mention（〜について言及する）・marry（〜と結婚する）・enter（〜に入る）・reach（〜に到着する）・attend（〜に出席する）・approach（〜に近づく）・resemble（〜に似ている）。すべて日本語には前置詞が現れるのに、英語では不要です。',
      '① の about the budget が最も選ばれやすい誤答です。talk about / think about と同じ感覚で about を足してしまう形ですが、discuss には最初から about の意味が入っています。',
      '③ の on the budget は「予算に関する報告」のように名詞のあとなら成り立ちますが、discuss の直後には置けません。',
      '④ の of the budget も同様で、discuss of とは言いません。なお前置詞を使いたいなら have a discussion about the budget と名詞にすれば正しくなります。動詞のときは前置詞なし、名詞のときは前置詞あり、と対で覚えると忘れません。',
    ],
  },
  {
    topic: '疑問詞を用いた文の語順（間接疑問は「疑問詞＋S＋V」）',
    focus: '間接疑問の語順',
    sentence: 'Do you have any idea ______ ?',
    choices: [
      'where is the nearest post office',
      'where the nearest post office is',
      'where does the nearest post office stand',
      'the nearest post office where is',
    ],
    answer: '②',
    rate: 66,
    full: 'Do you have any idea where the nearest post office is?',
    translation: '一番近い郵便局がどこにあるか分かりますか。',
    keyPhrases: [
      { phrase: 'where the nearest post office is', meaning: '一番近い郵便局がどこにあるか ※間接疑問は「疑問詞＋S＋V」' },
      { phrase: 'Do you have any idea', meaning: '〜が分かりますか（丁寧に尋ねる決まり文句）' },
    ],
    theme: '文の一部に組み込まれた疑問文（間接疑問）は倒置しない',
    type: '語順判断型',
    difficulty: 2,
    steps: [
      '① 疑問詞のかたまりが文全体の疑問文なのか、文の一部（名詞のかたまり）なのかを見る',
      '② ここは any idea の中身を説明する名詞節。つまり文の一部',
      '③ 文の一部になった疑問文は倒置せず「疑問詞＋S＋V」の語順に戻す',
      '④ 疑問詞が節の先頭に立っている形を選ぶ',
    ],
    commentary: [
      'この疑問詞のかたまりは、Do you have any idea の idea の中身を説明する名詞節です。文全体の疑問文ではなく文の一部なので、疑問文の倒置（be 動詞や do を主語の前に出す形）は起こりません。「疑問詞＋S＋V」の語順に戻した ② where the nearest post office is が正解です。',
      'この形を間接疑問と呼びます。I know / Tell me / Do you have any idea / I wonder のあとでは必ず「疑問詞＋S＋V」になる、と型で覚えてください。',
      '① の where is the nearest post office は直接疑問の語順です。単独なら正しい英文ですが、文に組み込まれるとこの倒置は消えます。',
      '③ の where does ~ stand は do を使った倒置が残っており、しかも stand（建っている）を使うと不自然な言い方になります。',
      '④ の the nearest post office where is は、疑問詞が節の先頭に立っていません。間接疑問では疑問詞が必ず節の先頭に来ます。',
    ],
  },
];

export const egSvPatternProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg1_1',
      setNo: 1,
      unitTitle: '① 基本5文型と自動詞・他動詞',
      category: '文型の見分けと自他の区別（SVC・SVOO・SVOC・他動詞・間接疑問）',
      intro:
        '文型は「英文を読む前にどこを見るか」を決めるための道具です。この回では、空所の直後に何が並んでいるか（形容詞か、名詞1つか、名詞2つか）だけを手がかりに文型を決め、そこから動詞を選ぶ手順を身につけます。訳してから考えると、日本語の「〜について」「〜として」に引きずられて前置詞を足す誤りが必ず起きます。順番は「形を見る → 文型を決める → 動詞を選ぶ」です。',
      summary: [
        '空所の直後が形容詞なら SVC、名詞2つなら SVOO、「名詞＋名詞で主述関係」なら SVOC。',
        'be 動詞以外の SVC 動詞：sound / look / feel / taste / smell / become / go / turn。',
        '第4文型（SVOO）は前置詞なし。第3文型に直すと前置詞（to / for）が現れる。',
        'elect / call / name / make の C に as は付けない。as を取るのは regard A as B の型。',
        '前置詞不要の他動詞：discuss / mention / marry / enter / reach / attend / approach / resemble。',
        '文に組み込まれた疑問文（間接疑問）は倒置せず「疑問詞＋S＋V」。',
      ],
      surroundingKnowledge: [
        '第2文型を作る動詞は「〜のままである（remain / keep / stay）」と「〜になる（become / get / grow / turn / go / come）」の2系統で整理すると覚えやすい。',
        'go は go bad（腐る）・go blind（目が見えなくなる）のように悪い方向の変化、come は come true（実現する）のように良い方向の変化を表すことが多い。',
        '第4文型を第3文型に書き換えるときの前置詞は、give / send / show / lend / teach 系が to、buy / make / find / cook 系が for。',
        'SVOC の C に原形不定詞が入るのが使役動詞・知覚動詞（make him go / see him go）。第5文型の一種として整理しておく。',
        '逆に前置詞を落としがちな自動詞：graduate from / apologize to / object to / complain about。',
      ],
      deepDiveTopics: [
        '第1文型か第2文型かで意味が変わる動詞：He grew tired.（第2文型＝疲れてきた）／The plant grew fast.（第1文型＝育った）。',
        '第4文型を取れない「与える系」動詞：explain / suggest / introduce / describe は explain the rule to me のように必ず to を使う。頻出。',
        'SVOC の C の位置に前置詞句が来る形：leave the door open ／ keep the room in order。C は「状態を表す語句」であって品詞は1つに限らない。',
        '間接疑問と whether / if 節の違い：疑問詞のない疑問文（Yes / No 疑問文）を組み込むと whether / if になる（I wonder if he is at home.）。',
      ],
    },
    EG1_1_ITEMS,
  ),
];

// =====================================================================
// eg1_2　② 基本時制と時制の一致
// =====================================================================

const EG1_2_ITEMS: EgItem[] = [
  {
    topic: '現在形は「現在の習慣・不変の事実」を表す（今この瞬間ではない）',
    focus: '不変の事実は現在形',
    sentence: 'Water ______ at 100 degrees Celsius under standard pressure.',
    choices: ['is boiling', 'boils', 'will boil', 'has boiled'],
    answer: '②',
    rate: 74,
    full: 'Water boils at 100 degrees Celsius under standard pressure.',
    translation: '水は標準気圧のもとでは摂氏100度で沸騰する。',
    keyPhrases: [
      { phrase: 'Water boils', meaning: '水は沸騰する（いつでも成り立つ事実なので現在形）' },
      { phrase: 'under standard pressure', meaning: '標準気圧のもとで' },
    ],
    theme: '現在形は「今この瞬間」ではなく「いつでも成り立つこと・習慣」を表す',
    type: '時制判断型',
    difficulty: 1,
    steps: [
      '① 文が「たまたま今起きていること」か「いつでも成り立つこと」かを判定する',
      '② いつでも成り立つ内容（科学的事実・習慣・時刻表）なら現在形',
      '③ 進行形は「今まさに進行中」なので、いつでも成り立つ内容には合わない',
      '④ 未来形・完了形が必要な時の指定（tomorrow / since ~）が無いことを確認する',
    ],
    commentary: [
      '「水は100度で沸騰する」は今日だけの話ではなく、いつでも成り立つ事実です。英語ではこうした不変の事実を現在形で表すので、② boils が正解です。',
      '現在形は名前に反して「今この瞬間」を表しません。表すのは、習慣（I get up at six.）・不変の事実（The sun rises in the east.）・時刻表的な確定予定（The train leaves at nine.）の3つです。「今この瞬間」を言いたいときはむしろ進行形を使います。',
      '① の is boiling は「今まさに沸いている」という一時的な状況です。目の前のやかんの話ならこれで良いのですが、法則の説明には合いません。',
      '③ の will boil は「これから沸くだろう」という予測です。法則は予測ではないので使いません。',
      '④ の has boiled は「沸き終わった」という完了です。文中に since や for のような期間の表現も無く、完了形を使う理由がありません。',
    ],
  },
  {
    topic: '進行形にできない動詞（know / belong / resemble などの状態動詞）',
    focus: '状態動詞は進行形にしない',
    sentence: 'That bag ______ to the woman in the red coat, so please do not move it.',
    choices: ['is belonging', 'belongs', 'is belonged', 'has been belonging'],
    answer: '②',
    rate: 69,
    full: 'That bag belongs to the woman in the red coat, so please do not move it.',
    translation: 'あのかばんは赤いコートの女性のものなので、動かさないでください。',
    keyPhrases: [
      { phrase: 'belongs to', meaning: '〜のものである（状態動詞なので進行形にしない）' },
      { phrase: 'belong', meaning: '所属する・〜のものである（動作ではなく状態）' },
    ],
    theme: '状態を表す動詞は進行形にできない（belong / know / resemble / own / consist）',
    type: '時制判断型',
    difficulty: 2,
    steps: [
      '① 動詞が「動作」か「状態」かを判定する',
      '② 状態動詞（意志で始めたり止めたりできないもの）は進行形にできない',
      '③ 進行形の選択肢をまとめて切る',
      '④ 残った形が能動か受動かを、主語との関係で確認する',
    ],
    commentary: [
      'belong to は「〜のものである」という状態を表す動詞です。状態動詞は「途中でやめる」ことができないため、進行形にはできません。よって ② belongs が正解です。',
      '進行形にできない代表的な動詞は、所有・所属（belong / own / have＝持っている）、知覚・心理（know / believe / understand / want / like）、類似・構成（resemble / consist of）です。「意志で始めたり止めたりできるか」を基準にすると判別できます。',
      '① の is belonging は状態動詞を進行形にした典型的な誤りです。',
      '③ の is belonged は受動態です。belong は自動詞なので受動態にできません。「〜のものである」という訳を「所有される」と考えて受動態にしてしまう誤りが多いところです。',
      '④ の has been belonging も進行形（完了進行形）なので同じ理由で不可です。「ずっと〜のものである」と言いたい場合でも has belonged と完了形にとどめます。',
    ],
  },
  {
    topic: '時・条件の副詞節では未来のことも現在形（when he comes）',
    focus: '時の副詞節に will を入れない',
    sentence: 'I will call you as soon as I ______ at the airport.',
    choices: ['will arrive', 'arrive', 'am arriving', 'will have arrived'],
    answer: '②',
    rate: 63,
    full: 'I will call you as soon as I arrive at the airport.',
    translation: '空港に着いたらすぐに電話します。',
    keyPhrases: [
      { phrase: 'as soon as I arrive', meaning: '着いたらすぐに ※時の副詞節なので未来でも現在形' },
      { phrase: 'as soon as', meaning: '〜するとすぐに（時を表す接続詞）' },
    ],
    theme: '時・条件を表す副詞節の中では、未来の内容でも will を使わず現在形',
    type: '時制判断型',
    difficulty: 3,
    steps: [
      '① 空所を含む節を導く語を確認する（when / as soon as / if / unless など）',
      '② その節が副詞節（無くても文が成り立つ飾り）か、名詞節（文の要素）かを見分ける',
      '③ 副詞節なら、内容が未来でも現在形にする',
      '④ 主節の側は will のままでよいことを確認する（主節と従属節で扱いが違う）',
    ],
    commentary: [
      'as soon as は「〜するとすぐに」という時を表す接続詞です。時や条件を表す副詞節の中では、内容が未来のことであっても will を使わず現在形にします。よって ② arrive が正解です。',
      '主節の I will call は will のままでよい点が重要です。「未来のことは will」という原則が崩れるのは副詞節の内側だけで、主節では通常どおり will を使います。この非対称を意識してください。',
      '① の will arrive は最も選ばれやすい誤答です。日本語の「着いたら」に未来の感覚があるため will を入れたくなりますが、副詞節では不要です。',
      '③ の am arriving は「近い未来の予定」を表せますが、as soon as 節の中では現在形が原則です。',
      '④ の will have arrived は未来完了で、やはり will を含むため副詞節には入れられません。なお同じ形の節でも「いつ来るか分からない」と名詞節になる場合（I do not know when he will come.）は will を使えます。副詞節か名詞節かで判断が変わることを押さえてください。',
    ],
  },
  {
    topic: '時制の一致と、その例外（不変の真理・歴史上の事実）',
    focus: '時制の一致',
    sentence: 'She told me that she ______ busy the following week.',
    choices: ['is', 'will be', 'would be', 'has been'],
    answer: '③',
    rate: 61,
    full: 'She told me that she would be busy the following week.',
    translation: '彼女は翌週は忙しくなるだろうと私に言った。',
    keyPhrases: [
      { phrase: 'would be busy', meaning: '忙しくなるだろう（will が told に合わせて would になった形）' },
      { phrase: 'the following week', meaning: 'その翌週（過去の話の中の「来週」。next week は使わない）' },
    ],
    theme: '主節が過去なら従属節も過去にそろえる（will → would）',
    type: '時制判断型',
    difficulty: 3,
    steps: [
      '① 主節の動詞の時制を確認する（ここは told で過去）',
      '② 従属節の内容が、主節の時点から見て未来かどうかを判定する',
      '③ 主節が過去なら、従属節の will は would に下げる',
      '④ 時を表す語句が the following week（過去基準）であることで裏づけを取る',
    ],
    commentary: [
      '主節が told で過去なので、that 節の中も過去の側にそろえます。彼女が話した時点から見て「翌週」は未来なので will be を使いたくなりますが、主節が過去のため will は would に下がります。正解は ③ would be です。',
      'the following week（その翌週）という表現も手がかりになります。過去の話の中では next week ではなく the following week、yesterday ではなく the previous day のように、基準が過去に移った言い方をします。この語句が見えたら時制の一致を疑ってください。',
      '① の is は現在形で、主節の過去と食い違います。',
      '② の will be は時制の一致を忘れた形です。ただし「今もこれから忙しい」という現在にかかる内容なら will も許容されることがあり、ここでは the following week があるため would が自然です。',
      '④ の has been は現在完了で、やはり主節の過去と合いません。なお時制の一致には例外があり、不変の真理（The teacher said that water boils at 100 degrees.）や歴史上の事実（He said that the war ended in 1945.）は過去に下げません。',
    ],
  },
  {
    topic: '未来を表す形の使い分け（will / be going to / 現在進行形）',
    focus: 'will と be going to',
    sentence: 'Look at those dark clouds. It ______ rain at any moment.',
    choices: ['will', 'is going to', 'shall', 'would'],
    answer: '②',
    rate: 58,
    full: 'Look at those dark clouds. It is going to rain at any moment.',
    translation: 'あの黒い雲を見て。今にも雨が降りそうだ。',
    keyPhrases: [
      { phrase: 'is going to rain', meaning: '雨が降りそうだ（今ある兆候にもとづく予測）' },
      { phrase: 'at any moment', meaning: '今すぐにでも・今にも' },
    ],
    theme: 'be going to は「今ある根拠からの予測・すでに決めていた予定」、will は「その場での判断」',
    type: '時制判断型',
    difficulty: 3,
    steps: [
      '① 未来のことを言っているのは確かなので、どの未来表現かに絞る',
      '② 目に見える根拠（dark clouds）が示されているかを確認する',
      '③ 根拠があるなら be going to、その場で決めた意志なら will',
      '④ 主語が it（天候）なので意志の will とは相性が悪いことも確認する',
    ],
    commentary: [
      '前の文で Look at those dark clouds. と、目に見える根拠がはっきり示されています。今ある兆候から「こうなりそうだ」と予測するときは be going to を使うので、② is going to が正解です。',
      'will と be going to の使い分けは、根拠があるかどうかで決めます。be going to は「今ある根拠からの予測」または「前から決めていた予定」、will は「その場で決めた意志・単なる推量」です。電話が鳴って I will get it.（私が出るよ）と言うのが will の典型で、これは前から決めていたことではありません。',
      '① の will も文法的には可能ですが、根拠が示されている文脈では be going to のほうが自然で、この形の問題では be going to が答えになります。',
      '③ の shall は現在では Shall I ~ ?（〜しましょうか）／Shall we ~ ? という申し出・提案の形が中心で、天候の予測には使いません。',
      '④ の would は過去から見た未来や仮定の意味です。ここは今の話なので合いません。なお決まった予定を表す現在進行形（I am meeting him tomorrow.）も未来表現の一つで、3つを並べて整理しておくと確実です。',
    ],
  },
];

export const egTenseProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg1_2',
      setNo: 1,
      unitTitle: '② 基本時制と時制の一致',
      category: '現在形の正体・状態動詞・時の副詞節・時制の一致・未来表現',
      intro:
        '時制の問題は「いつのことか」を訳から探すと外します。見るのは、文中の時を表す語句（every day / tomorrow / as soon as / the following week）と、動詞が動作か状態かの2点です。この回では、現在形が「今この瞬間」ではないという出発点から、副詞節で will を落とす規則、主節が過去のときに従属節をそろえる規則まで、判断の順序を固定します。',
      summary: [
        '現在形＝習慣・不変の事実・確定した時刻表。「今この瞬間」は進行形。',
        '進行形にできない動詞：belong / know / believe / resemble / own / consist of。',
        '時・条件の副詞節（when / as soon as / if / unless）の中は未来でも現在形。主節は will のまま。',
        '同じ when でも名詞節なら will を使える（I do not know when he will come.）。',
        '主節が過去なら従属節も過去へ（will → would）。例外は不変の真理と歴史上の事実。',
        'be going to＝根拠のある予測・既定の予定／will＝その場の判断・単なる推量。',
      ],
      surroundingKnowledge: [
        'have は「持っている」の意味では進行形にできないが、「食べる・過ごす」の意味では be having と進行形にできる（I am having lunch.）。意味で切り替わる動詞に注意。',
        '現在進行形は「一時的な習慣」も表す（I am living with my aunt this month.）。現在形の「いつもの習慣」との差を意識する。',
        'by the time / until / before / after も時の副詞節を作るので、中は現在形（または現在完了）になる。',
        '間接話法では代名詞・時の副詞も移す：now→then、today→that day、ago→before、here→there。',
        '未来進行形（will be ~ing）は「そのときちょうど〜しているだろう」。予定の確認（Will you be using this room?）にも使い、依頼の will より丁寧。',
      ],
      deepDiveTopics: [
        '確定した予定を表す現在形：The plane takes off at 7:30.（時刻表）。個人の予定には使えず、そちらは現在進行形か be going to になる。',
        '条件節でも will を使える場合：意志を強調する if you will help me（もし手伝ってくれる気があるなら）。「未来の will」ではなく「意志の will」なので許される。',
        '時制の一致をあえてしないことで今の実感を出す場合：He said he is coming.（今も来る予定だ）。試験では原則どおり would にしておくのが安全。',
        'be about to do（まさに〜しようとしている）／be on the point of ~ing は be going to より直前。時間の近さで未来表現を並べ替えられるようにする。',
      ],
    },
    EG1_2_ITEMS,
  ),
];
