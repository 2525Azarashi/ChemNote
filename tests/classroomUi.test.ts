import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  parseSchoolBrand,
  resolveBrandLabel,
  SCHOOL_BRAND_KEY,
  SCHOOL_NAME_MAX,
} from '../src/utils/classroomCore';

/**
 * ===================================================================
 * クラス機能の画面配線テスト
 * ===================================================================
 *
 * ■ このテストの位置づけ
 * このリポジトリのテストは jsdom を積んでいないため、React を
 * 実際に描画しての検証はできない。一方でクラス機能は
 * 「教育現場に配る」性質上、次の約束を絶対に壊してはいけない。
 *
 *   ① 生徒は「誰に何を見られているか」を必ず確認できる
 *   ② 生徒は自分でクラスを抜けられる
 *   ③ 「取り組み度」は成績ではないと明記される
 *   ④ ホワイトレーベルの学校名は Firestore 待ちにしない
 *
 * これらは実装の細部ではなく**仕様の骨**なので、
 * ソースの文言・呼び出しが残っているかを検査して回帰を防ぐ。
 * （文言を消すリファクタが入った瞬間に落ちるのが目的）
 */

const root = resolve(__dirname, '..');
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), 'utf-8');

const teacherSource = read('src/components/TeacherDashboard.tsx');
const classPanelSource = read('src/components/ClassPanel.tsx');
const classroomSource = read('src/utils/classroom.ts');
const appSource = read('src/App.tsx');
const profileSource = read('src/components/ProfileModal.tsx');
const homeSource = read('src/components/Home.tsx');

// ===================================================================
describe('ホワイトレーベル：学校名の読み書き', () => {
  it('保存キーが固定されている（キー名を変えると既存端末の表示が消える）', () => {
    expect(SCHOOL_BRAND_KEY).toBe('school_brand_v1');
  });

  it('正しい JSON から学校名とクラスIDを取り出せる', () => {
    const brand = parseSchoolBrand(JSON.stringify({ schoolName: '〇〇高等学校', classId: 'c1' }));
    expect(brand).toEqual({ schoolName: '〇〇高等学校', classId: 'c1' });
  });

  it('前後の空白は落とす（コピペで入る空白で表示が崩れないように）', () => {
    expect(parseSchoolBrand(JSON.stringify({ schoolName: '  A高校  ' }))?.schoolName).toBe('A高校');
  });

  it('壊れた JSON でも例外を投げず null を返す（画面を落とさない）', () => {
    expect(parseSchoolBrand('{ not json')).toBeNull();
    expect(parseSchoolBrand('')).toBeNull();
    expect(parseSchoolBrand(null)).toBeNull();
    expect(parseSchoolBrand(undefined)).toBeNull();
  });

  it('学校名が空文字なら未設定として扱う', () => {
    expect(parseSchoolBrand(JSON.stringify({ schoolName: '   ', classId: 'c1' }))).toBeNull();
  });

  it('学校名は上限文字数で切る（レイアウト崩れの防止）', () => {
    const long = 'あ'.repeat(SCHOOL_NAME_MAX + 20);
    const brand = parseSchoolBrand(JSON.stringify({ schoolName: long }));
    expect(brand?.schoolName.length).toBe(SCHOOL_NAME_MAX);
  });

  it('classId が無い古い形でも読める（後方互換）', () => {
    expect(parseSchoolBrand(JSON.stringify({ schoolName: 'B高校' }))).toEqual({
      schoolName: 'B高校',
      classId: '',
    });
  });

  it('学校名があればそれを、無ければ既定名を返す', () => {
    expect(resolveBrandLabel({ schoolName: 'C高校', classId: 'x' })).toBe('C高校');
    expect(resolveBrandLabel(null)).toBe('マナトビ');
    expect(resolveBrandLabel({ schoolName: '   ', classId: 'x' })).toBe('マナトビ');
  });

  it('既定名は呼び出し側で差し替えられる', () => {
    expect(resolveBrandLabel(null, 'ChemNote')).toBe('ChemNote');
  });
});

// ===================================================================
describe('先生ダッシュボード：先生が最初に知りたい順に並んでいること', () => {
  it('参加コードを画面に大きく出している（授業中に口頭で伝えるため）', () => {
    expect(teacherSource).toContain('参加コード');
    expect(teacherSource).toContain('joinCode');
    // 黒板に書き写す想定で字間を広げている
    expect(teacherSource).toContain('tracking-[');
  });

  it('「声を掛けたい生徒」を平均値より優先して出している', () => {
    expect(teacherSource).toContain('声を掛けたい生徒');
    expect(teacherSource).toContain('neverStudied');
    expect(teacherSource).toContain('needsAttention');
  });

  it('CSV 出力の導線がある（評価作業に持ち出せること）', () => {
    expect(teacherSource).toContain('buildStudentCsv');
    expect(teacherSource).toContain('CSVで出す');
  });

  it('CSV のファイル名にクラス名と日付が入る（複数クラス分を判別するため）', () => {
    expect(teacherSource).toContain('学習状況_');
    expect(teacherSource).toContain('toDateKey');
  });

  it('未ログインでは管理画面の中身を出さない', () => {
    expect(teacherSource).toContain('先生用の画面です');
    expect(teacherSource).toMatch(/if \(!uid\)/);
  });

  it('名簿名を先生が設定できる（ニックネームでは評価に使えないため）', () => {
    expect(teacherSource).toContain('setRosterName');
    expect(teacherSource).toContain('出席番号');
  });

  it('参加受付の開閉ができる（学期末に締め切るため）', () => {
    expect(teacherSource).toContain('setJoinOpen');
    expect(teacherSource).toContain('参加を締め切っています');
  });
});

// ===================================================================
describe('教育的な安全装置：取り組み度が評定として独り歩きしないこと', () => {
  it('「成績そのものではなく」という注意書きが画面にある', () => {
    expect(teacherSource).toContain('成績そのものではなく');
    expect(teacherSource).toContain('先生の判断を助ける材料');
  });

  it('配点の内訳（継続50・立て直し35・未処理15）が明記されている', () => {
    expect(teacherSource).toContain('継続（最大50）');
    expect(teacherSource).toContain('立て直し（最大35）');
    expect(teacherSource).toContain('未処理（最大15）');
  });

  it('生徒1人ごとに内訳を必ず並べている（合計だけを見せない）', () => {
    expect(teacherSource).toContain('breakdown.continuity');
    expect(teacherSource).toContain('breakdown.recovery');
    expect(teacherSource).toContain('breakdown.upkeep');
  });

  it('間違えた回数そのものは減点しないと説明している（挑戦を罰しない）', () => {
    expect(teacherSource).toContain('挑戦を罰しない');
  });

  it('素の実数（解いた数・間違え・解き直し）も併記して先生が判断し直せる', () => {
    expect(teacherSource).toContain('solvedTotal');
    expect(teacherSource).toContain('review.wrongCount');
    expect(teacherSource).toContain('review.retryCount');
  });
});

// ===================================================================
describe('生徒側：同意と透明性', () => {
  it('参加しているクラスの一覧を表示する（知らないうちに見られている状態を作らない）', () => {
    expect(classPanelSource).toContain('参加中のクラス');
    expect(classPanelSource).toContain('fetchMyMembershipDetails');
  });

  it('未参加なら「誰にも見えていない」と明示する', () => {
    expect(classPanelSource).toContain('誰にも見えていません');
  });

  it('見えるもの／見えないものを両方書いている', () => {
    expect(classPanelSource).toContain('先生に見えていること');
    expect(classPanelSource).toContain('見えていないこと');
    // 答案の中身は見えない、という最も気にされる点を明記
    expect(classPanelSource).toContain('答案の中身');
  });

  it('退出ボタンが常設されていて、確認ダイアログを出す', () => {
    expect(classPanelSource).toContain('leaveClassroom');
    expect(classPanelSource).toContain('抜ける');
    expect(classPanelSource).toContain('window.confirm');
  });

  it('先生の画面に出ている自分の名前を確認できる', () => {
    expect(classPanelSource).toContain('先生の画面での表示名');
  });

  it('先生から勝手に追加できないことを説明している', () => {
    expect(classPanelSource).toContain('勝手にクラスへ追加することはできません');
  });

  it('入力中にコードを正規化する（O/0 の打ち間違いを弾く前に直す）', () => {
    expect(classPanelSource).toContain('normalizeJoinCode(event.target.value)');
  });
});

// ===================================================================
describe('Firestore 層：参加と退出で閲覧許可・学校名が連動すること', () => {
  it('参加時に study_access を作る（これが無いと先生は読めない）', () => {
    expect(classroomSource).toContain('STUDY_ACCESS_COLLECTION');
    expect(classroomSource).toContain('studyAccessDocId');
  });

  it('参加時に学校名を焼き付ける', () => {
    expect(classroomSource).toMatch(/saveSchoolBrand\(classroom\.schoolName, classId\)/);
  });

  it('退出時に閲覧許可を消し、学校名表示も取り下げる', () => {
    expect(classroomSource).toContain('clearSchoolBrandFor(classId)');
    expect(classroomSource).toMatch(/deleteDoc\(doc\(db, STUDY_ACCESS_COLLECTION/);
  });

  it('別クラス由来の学校名は消さない（複数クラス在籍でも壊れない）', () => {
    expect(classroomSource).toContain('current.classId !== classId');
  });

  it('localStorage が使えない環境でも例外を投げない', () => {
    // saveSchoolBrand / loadSchoolBrand / clearSchoolBrandFor の3つが
    // それぞれ try-catch で囲まれていること
    const brandSection = classroomSource.slice(classroomSource.indexOf('export function saveSchoolBrand'));
    expect(brandSection).not.toContain('throw new Error');
  });

  it('消えたクラスは一覧から落とす（存在しない相手に見られている表示を出さない）', () => {
    expect(classroomSource).toContain('if (!snapshot.exists()) return null;');
  });

  it('permission-denied はルール未デプロイの案内に変換される', () => {
    expect(classroomSource).toContain('firestore.rules をデプロイ');
    // 生の英語メッセージをそのまま投げる分岐が無いこと
    // （ファイル冒頭のコメントでは方針としてこの文字列に言及しているため、
    //   コメント行を除いた実コードだけを検査する）
    const codeOnly = classroomSource
      .split('\n')
      .filter((line) => !line.trim().startsWith('*') && !line.trim().startsWith('//'))
      .join('\n');
    expect(codeOnly).not.toContain('Missing or insufficient permissions');
  });
});

// ===================================================================
describe('画面への配線', () => {
  it('AppState に teacher_dashboard が登録されている', () => {
    expect(appSource).toContain("'teacher_dashboard'");
    expect(appSource).toContain('<TeacherDashboard onBack=');
  });

  it('先生ダッシュボードの入口は設定経由（生徒が迷い込みにくい位置）', () => {
    expect(appSource).toContain('onOpenTeacherDashboard');
    expect(profileSource).toContain('先生の方はこちら');
  });

  it('設定にクラスタブがあり、未ログインでは押せない', () => {
    expect(profileSource).toContain("setTab('class')");
    expect(profileSource).toContain('disabled={!auth.currentUser}');
    expect(profileSource).toContain('<ClassPanel');
  });

  it('ホーム画面に学校名を出す（ホワイトレーベル）', () => {
    expect(homeSource).toContain('loadSchoolBrand');
    expect(homeSource).toContain('schoolBrand.schoolName');
  });

  it('学校名はローカルから同期的に読む（起動時のちらつきを避ける）', () => {
    // useMemo で同期読み。await していないこと
    expect(homeSource).toContain('useMemo(() => loadSchoolBrand(), [])');
  });
});
