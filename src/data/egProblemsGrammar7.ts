/**
 * 英文法　⑬ 原級・比較級・最上級と重要表現
 *
 * ★規約★ 各問の `topic` は englishGrammarData.ts の topics を一字一句写す。
 */

import { buildEgSet, type EgItem, type GrammarProblem } from './englishGrammarKit';

// =====================================================================
// eg3_3　⑬ 原級・比較級・最上級と重要表現
// =====================================================================

const EG3_3_ITEMS: EgItem[] = [
  {
    topic: 'as ~ as の原級比較と倍数表現（twice as ~ as）',
    focus: '倍数の原級比較',
    sentence: 'This new stadium can hold ______ as many spectators as the old one could.',
    choices: ['twice', 'two times more', 'twice more', 'double than'],
    answer: '①',
    rate: 62,
    full: 'This new stadium can hold twice as many spectators as the old one could.',
    translation: 'この新しい競技場は、古い競技場の2倍の観客を収容できる。',
    keyPhrases: [
      { phrase: 'twice as many spectators as', meaning: '〜の2倍の観客（倍数＋as ~ as）' },
      { phrase: 'the old one could', meaning: '古い方が収容できたよりも' },
    ],
    theme: '倍数は as ~ as の直前に置く（twice as ~ as）。比較級とは組み合わせない',
    type: '比較判断型',
    difficulty: 2,
    steps: [
      '① 文中に as many ... as があることを確認する → 原級比較',
      '② 倍数は as ~ as の直前に置くのが原則',
      '③ 2倍を表す語は twice（half / three times も同じ位置）',
      '④ 比較級 more と倍数は組み合わせないと確認する',
    ],
    commentary: [
      'as many spectators as という原級比較があるので、倍数はその直前に置きます。2倍は twice なので ① が正解です。',
      '倍数表現の語順は固定です。★倍数＋as＋原級＋as★ の形で、half as ~ as（半分）／twice as ~ as（2倍）／three times as ~ as（3倍）と続きます。2倍だけは two times ではなく twice を使うのが標準です。',
      '② の two times more は倍数と比較級を混ぜた形で、標準的な英語ではありません。また 2倍は twice を使います。',
      '③ の twice more も同様に、倍数と比較級を組み合わせているため不可です。原級比較 as ~ as の中に more は入れられません。',
      '④ の double than は誤りです。double を使うなら double the number of spectators のように名詞を続けます。than とは組みません。',
      '★書き換え★ twice as many spectators as ~ ＝ twice the number of spectators ~。数を扱うときは the number of、量なら the amount of を使う形もあります。',
    ],
  },
  {
    topic: '比較級の強調（much / far / even）※very は不可',
    focus: '比較級の強調',
    sentence: 'The second edition of this dictionary is ______ more useful than the first one.',
    choices: ['very', 'too', 'much', 'so'],
    answer: '③',
    rate: 69,
    full: 'The second edition of this dictionary is much more useful than the first one.',
    translation: 'この辞書の第2版は、初版よりはるかに役に立つ。',
    keyPhrases: [
      { phrase: 'much more useful than', meaning: 'はるかに役に立つ（比較級の強調）' },
      { phrase: 'the first one', meaning: '初版（one は edition の代わり）' },
    ],
    theme: '比較級を強めるのは much / far / even / still / a lot。very は使えない',
    type: '語法判断型',
    difficulty: 2,
    steps: [
      '① more useful than があるので比較級の文だと確認する',
      '② 比較級を強める語は much / far / even / still / a lot / by far',
      '③ very は原級（形容詞そのもの）を強める語なので比較級には使えない',
      '④ much を選ぶ',
    ],
    commentary: [
      'more useful than は比較級です。比較級を強めるのは much / far / even / still / a lot なので、③ much が正解です。',
      '強調語の役割分担を押さえてください。★原級を強める＝very★（very useful）／★比較級を強める＝much / far / even / still / a lot★（much more useful）／★最上級を強める＝by far / much / the very★（by far the best）。',
      '① の very は原級専用です。very more useful とは言えません。日本語の「とても」に引かれて選びやすい最頻出の誤答です。',
      '② の too は「〜すぎる」で、比較級を強める働きはありません。too useful なら「役に立ちすぎる」という別の意味になります。',
      '④ の so は「そんなに」で原級を修飾します。so more とは言えません。',
      '★even / still のニュアンス★ even more useful は「（すでに役に立つが）さらにいっそう」という含みを持ちます。much / far は単純に差の大きさを示します。',
    ],
  },
  {
    topic: '最上級・the＋比較級（of the two）・no more than 系',
    focus: 'of the two と the＋比較級',
    sentence: 'Of the two proposals presented today, this one is clearly ______ practical.',
    choices: ['more', 'the more', 'most', 'the most'],
    answer: '②',
    rate: 50,
    full: 'Of the two proposals presented today, this one is clearly the more practical.',
    translation: '今日示された2つの提案のうち、こちらの方が明らかに実用的だ。',
    keyPhrases: [
      { phrase: 'of the two proposals', meaning: '2つの提案のうち（比較の対象が2つ）' },
      { phrase: 'the more practical', meaning: 'より実用的な方（the＋比較級）' },
    ],
    theme: '2つのうちで「〜な方」と限定するときは the＋比較級。最上級は3つ以上',
    type: '比較判断型',
    difficulty: 3,
    steps: [
      '① 比較の対象がいくつあるかを確認する → of the two（2つ）',
      '② 2つの比較なので最上級は使わず比較級',
      '③ 「2つのうちの一方」と特定されるので the が必要',
      '④ the more を選ぶ',
    ],
    commentary: [
      'of the two（2つのうち）とあるので、3つ以上を前提とする最上級は使えません。2つのうち一方に特定されるので the が付き、② the more が正解です。',
      '数で使い分けます。★2つの比較＝the＋比較級＋of the two★／★3つ以上＝the＋最上級★。the が付くのは「どちらか一方に特定される」からで、これは最上級に the が付く理由と同じです。',
      '① の more は the が抜けています。単なる比較級だと「より実用的」という比較にとどまり、「2つのうちの一方」という特定が表せません。of the two があるときは the が必須です。',
      '③ の most は最上級で、3つ以上の比較に使います。また the も抜けています。',
      '④ の the most も最上級なので、対象が2つのこの文では使えません。',
      '★no more than 系の整理★ no more than＝only（〜しかない）／not more than＝at most（多くても）／no less than＝as much as（〜も）／not less than＝at least（少なくとも）。no は「差がゼロ」を表すので、ぴったりその数という意味になります。',
    ],
  },
  {
    topic: 'クジラ構文（A is no more B than C is D）と rather than',
    focus: 'クジラ構文',
    sentence: 'A computer is no ______ intelligent than a calculator; both simply follow instructions.',
    choices: ['less', 'more', 'much', 'very'],
    answer: '②',
    rate: 45,
    full: 'A computer is no more intelligent than a calculator; both simply follow instructions.',
    translation: 'コンピュータが知的でないのは電卓が知的でないのと同じだ。どちらも単に指示に従うだけである。',
    keyPhrases: [
      { phrase: 'no more intelligent than', meaning: '〜と同様に知的でない（クジラ構文）' },
      { phrase: 'both simply follow instructions', meaning: 'どちらも単に指示に従うだけ（両方を否定する根拠）' },
    ],
    theme: 'A is no more B than C is D は「A が B でないのは C が D でないのと同じ」。両方を否定する',
    type: '構文判断型',
    difficulty: 4,
    steps: [
      '① no ___ than という枠を見て、クジラ構文の可能性を疑う',
      '② セミコロン以降で「どちらも指示に従うだけ」＝両方を否定していると読む',
      '③ 両方を否定するのは no more ~ than（クジラ構文）',
      '④ no less ~ than は「両方を肯定」なので選ばない',
    ],
    commentary: [
      'セミコロン以降の「どちらも単に指示に従うだけ」から、コンピュータも電卓も知的ではないという主張だと読み取れます。両方を否定するのは no more ~ than なので ② more が正解です。',
      '★no more ~ than★ は「〜でないのと同じで、…でもない」という両方否定（クジラ構文）。★no less ~ than★ は「〜に劣らず…だ」という両方肯定です。訳が反転するので、どちらを選ぶかは常に文脈で決めます。',
      '① の less だと no less intelligent than a calculator で「電卓に劣らず知的だ」という肯定になります。しかし後半で「単に指示に従うだけ」と価値を下げているので、論理が逆です。',
      '③ の much は比較級を強める語で、no much という形は作れません。',
      '④ の very も比較級を強められません（比較級の強調には much / far を使う）。',
      '★rather than との違い★ A rather than B は「B ではなくむしろ A」という選択を表し、否定・肯定の反転はありません。He is a scholar rather than a teacher.（教師よりむしろ学者）。クジラ構文と混同しないよう、no があるかを目印にしてください。',
    ],
  },
  {
    topic: '比較の慣用（the 比較級, the 比較級 / all the more / no less than）',
    focus: 'the 比較級, the 比較級',
    sentence: '______ carefully you read the instructions, the fewer mistakes you will make.',
    choices: ['The most', 'The more', 'More', 'Much more'],
    answer: '②',
    rate: 67,
    full: 'The more carefully you read the instructions, the fewer mistakes you will make.',
    translation: '説明書を注意深く読むほど、間違いは少なくなる。',
    keyPhrases: [
      { phrase: 'The more carefully you read', meaning: '注意深く読むほど（前半の the＋比較級）' },
      { phrase: 'the fewer mistakes you will make', meaning: '間違いはより少なくなる（後半の the＋比較級）' },
    ],
    theme: 'The＋比較級 ~, the＋比較級 ... は「〜すればするほど…」。両方に the が必要',
    type: '構文判断型',
    difficulty: 2,
    steps: [
      '① 文の後半に the fewer という「the＋比較級」があることに注目する',
      '② 後半が the＋比較級なら、前半も the＋比較級になる相関構文',
      '③ carefully は副詞なので比較級は more carefully',
      '④ the を付けて The more carefully とする',
    ],
    commentary: [
      '後半が the fewer mistakes（the＋比較級）なので、前半も the＋比較級になる相関構文です。副詞 carefully の比較級は more carefully なので、② The more が正解です。',
      'この構文は ★The＋比較級＋S＋V, the＋比較級＋S＋V★ の形で「〜すればするほど…」を表します。両方に the が必要で、片方だけでは成立しません。The sooner, the better. のように S＋V が省略されることもあります。',
      '① の The most は最上級です。相関構文では比較級を使うので合いません。',
      '③ の More は the が抜けています。この構文の the は指示副詞（その分だけ）で、省略できません。',
      '④ の Much more は比較級を強めた形ですが、the が抜けています。The much more とも言いません。',
      '★他の慣用表現★ all the more（それだけいっそう）：I like him all the more for his honesty.（正直だからいっそう好きだ）／none the less（それでもやはり）。この the も「その分だけ」を示す指示副詞で、同じ発想です。',
    ],
  },
];

export const egComparisonProblems: GrammarProblem[] = [
  buildEgSet(
    {
      chapterId: 'eg3_3',
      setNo: 1,
      unitTitle: '⑬ 原級・比較級・最上級と重要表現',
      category: '倍数表現・比較級の強調・of the two・クジラ構文・the 比較級 the 比較級',
      intro:
        '比較の問題は、まず ★比較の対象がいくつあるか★ と ★原級・比較級・最上級のどれか★ の2点を確認するところから始めます。この2点が決まれば、あとは強調語（much / far は比較級、very は原級）と the の有無（2つなら the＋比較級、3つ以上なら the＋最上級）を当てはめるだけです。後半のクジラ構文と the 比較級, the 比較級 は形を丸ごと覚える必要がある表現ですが、いずれも「no は差がゼロ」「the は その分だけ」という一貫した発想で理解できます。',
      summary: [
        '倍数は as ~ as の直前に置く：half / twice / three times as ~ as。2倍は twice。',
        '比較級を強めるのは much / far / even / still / a lot。very は原級専用。',
        '2つの比較は the＋比較級（of the two）、3つ以上は the＋最上級。',
        'no more ~ than はクジラ構文で両方否定、no less ~ than は両方肯定。',
        'no more than＝only／not more than＝at most／no less than＝as much as／not less than＝at least。',
        'The＋比較級 ~, the＋比較級 ... は両方に the が必要。all the more の the も「その分だけ」。',
      ],
      surroundingKnowledge: [
        '最上級の代用：No other city in Japan is larger than Tokyo.＝Tokyo is the largest city in Japan.',
        '原級を使った最上級相当：as ~ as any（誰にも劣らず）／as ~ as ever lived（かつてないほど）。',
        '副詞の最上級には the を付けなくてもよい（He runs (the) fastest.）。',
        '比較対象は形をそろえる：To read a book is more useful than to watch TV.（不定詞と不定詞）',
        'senior / junior / superior / inferior / prefer は than ではなく to を使う（ラテン語系比較）。',
      ],
      deepDiveTopics: [
        'なぜ最上級に the が付くのか。「最も〜なもの」は1つに特定されるため。同じ理由で of the two の比較級にも the が付く。the は「特定できる」ことを示す標識であり、比較の文脈では「どれか1つに絞れる」ことを意味する。',
        'クジラ構文の no は「差がゼロ」を意味する。A whale is no more a fish than a horse is. は「クジラが魚である度合いは、馬が魚である度合いを超えない」＝どちらもゼロ、という論理。訳の反転は日本語側の都合であり、英語の論理は一貫している。',
        'the 比較級, the 比較級 の the は定冠詞ではなく、古英語の指示副詞（その分だけ）に由来する。だから all the more の the も同じ語源で、「その理由の分だけ」を意味する。',
        'senior to / prefer to のように than を使わない比較語は、ラテン語から入った語で、ラテン語では比較の相手を与格（to に相当）で示した。語源が語法を決めている典型例。',
      ],
    },
    EG3_3_ITEMS,
  ),
];
