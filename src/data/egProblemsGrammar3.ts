/**
 * 英文法　⑤ 受動態・知覚動詞・使役動詞 / ⑥ 不定詞
 *
 * ★規約★ 各問の `topic` は englishGrammarData.ts の topics を一字一句写す。
 */

import { buildEgSet, type EgItem, type GrammarProblem } from './englishGrammarKit';

// =====================================================================
// eg1_5　⑤ 受動態・知覚動詞・使役動詞
// =====================================================================

const EG1_5_ITEMS: EgItem[] = [
  {
    topic: '受動態の作り方と by 以外の前置詞（be known to / be filled with）',
    focus: 'be known to',
    sentence: 'This old tower is known ______ almost everyone who lives in this city.',
    choices: ['by', 'to', 'with', 'for'],
    answer: '②',
    rate: 61,
    full: 'This old tower is known to almost everyone who lives in this city.',
    translation: 'この古い塔は、この街に住むほとんどの人に知られている。',
    keyPhrases: [
      { phrase: 'is known to', meaning: '〜に知られている（by ではなく to）' },
      { phrase: 'almost everyone', meaning: 'ほとんどの人（後ろが人であることが to の決め手）' },
    ],
    theme: '受動態の相手を by 以外の前置詞で示す慣用（be known to / be filled with / be covered with）',
    type: '語法判断型',
    difficulty: 3,
    steps: [
      '① 受動態だと分かったら、後ろの前置詞が by で良いかを確認する',
      '② be known は前置詞ごとに意味が変わる特別な語なので、意味から決める',
      '③ 「〜に知られている」なら to、「〜で有名」なら for、「〜として知られる」なら as',
      '④ 後ろが人（everyone）であることを手がかりに to を選ぶ',
    ],
    commentary: [
      'be known は後ろの前置詞で意味が変わります。「〜に知られている」と知っている人を示すときは to を使うので、② が正解です。後ろが everyone（人）であることも決め手になります。',
      'be known の前置詞は3つセットで覚えます。be known to＋人（〜に知られている）／be known for＋特徴（〜で有名である）／be known as＋肩書き（〜として知られている）。同じ形で意味が変わる典型です。',
      '① の by は受動態の行為者を示す基本の前置詞ですが、know は「知る」という状態に近い動詞なので、慣用的に to を使います。ここが最も選ばれやすい誤答です。',
      '③ の with は be filled with（〜で満たされる）／be covered with（〜で覆われる）／be satisfied with（〜に満足する）のように、中身・材料・感情の対象を示すときに使います。',
      '④ の for は be known for（〜で有名）なら正しい形ですが、後ろが人だと「人で有名」となって意味が通りません。前置詞は「後ろに何が来るか」もあわせて判断してください。',
    ],
  },
  {
    topic: '第4文型・第5文型の受動態（O が2つある文の受け身）',
    focus: '第4文型の受動態',
    sentence: 'He ______ a new nickname by his teammates after the final game.',
    choices: ['gave', 'was given', 'was gave', 'giving'],
    answer: '②',
    rate: 68,
    full: 'He was given a new nickname by his teammates after the final game.',
    translation: '彼は最終戦のあと、チームメイトから新しいあだ名をつけられた。',
    keyPhrases: [
      { phrase: 'was given a new nickname', meaning: '新しいあだ名を与えられた（第4文型の受動態）' },
      { phrase: 'by his teammates', meaning: 'チームメイトによって（行為者）' },
    ],
    theme: '目的語が2つある文の受動態。残った目的語は動詞の後ろに残る',
    type: '態判断型',
    difficulty: 2,
    steps: [
      '① by＋人（by his teammates）があることから、受動態だと当たりをつける',
      '② 空所の後ろに名詞（a new nickname）が残っていることを確認する',
      '③ 第4文型の受動態では、もう一方の目的語が動詞の後ろに残ると理解する',
      '④ be＋過去分詞の形が正しく作られている選択肢を選ぶ',
    ],
    commentary: [
      'by his teammates という行為者が示されているので受動態です。もとの文は His teammates gave him a new nickname. で、目的語が him と a new nickname の2つあります。人を主語にして受動態にすると、もう一方の目的語 a new nickname は動詞の後ろに残ります。よって ② was given が正解です。',
      '「受動態にしたら後ろに名詞は残らない」と覚えていると、この形で必ず迷います。第4文型は目的語が2つあるので、1つを主語にしても、もう1つが残るのが当然だと考えてください。',
      '① の gave は能動態で、これでは「彼があだ名をつけた」ことになり、by his teammates と矛盾します。',
      '③ の was gave は、be 動詞のあとに過去形を置いた誤りです。受動態は必ず be＋過去分詞（given）です。',
      '④ の giving は現在分詞で、be 動詞がないため述語動詞になれません。なお第5文型の受動態（He was elected chairman.）でも同様に C が後ろに残ります。',
    ],
  },
  {
    topic: '群動詞の受動態（be laughed at / be spoken to）',
    focus: '群動詞の受動態',
    sentence: 'The new student ______ at by some of his classmates, and he almost cried.',
    choices: ['laughed', 'was laughed', 'was laughing', 'has laughed'],
    answer: '②',
    rate: 55,
    full: 'The new student was laughed at by some of his classmates, and he almost cried.',
    translation: 'その転校生は何人かのクラスメイトに笑われ、泣きそうになった。',
    keyPhrases: [
      { phrase: 'was laughed at', meaning: '笑われた（laugh at をひとかたまりで受動態にする）' },
      { phrase: 'laugh at', meaning: '〜を笑う（自動詞＋前置詞で他動詞のはたらき）' },
    ],
    theme: '「動詞＋前置詞」は1つの他動詞として扱い、受動態でも前置詞を残す',
    type: '態判断型',
    difficulty: 3,
    steps: [
      '① 空所の直後に前置詞 at が残っていることに注目する',
      '② 前置詞が浮いているのは、群動詞（laugh at）を受動態にした証拠',
      '③ 群動詞は前置詞まで含めて1つの他動詞なので、be＋過去分詞＋前置詞の形になる',
      '④ by＋行為者があることで受動態だと確定する',
    ],
    commentary: [
      '空所の直後に at が残り、そのあとに by ~ が続いています。これは laugh at（〜を笑う）という群動詞を受動態にした形です。前置詞は動詞の一部なので消えずに残ります。よって ② was laughed が正解です。',
      'laugh at / speak to / look after / take care of のような「動詞＋前置詞」は、1つの他動詞として働きます。受動態にすると be laughed at / be spoken to / be looked after のように前置詞が動詞のすぐ後ろに残るのが特徴です。「前置詞が2つ並んでいる（at by）」のを見たら群動詞の受動態を疑ってください。',
      '① の laughed は能動態で、laughed at by ~ という語順が成り立ちません。',
      '③ の was laughing は過去進行形の能動態で、「笑っていた」となり、笑われた側である主語と噛み合いません。',
      '④ の has laughed も能動態です。態の判断は「主語がするのか、されるのか」で決めます。ここでは転校生は笑われる側です。',
    ],
  },
  {
    topic: '知覚動詞（see / hear / feel）＋O＋原形／~ing／p.p.',
    focus: '知覚動詞＋O＋p.p.',
    sentence: 'I heard my name ______ from somewhere behind me.',
    choices: ['call', 'called', 'to call', 'calling'],
    answer: '②',
    rate: 59,
    full: 'I heard my name called from somewhere behind me.',
    translation: '私は自分の名前が背後のどこかから呼ばれるのを聞いた。',
    keyPhrases: [
      { phrase: 'heard my name called', meaning: '名前が呼ばれるのを聞いた（O と C が受動の関係）' },
      { phrase: 'from somewhere behind me', meaning: '私の背後のどこかから' },
    ],
    theme: '知覚動詞の C は、O が「する」なら原形／~ing、「される」なら過去分詞',
    type: '準動詞判断型',
    difficulty: 3,
    steps: [
      '① 知覚動詞（hear）の後ろが O＋C の第5文型になっていることを確認する',
      '② O（my name）が「呼ぶ」のか「呼ばれる」のかを判定する',
      '③ 「される」関係なら C は過去分詞',
      '④ 知覚動詞のあとに to 不定詞は置けないことも確認する',
    ],
    commentary: [
      'O にあたる my name は「呼ぶ」ものではなく「呼ばれる」ものです。O と C が受動の関係にあるとき、C には過去分詞を置くので ② called が正解です。',
      '知覚動詞の第5文型は、O と C の関係で C の形が決まります。O がする側なら原形（動作の全体を見た・聞いた）か ~ing（進行中の一場面）、O がされる側なら過去分詞です。I saw him cross the street.（渡りきるのを見た）／I saw him crossing the street.（渡っている途中を見た）／I saw the window broken.（窓が割られたのを見た）と並べて確認してください。',
      '① の call は原形で、「名前が（誰かを）呼ぶ」という能動の関係になってしまいます。',
      '③ の to call は to 不定詞です。知覚動詞・使役動詞の後ろでは to が消えるのが原則で、能動態では to は使いません。ただし受動態にすると to が復活し、He was heard to sing. となります。この点は狙われやすいので押さえておきましょう。',
      '④ の calling は現在分詞で、これも「名前が呼んでいる」という能動の関係になり不適です。',
    ],
  },
  {
    topic: '使役動詞 make / have / let ＋O＋原形と get / help の扱い',
    focus: '使役動詞＋原形',
    sentence: 'My parents would not let me ______ out after ten at night.',
    choices: ['to go', 'going', 'go', 'gone'],
    answer: '③',
    rate: 73,
    full: 'My parents would not let me go out after ten at night.',
    translation: '両親は夜10時以降、私を外出させてくれなかった。',
    keyPhrases: [
      { phrase: 'let me go out', meaning: '私が外出するのを許す（let＋O＋原形）' },
      { phrase: 'would not let', meaning: '（どうしても）許してくれなかった' },
    ],
    theme: '使役動詞 make / have / let は O のあとに原形不定詞を取る',
    type: '準動詞判断型',
    difficulty: 2,
    steps: [
      '① 動詞が使役動詞（make / have / let）かどうかを確認する',
      '② 使役動詞なら O のあとは原形不定詞。to は付けない',
      '③ O が「する」側なので、過去分詞ではないことを確認する',
      '④ get / help は例外的に to を取れることも思い出す',
    ],
    commentary: [
      'let は使役動詞で、O のあとに原形不定詞を取ります。よって ③ go が正解です。let A do は「Aが〜するのを許す・させてやる」という意味です。',
      '使役動詞は3つを意味の強さで整理します。make A do（強制的に〜させる）／have A do（頼んで〜してもらう）／let A do（〜するのを許す）。いずれも to を付けません。',
      '① の to go は最も多い誤答です。日本語の「〜させる」から allow me to go や want me to go と同じ形にしてしまう誤りですが、let は to を取りません。allow / want / tell / ask は to を取る、と対比して覚えてください。',
      '② の going は現在分詞で、使役動詞の C には使えません。',
      '④ の gone は過去分詞で、O が「される」関係のときの形です。have my hair cut（髪を切ってもらう）のように O がされる側なら過去分詞になりますが、ここでは私が「行く」側なので不適です。なお get は get A to do、help は help A (to) do と、使役に近い意味で to を取れる例外です。',
    ],
  },
];

export const egPassiveProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg1_5',
      setNo: 1,
      unitTitle: '⑤ 受動態・知覚動詞・使役動詞',
      category: 'by 以外の前置詞・第4/第5文型の受動態・群動詞・知覚動詞・使役動詞',
      intro:
        '態の問題は「主語がするのか、されるのか」を最初に決め、そのあと形を整えます。この回の前半では、受動態でも目的語や前置詞が後ろに残る形（第4文型の受動態・群動詞の受動態）を扱い、「受動態の後ろには何も来ない」という思い込みを外します。後半は知覚動詞・使役動詞で、O と C の関係が能動か受動かによって原形・~ing・過去分詞を選び分ける手順を固定します。',
      summary: [
        'be known to＋人／be known for＋特徴／be known as＋肩書き。by 以外の前置詞を取る受動態がある。',
        '第4文型の受動態では、もう一方の目的語が動詞の後ろに残る（He was given a nickname.）。',
        '第5文型の受動態でも C が残る（He was elected chairman.）。',
        '群動詞（laugh at / speak to / look after）は前置詞まで含めて受動態にする。「前置詞＋by」の並びが目印。',
        '知覚動詞＋O＋C：O がする側なら原形（全体）か ~ing（途中）、される側なら過去分詞。',
        '使役動詞 make / have / let ＋O＋原形。to を取るのは get A to do / help A (to) do。',
      ],
      surroundingKnowledge: [
        '受動態にできない動詞：resemble / have（持っている）/ become / lack など。状態を表す他動詞は受け身にしない。',
        'by＋行為者を書かない受動態が普通の場合：行為者が一般の人、不明、または明らかなとき（English is spoken here.）。',
        '感情を表す動詞は受動態で使う：be surprised at / be interested in / be disappointed with。もともと「驚かせる」という他動詞だから。',
        '使役の受動態：make は受動態で to が復活する（He was made to work overtime.）。let の受動態は使わず be allowed to で代用する。',
        'have A done は「してもらう」だけでなく「されてしまう（被害）」も表す：I had my bag stolen.',
      ],
      deepDiveTopics: [
        'get＋過去分詞（get injured / get married）は「動きのある受動」。be 動詞より変化の瞬間を強調する。',
        'It is said that ~ ／He is said to ~ の書き換え。that 節の主語を上げると to 不定詞になり、時のずれがあれば to have p.p. になる。',
        '知覚動詞 see / hear と notice / watch / observe / listen to の違い。listen to は前置詞が入るが、受動態では be listened to になる。',
        'help の to は米語では省略が一般的だが、受動態（was helped to do）では省略しない。語法は能動と受動で挙動が変わることがある。',
      ],
    },
    EG1_5_ITEMS,
  ),
];

// =====================================================================
// eg2_1　⑥ 不定詞（3用法と重要構文）
// =====================================================================

const EG2_1_ITEMS: EgItem[] = [
  {
    topic: '名詞・形容詞・副詞の3用法の判別',
    focus: '形容詞用法の不定詞',
    sentence: 'I have a lot of work ______ before the deadline on Friday.',
    choices: ['finish', 'to finish', 'finishing', 'finished'],
    answer: '②',
    rate: 70,
    full: 'I have a lot of work to finish before the deadline on Friday.',
    translation: '金曜の締め切りまでに終わらせなければならない仕事がたくさんある。',
    keyPhrases: [
      { phrase: 'work to finish', meaning: '終わらせるべき仕事（名詞を後ろから説明する形容詞用法）' },
      { phrase: 'before the deadline', meaning: '締め切りまでに' },
    ],
    theme: '不定詞の形容詞用法は「〜すべき／〜するための」と直前の名詞を説明する',
    type: '準動詞判断型',
    difficulty: 2,
    steps: [
      '① 空所の直前が名詞（work）であることを確認する',
      '② 名詞を後ろから説明しているなら、形容詞用法の不定詞か分詞',
      '③ 「これから終わらせる」という未来向きの内容なら to 不定詞',
      '④ 過去分詞は「すでにされた」意味になるので合わないと判断する',
    ],
    commentary: [
      '空所の直前は work という名詞で、空所以降がその work を説明しています。「これから終わらせるべき仕事」という未来に向かう内容なので、形容詞用法の to 不定詞 ② to finish が正解です。',
      '不定詞の3用法は「文の中での役割」で見分けます。名詞用法は主語・目的語・補語になる（To read is fun. / I want to read.）、形容詞用法は名詞の後ろから説明する（something to eat）、副詞用法は目的・原因・結果などを表す（I came here to see you.）。空所の前が名詞なら形容詞用法を第一候補にしてください。',
      '① の finish は原形で、名詞のあとに突然原形を置くことはできません。',
      '③ の finishing は現在分詞です。work が「終わらせる」側ではないため、能動の意味を持つ現在分詞は合いません。',
      '④ の finished は過去分詞で「終わらされた仕事」という完了・受動の意味になります。ここは「まだ終わっていない」文脈なので不適です。to 不定詞が未来向き、過去分詞が完了向き、という時間の向きの差が決め手です。',
    ],
  },
  {
    topic: '不定詞の意味上の主語（for A to do / of A to do）',
    focus: 'of A to do',
    sentence: 'It was very kind ______ you to carry my suitcase all the way here.',
    choices: ['for', 'of', 'to', 'with'],
    answer: '②',
    rate: 63,
    full: 'It was very kind of you to carry my suitcase all the way here.',
    translation: 'ここまでずっと私のスーツケースを運んでくださって、本当にご親切にありがとうございます。',
    keyPhrases: [
      { phrase: 'kind of you to carry', meaning: '運んでくれるとは親切だ（人柄を評価するので of）' },
      { phrase: 'all the way', meaning: 'はるばる・ずっと' },
    ],
    theme: '意味上の主語は for A が原則。人柄を評価する形容詞のときだけ of A',
    type: '語法判断型',
    difficulty: 3,
    steps: [
      '① It is ~ to do の形で、to do の主語を示す位置だと確認する',
      '② 直前の形容詞が「人柄の評価」かどうかを判定する（kind / careless / wise / rude）',
      '③ 人柄の評価なら of、それ以外（難易・可能・必要）なら for',
      '④ You are kind. と言い換えられるかで検算する',
    ],
    commentary: [
      '不定詞の意味上の主語は原則 for A ですが、直前の形容詞が人柄を評価するものであれば of A を使います。kind（親切な）は人柄の評価なので、② of が正解です。',
      '検算の方法は簡単です。You are kind. と言い換えて成り立てば of、成り立たなければ for です。It is difficult for you to solve it. は You are difficult. とは言えないので for になります。',
      '① の for は原則の形ですが、kind のような人柄の形容詞のときは of に変わります。この問題で最も選ばれやすい誤答です。',
      '③ の to は、意味上の主語を示す用法を持ちません。',
      '④ の with も同様です。なお人柄を評価する形容詞は kind / nice / good / careless / wise / foolish / rude / brave などで、いずれも「その人がそういう人だ」と言える語です。',
    ],
  },
  {
    topic: '完了不定詞 to have p.p.（述語動詞より前の時）',
    focus: '完了不定詞',
    sentence: 'She seems ______ the news before anyone else told her.',
    choices: ['to know', 'to have known', 'knowing', 'to be known'],
    answer: '②',
    rate: 57,
    full: 'She seems to have known the news before anyone else told her.',
    translation: '彼女は他の誰かが伝える前から、そのニュースを知っていたようだ。',
    keyPhrases: [
      { phrase: 'seems to have known', meaning: '知っていたようだ（seems より前の時を表す完了不定詞）' },
      { phrase: 'before anyone else told her', meaning: '他の誰かが彼女に伝える前に' },
    ],
    theme: '述語動詞より前のことを不定詞で表すときは to have＋過去分詞',
    type: '準動詞判断型',
    difficulty: 4,
    steps: [
      '① 述語動詞の時（seems は現在）を確認する',
      '② 不定詞の内容が、述語動詞と同時か、それより前かを判定する',
      '③ 前のことなら to have＋過去分詞（完了不定詞）にする',
      '④ before ~ told her が「前の時」を示していることで裏づける',
    ],
    commentary: [
      '述語動詞 seems は現在ですが、「知っていた」のは他の人が伝える前、つまり seems より前のことです。不定詞で「述語動詞より前」を表すときは to have＋過去分詞にするので、② to have known が正解です。',
      '完了不定詞は「不定詞の中の過去形」です。She seems to know ~ なら「今知っているようだ」、She seems to have known ~ なら「（過去に）知っていたようだ」となります。that 節に書き換えると It seems that she knew ~ で、時のずれが節の中の時制に現れます。',
      '① の to know は同時の内容を表します。ここでは前後関係があるので不足です。',
      '③ の knowing は動名詞・現在分詞で、seem のあとには置けません。seem は to 不定詞を取る動詞です。',
      '④ の to be known は受動態の不定詞で「知られている」という意味です。彼女はニュースを知る側なので、態が逆になります。',
    ],
  },
  {
    topic: 'too ~ to / enough to / so as to / in order to',
    focus: 'too ~ to',
    sentence: 'The box was too heavy for me ______ up the stairs by myself.',
    choices: ['carry', 'to carry', 'carrying', 'to carrying'],
    answer: '②',
    rate: 68,
    full: 'The box was too heavy for me to carry up the stairs by myself.',
    translation: 'その箱は重すぎて、私一人では階段を運び上げられなかった。',
    keyPhrases: [
      { phrase: 'too heavy to carry', meaning: '重すぎて運べない（too ~ to do は否定の意味を含む）' },
      { phrase: 'by myself', meaning: '自分一人で' },
    ],
    theme: 'too ~ to do は「〜すぎて…できない」。否定語を使わずに否定を表す',
    type: '構文判断型',
    difficulty: 2,
    steps: [
      '① 文中の too に気づく。too があれば to do が続く型を第一候補にする',
      '② for me が不定詞の意味上の主語であることを確認する',
      '③ too ~ (for A) to do の形に当てはめる',
      '④ 訳が「重すぎて運べない」という否定になることを確認する',
    ],
    commentary: [
      '文中に too があり、その後ろに for me（意味上の主語）が置かれています。too ~ (for A) to do は「（Aには）…すぎて〜できない」という型なので、② to carry が正解です。',
      'この構文は否定語を使わずに否定の意味を作る点が重要です。too heavy to carry は「運べないほど重い」で、書き換えると so heavy that I could not carry it となります。so ~ that ... との対応を押さえておくと、書き換え問題にも対応できます。',
      '① の carry は原形で、too とつながる形がありません。',
      '③ の carrying は動名詞・現在分詞で、too ~ to do の型に合いません。',
      '④ の to carrying は to のあとに ~ing を置いた誤りです。to 不定詞の to は前置詞ではないので、後ろは必ず原形になります。なお enough は too と語順が逆で、形容詞のあとに置く（heavy enough to ~）点も合わせて覚えてください。',
    ],
  },
  {
    topic: '原形不定詞をとる形（all you have to do is do）',
    focus: 'All you have to do is ~',
    sentence: 'All you have to do ______ this button and wait for a few seconds.',
    choices: ['is press', 'is pressing to', 'press', 'to press'],
    answer: '①',
    rate: 52,
    full: 'All you have to do is press this button and wait for a few seconds.',
    translation: 'あなたがすべきことは、このボタンを押して数秒待つことだけです。',
    keyPhrases: [
      { phrase: 'All you have to do is press', meaning: 'すべきことは押すことだけだ（is のあとに原形）' },
      { phrase: 'wait for a few seconds', meaning: '数秒待つ' },
    ],
    theme: 'All S have to do is (to) do の形。to は省略され原形が続く',
    type: '構文判断型',
    difficulty: 4,
    steps: [
      '① 文の主語がどこまでかを確定する（All you have to do までが主語）',
      '② 主語のあとに述語動詞（be 動詞）が必要だと気づく',
      '③ All ~ do is のあとは to do の to が省略され、原形が続くと覚える',
      '④ be 動詞が含まれている選択肢に絞ってから形を確認する',
    ],
    commentary: [
      'All you have to do までが主語（あなたがしなければならないことのすべて）で、そのあとに述語動詞が必要です。この構文では be 動詞のあとの to が省略され、原形が続くので ① is press が正解です。',
      'All you have to do is (to) do ~ ／The only thing you have to do is (to) do ~ ／What you should do is (to) do ~ はすべて同じ仲間で、主語の中に do があると to が落ちて原形になります。慣用として形ごと覚えるのが確実です。',
      '② の is pressing to は to が余っており、意味も通りません。',
      '③ の press だけでは述語動詞の be 動詞が無く、All ~ do という主語に対する述語が欠けてしまいます。',
      '④ の to press も同じ理由で不可です。なお do は「代動詞」として直前の動詞を受ける役割も持ち、Why not do as I do?（私と同じようにしたらどうですか）のような使い方もあります。',
    ],
  },
];

export const egInfinitiveProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg2_1',
      setNo: 1,
      unitTitle: '⑥ 不定詞（3用法と重要構文）',
      category: '3用法の判別・意味上の主語・完了不定詞・too ~ to・原形不定詞',
      intro:
        '不定詞は「文の中で何の役をしているか」を決めてから訳します。空所の前が名詞なら形容詞用法、文が完成しているところに付いていれば副詞用法、主語や目的語の位置にあれば名詞用法です。この回ではその判別に加えて、意味上の主語（for A / of A）、述語動詞より前を表す完了不定詞、to が消える構文までを一通り通します。',
      summary: [
        '3用法は役割で判別：名詞用法（主語・目的語・補語）／形容詞用法（名詞の後ろ）／副詞用法（目的・原因・結果）。',
        '意味上の主語は原則 for A。人柄を評価する形容詞（kind / careless / wise / rude）のときだけ of A。',
        '検算：You are kind. と言えるなら of、言えないなら for。',
        '述語動詞より前のことは完了不定詞 to have＋過去分詞。',
        'too ~ (for A) to do＝…すぎて〜できない。書き換えは so ~ that ... cannot。',
        'All you have to do is (to) do ~ では to が省略されて原形が続く。',
      ],
      surroundingKnowledge: [
        '副詞用法の主な意味：目的（〜するために）／結果（…して、その結果〜）／原因（〜して…だ）／条件／判断の根拠（He must be rich to buy that car.）。',
        '結果を表す不定詞は grow up to be / live to be / only to find / never to return の形で固定的に出る。',
        '不定詞の否定は not to do。「〜しないように」は so as not to do / in order not to do。',
        '疑問詞＋to do（what to do / how to use / where to go）は名詞のかたまりになる。',
        '不定詞の受動態は to be p.p.、完了受動は to have been p.p.。時と態を組み合わせて4通りある。',
      ],
      deepDiveTopics: [
        'be to do の5つの意味：予定・義務・可能・運命・意図。文脈で決まるので、まず「予定」から当てるのが実戦的。',
        '難易を表す形容詞の構文：This book is difficult to read.（read の目的語が主語に上がっている）。read it としないのが重要。',
        'seem / appear / happen / prove は to 不定詞と結びついて、that 節に書き換えられる。時のずれは完了不定詞で表す。',
        '原形不定詞をとる慣用：do nothing but do / cannot but do / had better do / would rather do。to の有無で暗記する。',
      ],
    },
    EG2_1_ITEMS,
  ),
];
