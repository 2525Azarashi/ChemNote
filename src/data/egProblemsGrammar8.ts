/**
 * 英文法　⑭ 強調・倒置・省略・同格・無生物主語
 *
 * ★規約★ 各問の `topic` は englishGrammarData.ts の topics を一字一句写す。
 */

import { buildEgSet, type EgItem, type GrammarProblem } from './englishGrammarKit';

// =====================================================================
// eg3_4　⑭ 強調・倒置・省略・同格・無生物主語
// =====================================================================

const EG3_4_ITEMS: EgItem[] = [
  {
    topic: 'It is ~ that ... の強調構文（形式主語との識別）',
    focus: '強調構文',
    sentence: 'It was in this quiet library ______ I first realized how much I enjoyed reading history.',
    choices: ['which', 'that', 'where', 'when'],
    answer: '②',
    rate: 57,
    full: 'It was in this quiet library that I first realized how much I enjoyed reading history.',
    translation: '私が歴史を読むのがどれほど好きかに初めて気づいたのは、この静かな図書館だった。',
    keyPhrases: [
      { phrase: 'It was in this library that', meaning: '〜したのはこの図書館だった（強調構文）' },
      { phrase: 'I first realized', meaning: '私が初めて気づいた' },
    ],
    theme: 'It is ~ that ... の強調構文では、~ に副詞句が来ても that を使う',
    type: '構文判断型',
    difficulty: 3,
    steps: [
      '① It was と that を外して文が成立するか試す → In this library I first realized ... で成立',
      '② 成立するので強調構文だと確定する（形式主語なら外すと崩れる）',
      '③ 強調構文のつなぎ語は that（強調部分が場所でも that）',
      '④ where は関係副詞なので、強調構文のつなぎには使わない',
    ],
    commentary: [
      'It was と空所を取り除くと In this quiet library I first realized ... という完全な文になります。これが強調構文の証拠で、つなぎ語は ② that です。',
      '★強調構文と形式主語の見分け方★ It is と that を外してみて、元の文が成立すれば強調構文、崩れれば形式主語です。It is true that he is honest.（外すと true が浮く＝形式主語）／It was Tom that broke the window.（外すと Tom broke the window. ＝強調構文）。',
      '① の which は関係代名詞で、先行詞となる名詞が必要です。強調されているのは in this quiet library という副詞句なので、関係代名詞は入りません。',
      '③ の where は関係副詞で、先行詞 library を修飾する形なら使えます。しかし It was in this library という前置詞句が強調されている構造では、強調構文のつなぎ語 that が必要です。★前置詞が付いている＝副詞句の強調★ が決め手です。',
      '④ の when は時を表す関係副詞で、強調されているのが場所なので合いません。',
      '★強調できるもの★ 主語・目的語・副詞句を強調できますが、★動詞と補語は強調構文にできません★。動詞を強調するときは do を使います（I do like it.）。',
    ],
  },
  {
    topic: '否定の副詞が文頭に出たときの倒置（Never have I ~）',
    focus: '否定語文頭の倒置',
    sentence: 'Never ______ such a beautiful sunset as the one we saw from the top of that hill.',
    choices: ['I have seen', 'have I seen', 'I saw', 'did I saw'],
    answer: '②',
    rate: 66,
    full: 'Never have I seen such a beautiful sunset as the one we saw from the top of that hill.',
    translation: 'あの丘の頂上から見たような美しい夕日を、私は今まで見たことがない。',
    keyPhrases: [
      { phrase: 'Never have I seen', meaning: '一度も見たことがない（否定語文頭の倒置）' },
      { phrase: 'such a beautiful sunset as', meaning: 'そのような美しい夕日（such ~ as）' },
    ],
    theme: '否定の副詞が文頭に出ると、疑問文と同じ語順（助動詞＋主語＋動詞）になる',
    type: '構文判断型',
    difficulty: 2,
    steps: [
      '① 文頭が Never（否定の副詞）であることを確認する',
      '② 否定語が文頭に出たら倒置が起こる',
      '③ 倒置の語順は「助動詞＋主語＋動詞」＝疑問文と同じ形',
      '④ have I seen を選ぶ',
    ],
    commentary: [
      '文頭に否定の副詞 Never が出ているので倒置が起こり、疑問文と同じ「助動詞＋主語＋動詞」の語順になります。よって ② have I seen が正解です。',
      '倒置を起こす否定語は決まっています。never / little / hardly / scarcely / seldom / rarely / no sooner / not only / under no circumstances。★否定の副詞が文頭＝倒置★ と覚えるだけで対応できます。',
      '① の I have seen は倒置していない普通の語順です。Never が文頭にあるので倒置が必要です。',
      '③ の I saw も倒置していません。加えて「今まで一度も」という経験なので現在完了が適切です。',
      '④ の did I saw は助動詞 did のあとに過去形 saw が来ており、形として誤りです（did のあとは原形）。',
      '★頻出パターン★ Hardly had I arrived when it began to rain.（着いたとたんに雨が降り出した）／No sooner had he sat down than the phone rang.／Not only did he apologize, but he also paid for the damage. いずれも倒置が必要です。',
    ],
  },
  {
    topic: '否定表現（部分否定・二重否定・準否定 hardly / seldom）',
    focus: '部分否定',
    sentence: 'Not ______ student in this class agrees with the new school rule about smartphones.',
    choices: ['any', 'every', 'no', 'none'],
    answer: '②',
    rate: 52,
    full: 'Not every student in this class agrees with the new school rule about smartphones.',
    translation: 'このクラスの全員がスマートフォンに関する新しい校則に賛成しているわけではない。',
    keyPhrases: [
      { phrase: 'Not every student agrees', meaning: '全員が賛成しているわけではない（部分否定）' },
      { phrase: 'the new school rule', meaning: '新しい校則' },
    ],
    theme: 'not＋every / all / always は「すべてが〜ではない」という部分否定',
    type: '構文判断型',
    difficulty: 3,
    steps: [
      '① 空所の前に Not があり、後ろが単数名詞 student であることを確認する',
      '② 単数名詞に付けられるのは every（all は複数名詞）',
      '③ not＋every は部分否定「全員が〜ではない」',
      '④ 述語が agrees（三単現）なので単数扱いの every が整合すると確認する',
    ],
    commentary: [
      '後ろが単数名詞 student で、述語も agrees（三単現）です。単数名詞に付いて部分否定を作るのは every なので、② が正解です。',
      '★部分否定★ は not＋全部を表す語（all / every / both / always / necessarily / quite）で「すべてが〜なわけではない」を表します。★全否定★ は no / none / neither / never を使います。この違いが最頻出です。',
      '① の any は not any＝no で全否定になります。Not any student agrees とすると「誰も賛成していない」という全否定になり、部分否定の意味が出ません。',
      '③ の no は Not no student という二重否定になり、意味も形も成立しません。',
      '④ の none は代名詞なので直後に名詞を置けません（none of the students なら可）。',
      '★準否定の仲間★ hardly / scarcely（ほとんど〜ない）／seldom / rarely（めったに〜ない）／few / little（ほとんどない）。not を使わずに否定の意味を出すので、★1文に2つ入れると二重否定★ になってしまいます。',
    ],
  },
  {
    topic: '同格の that / of と挿入・省略（共通関係）',
    focus: '同格の that',
    sentence: 'The scientists announced the surprising fact ______ the ice in that region was melting far faster than expected.',
    choices: ['which', 'that', 'what', 'of which'],
    answer: '②',
    rate: 61,
    full: 'The scientists announced the surprising fact that the ice in that region was melting far faster than expected.',
    translation: '科学者たちは、その地域の氷が予想よりはるかに速く融けているという驚くべき事実を発表した。',
    keyPhrases: [
      { phrase: 'the fact that the ice was melting', meaning: '氷が融けているという事実（同格の that）' },
      { phrase: 'far faster than expected', meaning: '予想よりはるかに速く' },
    ],
    theme: '名詞の内容を説明する that は同格の接続詞。後ろは完全な文になる',
    type: '構文判断型',
    difficulty: 3,
    steps: [
      '① 空所以降を見る → the ice was melting ... で名詞の欠けがない完全な文',
      '② 完全な文なので関係代名詞ではない',
      '③ 前の名詞 fact の内容を説明している → 同格の that',
      '④ 同格の that を取れる名詞（fact / idea / news / belief）だと確認する',
    ],
    commentary: [
      '空所以降は the ice in that region was melting ... と名詞の欠けがない完全な文です。前の名詞 fact の中身を説明しているので、同格の接続詞 ② that が正解です。',
      '★同格の that と関係代名詞の that の違い★ 同格の that のあとは完全な文（＝fact の内容そのもの）。関係代名詞の that のあとは名詞が1つ欠けた不完全な文。この一点で確実に区別できます。',
      '① の which は関係代名詞なので、節の中に名詞の欠けが必要です。この節は完全なので入りません。',
      '③ の what は先行詞を含む関係代名詞で、the surprising fact という先行詞がある位置には使えません。',
      '④ の of which は「前置詞＋関係代名詞」で、後ろの節に副詞句の欠けが必要です。この節は完全に成立しているため不要です。',
      '★同格の that を取れる名詞★ fact / idea / news / belief / hope / possibility / conclusion / evidence など「内容を持つ抽象名詞」です。逆に ★同格の of★ を使う名詞もあります（the idea of going abroad）。that のあとは文、of のあとは名詞・動名詞です。',
    ],
  },
  {
    topic: '無生物主語構文（This road will take you to ~）',
    focus: '無生物主語',
    sentence: 'A ten-minute walk along this river ______ you to the museum you are looking for.',
    choices: ['will bring', 'will come', 'will go', 'will arrive'],
    answer: '①',
    rate: 59,
    full: 'A ten-minute walk along this river will bring you to the museum you are looking for.',
    translation: 'この川沿いを10分歩けば、お探しの美術館に着きますよ。',
    keyPhrases: [
      { phrase: 'A ten-minute walk will bring you to', meaning: '10分歩けば〜に着く（無生物主語）' },
      { phrase: 'you are looking for', meaning: 'あなたが探している' },
    ],
    theme: '無生物主語＋bring / take / lead A to B は「〜すれば A は B に着く」',
    type: '語法判断型',
    difficulty: 3,
    steps: [
      '① 主語が A ten-minute walk（人ではない）だと確認する',
      '② 空所の後ろに you という目的語があるので他動詞が必要',
      '③ come / go / arrive は自動詞なので目的語を取れない',
      '④ 他動詞 bring を選ぶ',
    ],
    commentary: [
      '空所の後ろに目的語 you があるので、他動詞が必要です。come / go / arrive はいずれも自動詞なので、他動詞の ① will bring が正解です。',
      '無生物主語構文の定番は3つです。★bring / take / lead A to B★（A を B へ連れて行く＝〜すれば着く）／★make A do★（A に〜させる）／★prevent / keep A from doing★（A が〜するのを妨げる）。いずれも他動詞であることが共通点です。',
      '② の come は自動詞で、come you という形は作れません。',
      '③ の go も自動詞で、目的語を取れません。',
      '④ の arrive も自動詞で、arrive at ~ のように前置詞が必要です。',
      '★訳し方のコツ★ 無生物主語は「主語を副詞的に、目的語を主語のように」訳すと自然になります。A ten-minute walk will bring you to ~ → 「10分歩けば、あなたは〜に着く」。直訳の「10分の歩行があなたを連れて行く」では不自然です。',
    ],
  },
];

export const egSpecialProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg3_4',
      setNo: 1,
      unitTitle: '⑭ 強調・倒置・省略・同格・無生物主語',
      category: '強調構文・否定語文頭の倒置・部分否定・同格の that・無生物主語',
      intro:
        '特殊構文は「普通の語順から外れた形」を集めた単元です。共通する解き方は ★いったん普通の語順に戻してみる★ こと。強調構文なら It is と that を外し、倒置なら助動詞を主語の後ろに戻し、無生物主語なら主語を副詞的に訳し直します。戻して意味が通るかどうかで、その構文かどうかを判定できます。同格の that は「後ろが完全な文か」という関係詞と同じ基準で判別でき、部分否定は「not と組む語が全部を表す語か」だけを見れば決まります。',
      summary: [
        '強調構文は It is と that を外して文が成立するか試す。成立すれば強調構文、崩れれば形式主語。',
        '副詞句が強調されているときも、つなぎ語は that（where / when にはしない）。',
        '否定の副詞（never / hardly / seldom / not only / no sooner）が文頭に出ると倒置が起こる。',
        '部分否定は not＋all / every / both / always / necessarily。全否定は no / none / neither / never。',
        '同格の that のあとは完全な文。関係代名詞の that のあとは名詞が欠けた不完全な文。',
        '無生物主語＋他動詞（bring / take / lead / make / prevent）。主語を副詞的に訳すと自然になる。',
      ],
      surroundingKnowledge: [
        '動詞の強調には do を使う：I do believe you.（強調構文では動詞を強調できない）',
        '譲歩・場所の副詞句が文頭に出ても倒置が起こる：On the hill stands an old castle.',
        'so / neither による倒置：So do I.（私もそうだ）／Neither did he.（彼もしなかった）',
        '共通関係の省略：He can, and often does, help us.（and のあとの共通要素を省く）',
        'as / than のあとの省略：He is taller than I (am).／He works as hard as she (does).',
      ],
      deepDiveTopics: [
        'なぜ否定語が文頭に出ると倒置するのか。英語では文頭は「話題」の位置で、そこに否定の焦点を置くと、通常の主語・述語の順序が崩れて助動詞が引き上げられる。疑問文と同じ語順になるのは、疑問も否定も「命題を保留する」機能を持つため。',
        '強調構文が動詞を強調できないのは、It is ~ that の ~ の位置が名詞句・副詞句に限られるため。動詞は文の骨格そのものであり、切り出して前置できない。だから do による強調という別の手段が用意されている。',
        '無生物主語構文が英語で自然なのは、英語が「原因を主語にする」傾向を持つ言語だから。日本語は「人を主語にする」傾向が強いため、直訳すると不自然になる。この差は語順ではなく発想の差であり、訳し方の工夫が必要になる。',
        '部分否定と全否定の差は、否定のスコープ（作用範囲）の違い。not every は「every 全体」を否定するので「全員というわけではない」、no は個々を否定するので「誰も〜ない」となる。論理学の量化子の順序と同じ構造をしている。',
      ],
    },
    EG3_4_ITEMS,
  ),
];
