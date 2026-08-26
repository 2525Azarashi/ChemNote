/**
 * 英文法　③ 完了形 / ④ 助動詞
 *
 * ★規約★ 各問の `topic` は englishGrammarData.ts の topics を一字一句写す。
 *         （単元の宣言と問題の対応を検査で機械的に確認するため）
 */

import { buildEgSet, type EgItem, type GrammarProblem } from './englishGrammarKit';

// =====================================================================
// eg1_3　③ 完了形（現在・過去・未来）
// =====================================================================

const EG1_3_ITEMS: EgItem[] = [
  {
    topic: '現在完了の4用法（完了・結果・経験・継続）',
    focus: '経験の現在完了',
    sentence: 'I ______ to Kyoto three times, so I can show you around.',
    choices: ['went', 'have been', 'have gone', 'had been'],
    answer: '②',
    rate: 67,
    full: 'I have been to Kyoto three times, so I can show you around.',
    translation: '私は京都に3回行ったことがあるので、案内できます。',
    keyPhrases: [
      { phrase: 'have been to', meaning: '〜へ行ったことがある（経験）※have gone to は「行ってしまった」' },
      { phrase: 'three times', meaning: '3回（回数を表す語は経験の現在完了と結びつく）' },
    ],
    theme: '経験を表す現在完了。have been to と have gone to の差',
    type: '時制判断型',
    difficulty: 2,
    steps: [
      '① 回数を表す語句（three times / ever / never）があるかを見る。あれば経験',
      '② 経験なら現在完了。過去形は「そのときの出来事」で、今につながらない',
      '③ have been to（行ったことがある）と have gone to（行ってしまって今いない）を区別する',
      '④ 後半 so I can show you around（＝今ここにいる）と矛盾しない形を選ぶ',
    ],
    commentary: [
      'three times（3回）という回数の表現があるので、これは経験を表す現在完了です。さらに「行ったことがある」は have been to、「行ってしまって今ここにいない」は have gone to と使い分けるので、② have been が正解です。',
      '現在完了には完了（just / already / yet）・結果（gone / lost）・経験（ever / never / 回数）・継続（for / since）の4用法があります。どの用法かは、いっしょに使われる語句で決まります。まず目印の語を探す習慣をつけてください。',
      '① の went は過去形で、「あのとき行った」という過去の一点の話になります。「案内できる」という現在の能力の根拠にはなりません。',
      '③ の have gone は「行ってしまった（今ここにいない）」という結果の意味です。後半の so I can show you around（案内できる＝今ここにいる）と矛盾します。',
      '④ の had been は過去完了で、過去のある時点より前を表します。基準となる過去の時点が文中に無いので使えません。',
    ],
  },
  {
    topic: '現在完了と過去形の使い分け（yesterday とは共起しない）',
    focus: '過去の一点は過去形',
    sentence: 'I ______ my wallet on the train yesterday, so I had to walk home.',
    choices: ['have lost', 'lost', 'had lost', 'have been losing'],
    answer: '②',
    rate: 72,
    full: 'I lost my wallet on the train yesterday, so I had to walk home.',
    translation: '私は昨日、電車で財布をなくしたので、歩いて帰らなければならなかった。',
    keyPhrases: [
      { phrase: 'lost my wallet yesterday', meaning: '昨日財布をなくした（yesterday があるので過去形）' },
      { phrase: 'had to walk home', meaning: '歩いて帰らねばならなかった（have to の過去形）' },
    ],
    theme: '過去の一点を指す語（yesterday / last week / in 2020 / ago）は現在完了と共存できない',
    type: '時制判断型',
    difficulty: 2,
    steps: [
      '① 文中に過去の一点を指す語句があるかを探す',
      '② あれば現在完了は使えない。現在完了は「今」とつながる形だから',
      '③ 過去形か過去完了かを、基準となる別の過去があるかで決める',
      '④ 基準が無ければ単純過去にする',
    ],
    commentary: [
      'yesterday という過去の一点を指す語があります。現在完了は「今どうなっているか」を語る形なので、過去の一点を指す語（yesterday / last week / three days ago / in 2020）とはいっしょに使えません。よって ② lost が正解です。',
      '同じ内容でも I have lost my wallet.（財布をなくしてしまって今も無い）なら現在完了で言えます。決めるのは内容ではなく、時を指定する語があるかどうかです。',
      '① の have lost はこの規則に反します。日本語の「なくした」だけでは判別できないので、必ず時の語句を探してください。',
      '③ の had lost は過去完了で、「別の過去の時点より前」を表します。ここでは基準となる過去の時点が示されていないので不要です。',
      '④ の have been losing は完了進行形で「ずっとなくし続けている」という不自然な意味になります。lose は一瞬で終わる動作なので、継続の進行形と相性が悪い点も押さえておきましょう。',
    ],
  },
  {
    topic: '過去完了は「過去のある時点より前」を表す大過去',
    focus: '過去完了（大過去）',
    sentence: 'When I got to the platform, the train ______ .',
    choices: ['already left', 'has already left', 'had already left', 'would already leave'],
    answer: '③',
    rate: 65,
    full: 'When I got to the platform, the train had already left.',
    translation: '私がホームに着いたとき、電車はすでに出発していた。',
    keyPhrases: [
      { phrase: 'had already left', meaning: 'すでに出発してしまっていた（着いた時点より前の出来事）' },
      { phrase: 'when I got to', meaning: '〜に着いたとき（基準になる過去の時点）' },
    ],
    theme: '過去の基準時点より前の出来事は過去完了（had＋過去分詞）で表す',
    type: '時制判断型',
    difficulty: 2,
    steps: [
      '① 文中に過去の出来事が2つあるかを確認する（着いた／出発した）',
      '② どちらが先に起きたかを判定する（出発 → 到着）',
      '③ 基準になる方（あとの出来事）を過去形、それより前を過去完了にする',
      '④ already が「基準時点までに完了していた」を示していることで裏づける',
    ],
    commentary: [
      'この文には「私がホームに着いた」と「電車が出発した」という2つの過去の出来事があります。出発の方が先なので、基準となる got より前を表す過去完了 had already left を使います。正解は ③ です。',
      '過去完了は「過去の中の、さらに前」を示す道具です。過去の出来事が2つ並んだら、時間の前後を確認し、先に起きた方を had＋過去分詞にします。',
      '① の already left は単純過去で、2つの出来事の前後関係が表せません。会話では許容されることもありますが、前後関係を問う設問では過去完了が答えになります。',
      '② の has already left は現在完了で、基準が「今」になってしまいます。主節が got（過去）なので合いません。',
      '④ の would already leave は過去から見た未来です。ここは「着く前にすでに起きていたこと」なので、時間の向きが逆になります。',
    ],
  },
  {
    topic: '未来完了（by the time 節との組み合わせ）',
    focus: '未来完了',
    sentence: 'By the time you get back from your trip, I ______ the report.',
    choices: ['will finish', 'will have finished', 'have finished', 'finish'],
    answer: '②',
    rate: 56,
    full: 'By the time you get back from your trip, I will have finished the report.',
    translation: 'あなたが旅行から帰ってくるまでには、私はその報告書を書き終えているだろう。',
    keyPhrases: [
      { phrase: 'will have finished', meaning: '（そのときまでには）終えているだろう＝未来完了' },
      { phrase: 'by the time', meaning: '〜するまでには（中は未来でも現在形）' },
    ],
    theme: 'by the time＋現在形（未来）に対し、主節は未来完了で「その時点までの完了」を表す',
    type: '時制判断型',
    difficulty: 3,
    steps: [
      '① by the time 節が未来の時点を指していることを確認する（get back は現在形だが未来）',
      '② 主節の内容が「その時点までに終わっている」ことなのかを判定する',
      '③ 「未来のある時点までの完了」は will have＋過去分詞',
      '④ 副詞節側に will が入っていないことと矛盾しないかを確認する',
    ],
    commentary: [
      'by the time は「〜するまでには」という時の副詞節を作るので、中の動詞は未来のことでも現在形（get back）になります。そのうえで主節は「その未来の時点までに終わっているだろう」という完了を表すため、未来完了 will have finished を使います。正解は ② です。',
      '未来完了は「未来のある時点を基準にした完了」です。by ~（〜までには）や by the time ~ とセットで出ることが多く、この目印を見たら will have＋過去分詞を思い出してください。',
      '① の will finish は「そのとき終わらせる」という単純未来で、「までには終わっている」という完了のニュアンスが出ません。by the time との相性が悪い形です。',
      '③ の have finished は現在完了で、基準が今になってしまいます。',
      '④ の finish は現在形です。副詞節の中なら現在形でよいのですが、ここは主節なので現在形にはできません。副詞節と主節で規則が違うことをここでも確認してください。',
    ],
  },
  {
    topic: '完了進行形（have been ~ing）が表す「継続してきた動作」',
    focus: '完了進行形',
    sentence: 'My eyes hurt. I ______ at this screen since nine this morning.',
    choices: ['stare', 'stared', 'have been staring', 'had stared'],
    answer: '③',
    rate: 60,
    full: 'My eyes hurt. I have been staring at this screen since nine this morning.',
    translation: '目が痛い。今朝9時からずっとこの画面を見つめ続けているのだ。',
    keyPhrases: [
      { phrase: 'have been staring', meaning: 'ずっと見つめ続けている（動作の継続＝完了進行形）' },
      { phrase: 'since nine this morning', meaning: '今朝9時から（since は起点を表す）' },
    ],
    theme: '動作動詞の継続は完了進行形。状態動詞の継続は現在完了',
    type: '時制判断型',
    difficulty: 3,
    steps: [
      '① since / for があるかを見る。あれば継続の内容',
      '② 動詞が動作か状態かを判定する（stare は動作）',
      '③ 動作の継続は have been ~ing、状態の継続は have＋過去分詞',
      '④ 前文 My eyes hurt.（今の結果）と結びつく形であることを確認する',
    ],
    commentary: [
      'since nine this morning という起点があるので継続の内容です。stare（じっと見る）は動作動詞なので、継続は完了進行形 have been staring で表します。正解は ③ です。',
      '継続を表すとき、状態動詞（know / live / be）は have known のように現在完了、動作動詞（study / work / rain / stare）は have been studying のように完了進行形にします。この振り分けが完了進行形の使いどころです。',
      '① の stare は現在形で、「いつもの習慣」になってしまいます。since との組み合わせもできません。',
      '② の stared は過去形で、今まで続いているという含みが消えます。前文の My eyes hurt.（今痛い）という結果につながりません。',
      '④ の had stared は過去完了で、基準になる過去の時点が必要です。ここは「今」が基準なので使えません。',
    ],
  },
];

export const egAspectProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg1_3',
      setNo: 1,
      unitTitle: '③ 完了形（現在・過去・未来）',
      category: '4用法・過去形との差・大過去・未来完了・完了進行形',
      intro:
        '完了形は「基準になる時点」と「その時点までに何が起きたか」の2階建てで考えます。基準が今なら現在完了、過去なら過去完了、未来なら未来完了です。この回では、まず文中の目印（three times / yesterday / when ~ / by the time ~ / since ~）を探し、そこから基準時点を決め、最後に動作か状態かで進行形にするかを決める、という3段の手順を固定します。',
      summary: [
        '現在完了の4用法は目印で決まる：完了（just / already / yet）結果（gone / lost）経験（ever / never / 回数）継続（for / since）。',
        'have been to＝行ったことがある／have gone to＝行ってしまって今いない。',
        'yesterday / last week / ~ ago / in 2020 は現在完了と共存できない。',
        '過去の出来事が2つ並んだら、先に起きた方を過去完了（had＋過去分詞）にする。',
        'by the time ~（中は現在形）＋主節 will have＋過去分詞 が未来完了の定型。',
        '継続の言い方：状態動詞は have＋過去分詞、動作動詞は have been ~ing。',
      ],
      surroundingKnowledge: [
        '現在完了は「過去と現在をつなぐ形」。だから過去の一点を指す語と共存できず、When で始まる疑問文（When did you ~?）とも使えない。',
        '経験の回数表現：once / twice / three times / several times。ever は疑問文、never は否定で使う。',
        'have been ~ing と have ~ed の両方が使える動詞（live / work / study）では、進行形の方が一時的・動作的な感じが強くなる。',
        '過去完了は経験も表す：It was the first time I had ever eaten it.（それを食べたのは初めてだった）。',
        '未来完了進行形（will have been ~ing）は「そのときまで〜し続けていることになる」。By next April, I will have been working here for ten years.',
      ],
      deepDiveTopics: [
        '「大過去」としての過去完了：after / before で前後がはっきりしている場合は過去形で済ませることも多い。',
        '結果の現在完了と状態の対応：He has gone out.（今いない）／He has come back.（今いる）。完了形は「今の状態」を語っているという意識を持つ。',
        'since の2つの顔：前置詞（since 2020）と接続詞（since I came here）。接続詞のときは節の中が過去形になる。',
        'This is the first time ~ の後ろは現在完了（This is the first time I have visited Kyoto.）。時の基準が「今」であることの応用。',
      ],
    },
    EG1_3_ITEMS,
  ),
];

// =====================================================================
// eg1_4　④ 助動詞と助動詞＋have p.p.
// =====================================================================

const EG1_4_ITEMS: EgItem[] = [
  {
    topic: 'can / may / must / should の基本義（能力・許可・義務・推量）',
    focus: '推量の must',
    sentence: 'You ______ be tired after such a long walk. Let us take a break.',
    choices: ['must', 'can', 'should', 'may not'],
    answer: '①',
    rate: 70,
    full: 'You must be tired after such a long walk. Let us take a break.',
    translation: 'あんなに長く歩いたのだから、疲れているに違いない。少し休みましょう。',
    keyPhrases: [
      { phrase: 'must be tired', meaning: '疲れているに違いない（義務ではなく強い推量）' },
      { phrase: 'after such a long walk', meaning: 'あんなに長く歩いたあとで（推量の根拠）' },
    ],
    theme: '助動詞は1語で2系統の意味を持つ。must＝義務／〜に違いない',
    type: '意味判断型',
    difficulty: 2,
    steps: [
      '① 空所の後ろが動作か状態かを見る。be tired は状態',
      '② 状態が続く文では「〜しなさい」という義務の解釈が成り立ちにくい',
      '③ よって推量系の意味だと判断し、確信の強さを文脈から決める',
      '④ 根拠（such a long walk）が示されているので、最も強い推量を選ぶ',
    ],
    commentary: [
      'be tired は状態なので、「疲れなさい」という義務の解釈はできません。したがって推量の意味だと判断します。さらに after such a long walk という根拠が示されているので、確信の強い「〜に違いない」の must が入ります。正解は ① です。',
      '助動詞はほぼすべて「①能力・義務など現実の意味」と「②推量の意味」の2系統を持ちます。must は義務（〜しなければならない）と強い推量（〜に違いない）、may は許可（〜してよい）と弱い推量（〜かもしれない）、can は能力（〜できる）と可能性（〜がありうる）です。後ろが状態なら推量、動作なら義務や能力の可能性が高い、と当たりをつけると速くなります。',
      '② の can be tired は「疲れることもありうる」という一般的な可能性の話になり、目の前の相手の状態を言う文にはそぐいません。',
      '③ の should be tired は「疲れているはずだ（当然そうなる）」で意味は近いものの、根拠を示して断定する文脈では must の方が自然です。should は「予定・当然の期待」の色が強い語です。',
      '④ の may not be tired は「疲れていないかもしれない」で、後半の「休みましょう」という提案と矛盾します。',
    ],
  },
  {
    topic: "must not（禁止）と don't have to（不要）の決定的な差",
    focus: '禁止と不要の区別',
    sentence: 'You ______ tell anyone about this plan. It is still a secret.',
    choices: ['do not have to', 'must not', 'need not', 'may not have to'],
    answer: '②',
    rate: 66,
    full: 'You must not tell anyone about this plan. It is still a secret.',
    translation: 'この計画について誰にも話してはいけない。まだ秘密なのだ。',
    keyPhrases: [
      { phrase: 'must not tell', meaning: '話してはいけない（禁止）' },
      { phrase: 'It is still a secret', meaning: 'まだ秘密である（禁止の理由）' },
    ],
    theme: 'must not＝禁止（するな）／do not have to＝不要（しなくてよい）',
    type: '意味判断型',
    difficulty: 2,
    steps: [
      '① 文が「するな」と止めているのか、「しなくてよい」と許しているのかを読む',
      '② 後続文の理由（still a secret）から、止めている文だと判断する',
      '③ 禁止は must not。not have to / need not は不要であって禁止ではない',
      '④ 否定形は must と have to で意味が正反対になることを確認する',
    ],
    commentary: [
      '後続の It is still a secret. が理由なので、この文は「話すな」と止めている文です。禁止を表すのは must not なので ② が正解です。',
      'must と have to は肯定文ではほぼ同じ意味ですが、否定文では意味が正反対になります。must not は禁止（〜してはいけない）、do not have to は不要（〜しなくてよい）です。ここが助動詞で最も差がつく点です。',
      '① の do not have to は「話さなくてよい」で、話しても構わないことになります。秘密だという理由と噛み合いません。',
      '③ の need not も「その必要はない」という不要の意味で、① と同じ理由で不可です。ただし need not have p.p.（〜しなくてよかったのに、してしまった）という形は別途重要なので、区別して覚えてください。',
      '④ の may not have to は「〜しなくてよいかもしれない」で、二重に弱くなっており、強く止めるこの文には合いません。',
    ],
  },
  {
    topic: '助動詞＋have p.p.（過去への推量・後悔・非難）',
    focus: '過去への推量',
    sentence: 'The lights are all off and the car is gone. They ______ home already.',
    choices: ['must go', 'must have gone', 'should go', 'cannot go'],
    answer: '②',
    rate: 62,
    full: 'The lights are all off and the car is gone. They must have gone home already.',
    translation: '電気は全部消えていて車も無い。彼らはもう帰ってしまったに違いない。',
    keyPhrases: [
      { phrase: 'must have gone', meaning: '行ってしまったに違いない（過去への強い推量）' },
      { phrase: 'the car is gone', meaning: '車が無くなっている（推量の根拠）' },
    ],
    theme: '助動詞＋have＋過去分詞は「過去のことへの推量・後悔・非難」',
    type: '意味判断型',
    difficulty: 3,
    steps: [
      '① 推量の対象が今のことか、すでに起きたことかを判定する',
      '② すでに起きたことなら、助動詞のあとを have＋過去分詞にする',
      '③ 確信の強さを文脈で決める（根拠が明確なら must）',
      '④ already（すでに）が過去の完了を示していることで裏づける',
    ],
    commentary: [
      '電気が消え車も無いという現在の証拠から、「もう帰ってしまった」というすでに起きたことを推量しています。過去のことへの推量は助動詞＋have＋過去分詞で表すので、② must have gone が正解です。',
      'この形は次の4つをセットで覚えます。must have p.p.（〜したに違いない）／cannot have p.p.（〜したはずがない）／may have p.p.（〜したかもしれない）／should have p.p.（〜すべきだったのに、しなかった）。最後の should have p.p. だけは推量ではなく後悔・非難で、意味の系統が違う点に注意してください。',
      '① の must go は「行かなければならない・行くに違いない」で、いずれもこれから先の話です。already と噛み合いません。',
      '③ の should go は「行くべきだ」で、証拠から結論を出す文脈に合いません。過去にするなら should have gone ですが、それは「帰るべきだったのに帰らなかった」という非難の意味になります。',
      '④ の cannot go は「行けない・行くはずがない」です。証拠は帰ったことを示しているので、意味が逆になります。',
    ],
  },
  {
    topic: 'used to / would（過去の習慣）と be used to ~ing の区別',
    focus: 'be used to ~ing',
    sentence: 'I ______ living in a big city now, though it was hard at first.',
    choices: ['used to', 'am used to', 'would', 'used'],
    answer: '②',
    rate: 57,
    full: 'I am used to living in a big city now, though it was hard at first.',
    translation: '最初は大変だったが、今では大都市での生活に慣れている。',
    keyPhrases: [
      { phrase: 'am used to living', meaning: '住むことに慣れている（be used to＋動名詞）' },
      { phrase: 'though it was hard at first', meaning: '最初は大変だったけれども' },
    ],
    theme: 'used to do（昔は〜した）と be used to ~ing（〜に慣れている）の識別',
    type: '語法判断型',
    difficulty: 3,
    steps: [
      '① 空所の後ろが原形か ~ing かを見る。ここは living で ~ing',
      '② ~ing が続くなら be used to ~ing（慣れている）の形',
      '③ 文中の now（今）が、過去の習慣ではなく現在の状態を示していることを確認する',
      '④ be 動詞が必要かどうかで最終判断する',
    ],
    commentary: [
      '空所の後ろが living（~ing 形）で、さらに now という現在を示す語があります。「〜することに慣れている」は be used to＋動名詞なので、② am used to が正解です。',
      '見分け方は後ろの形だけで決まります。used to＋動詞の原形なら「昔は〜したものだ（今はしない）」、be used to＋名詞・動名詞なら「〜に慣れている」です。to のあとが原形か ~ing か、これだけを見てください。',
      '① の used to は後ろに原形が必要です。used to live なら「昔は住んでいた」という正しい形になりますが、living とは続きません。また now とも噛み合いません。',
      '③ の would も「昔はよく〜した」という過去の習慣を表しますが、後ろは原形です。なお would は動作の反復にしか使えず、状態には使えない（used to be は言えるが would be は不可）という差も重要です。',
      '④ の used は動詞の過去形で、used living という組み合わせは成り立ちません。',
    ],
  },
  {
    topic: 'had better / may well / may as well などの慣用表現',
    focus: 'may as well',
    sentence: 'It is pouring outside, so we ______ take a taxi rather than walk.',
    choices: ['may well as', 'may as well', 'had well better', 'would rather to'],
    answer: '②',
    rate: 54,
    full: 'It is pouring outside, so we may as well take a taxi rather than walk.',
    translation: '外は土砂降りなので、歩くよりタクシーに乗った方がよさそうだ。',
    keyPhrases: [
      { phrase: 'may as well take', meaning: '（どちらでもよいが）乗った方がよい' },
      { phrase: 'rather than walk', meaning: '歩くよりむしろ（比較の対象を示す）' },
    ],
    theme: '助動詞の慣用表現は語順まで固定。may as well / may well / had better / would rather',
    type: '慣用表現型',
    difficulty: 4,
    steps: [
      '① rather than ~（〜よりむしろ）が後ろにあることを確認する。2つを比べている文',
      '② 「AするよりBした方がまし」を表す慣用表現を思い出す',
      '③ may as well do（〜した方がよい）と may well do（〜するのも当然だ）を区別する',
      '④ 語順が崩れていない選択肢を選ぶ',
    ],
    commentary: [
      'rather than walk と2つの選択肢を比べているので、「歩くよりタクシーの方がまし」という意味の表現が必要です。may as well do は「（どちらでもよいが）〜した方がよい」という消極的な選択を表すので、② が正解です。',
      '似た形で意味が違う3つを並べて覚えます。may as well do＝〜した方がよい（消極的な選択）／may well do＝〜するのも当然だ・たぶん〜だろう／might as well do A as do B＝BするくらいならAした方がまし。語順が1語ずれるだけで意味が変わるので、かたまりで暗記してください。',
      '① の may well as は語順が崩れています。may well と as well の混同で、英語として成立しません。',
      '③ の had well better も語順の誤りです。正しくは had better do（〜した方がよい。しないと困る、という強い忠告）で、well は入りません。',
      '④ の would rather to は to が余っています。正しくは would rather do（むしろ〜したい）、比較を出すなら would rather do A than do B です。助動詞の慣用表現は「to が入るか入らないか」までが出題点になります。',
    ],
  },
];

export const egModalProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg1_4',
      setNo: 1,
      unitTitle: '④ 助動詞と助動詞＋have p.p.',
      category: '基本義の2系統・禁止と不要・過去への推量・used to・慣用表現',
      intro:
        '助動詞は「1語に2つの意味がある」ことを前提に読みます。must は義務と強い推量、may は許可と弱い推量、can は能力と可能性です。どちらの意味かは、後ろが動作か状態か、そして根拠が示されているかで決まります。この回では、意味の2系統を切り分ける手順に加えて、否定で意味が反転する must not / do not have to、過去へ向ける助動詞＋have p.p.、語順まで固定された慣用表現を扱います。',
      summary: [
        '助動詞は「現実の意味（能力・義務・許可）」と「推量の意味」の2系統。後ろが状態なら推量を疑う。',
        'must not＝禁止／do not have to・need not＝不要。否定で意味が正反対になる。',
        '過去への推量は助動詞＋have＋過去分詞。must have（〜したに違いない）／cannot have（〜したはずがない）／may have（〜したかもしれない）。',
        'should have p.p. は推量ではなく後悔・非難（〜すべきだったのに）。',
        'used to＋原形＝昔は〜した／be used to＋~ing＝〜に慣れている。to のあとの形で判別。',
        'may as well do（〜した方がよい）／may well do（〜するのも当然だ）／had better do／would rather do。to の有無まで固定。',
      ],
      surroundingKnowledge: [
        'can の否定 cannot は「〜のはずがない」という強い否定の推量。must（〜に違いない）の反対語として対で覚える。',
        'need は助動詞と一般動詞の両方の顔を持つ。助動詞なら need not do、一般動詞なら do not need to do。',
        'had better は「そうしないと困る」という警告を含むため、目上の人には使いにくい。You should ~ の方が穏やか。',
        'cannot help ~ing（〜せずにはいられない）＝cannot but do。助動詞まわりの慣用として頻出。',
        'Would you mind ~ing? への返答は、承諾なら Not at all.（否定で答える）。mind が「嫌がる」だから。',
      ],
      deepDiveTopics: [
        'need not have p.p.（〜する必要はなかったのに、してしまった）と did not need to do（する必要がなかった。実際にしていない）の差。実際にしたかどうかが違う。',
        'shall の現在の用法：法律・契約文の「〜しなければならない」と、Shall I / Shall we の申し出・提案。日常の未来には will を使う。',
        'ought to は否定で ought not to、疑問で Ought I to ~? と to の位置が動かない。should との書き換えを押さえる。',
        'can の代わりに be able to を使う場面：完了形や未来（I have been able to ~ / I will be able to ~）。助動詞は2つ並べられないため。',
      ],
    },
    EG1_4_ITEMS,
  ),
];
