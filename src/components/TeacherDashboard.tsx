import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Users,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Download,
  AlertTriangle,
  Lock,
  Unlock,
  School,
  PenLine,
  Info,
} from 'lucide-react';
import { auth } from '../firebase';
import {
  createClassroom,
  fetchMyClassrooms,
  fetchClassSummaries,
  setJoinOpen,
  setRosterName,
} from '../utils/classroom';
import { aggregateClass, type ClassroomDoc } from '../utils/classroomCore';
import { buildStudentCsv, type StudentSummary } from '../utils/studySummary';
import { subjectTheme } from '../data/subjectTheme';
import { toDateKey } from '../utils/studySummary';

/**
 * ===================================================================
 * 先生ダッシュボード（フェーズ0 ③）
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ この画面が答えるべき問い
 * -------------------------------------------------------------------
 * 現場の先生が学習アプリの管理画面を開くとき、知りたいことは
 * 実際には次の3つしかない。
 *
 *   ① 今日、誰に声を掛けるべきか（手が止まっている生徒は誰か）
 *   ② クラスはどこでつまずいているか（未処理の復習が集まる場所）
 *   ③ 評価に使える形で持ち出せるか（＝CSV）
 *
 * 逆に、凝ったグラフや期間比較のチャートは「見て楽しい」が
 * 職員室では使われない。授業前の5分で①→③が終わることを優先し、
 * 装飾よりも「次の行動が決まること」を設計基準にした。
 *
 * -------------------------------------------------------------------
 * ■ 教育的な安全装置（外してはいけない）
 * -------------------------------------------------------------------
 * 「取り組み度」は 継続50 / 立て直し35 / 未処理15 の合計であり、
 * 成績そのものではない。画面には必ず内訳を並べ、
 *
 *   「成績そのものではなく、先生の判断を助ける材料としてご覧ください」
 *
 * という説明を常時表示する。数字だけが独り歩きして生徒が
 * 不当に評価されることを防ぐため、この注意書きは折りたたまない。
 *
 * -------------------------------------------------------------------
 * ■ プライバシー（同意の作り込み）
 * -------------------------------------------------------------------
 * 先生が生徒の学習データを読めるのは、生徒自身が参加コードで
 * クラスに入り study_access を作ったときだけ。先生側からは
 * 生徒を勝手に追加できない（Firestore ルールで保証）。
 * つまりこの画面に並ぶのは「本人が見せることを選んだ生徒」だけである。
 */

interface TeacherDashboardProps {
  onBack: () => void;
}

type Tab = 'students' | 'classes';

const SUBJECT_OPTIONS: Array<{ value: ClassroomDoc['subject']; label: string }> = [
  { value: 'chemistry_basic', label: '化学基礎' },
  { value: 'chemistry', label: '化学' },
  { value: 'english_listening', label: '英語リスニング' },
];

export function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const [tab, setTab] = useState<Tab>('students');
  const [classrooms, setClassrooms] = useState<ClassroomDoc[]>([]);
  const [activeClassId, setActiveClassId] = useState<string>('');
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  // クラス作成モーダル
  const [showCreate, setShowCreate] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState<ClassroomDoc['subject']>('chemistry_basic');
  const [creating, setCreating] = useState(false);

  // 名簿名のインライン編集
  const [editingUid, setEditingUid] = useState('');
  const [editingName, setEditingName] = useState('');

  const uid = auth.currentUser?.uid || '';

  const activeClass = useMemo(
    () => classrooms.find((room) => room.id === activeClassId) || null,
    [classrooms, activeClassId],
  );
  const theme = subjectTheme(activeClass?.subject);

  // ---------------------------------------------------------------
  // クラス一覧の読み込み
  // ---------------------------------------------------------------
  const loadClasses = useCallback(async () => {
    if (!uid) {
      setLoadingClasses(false);
      return;
    }
    setLoadingClasses(true);
    setError('');
    try {
      const rooms = await fetchMyClassrooms();
      // 作成順が保証されないので、クラス名で並べて毎回同じ順にする
      rooms.sort((a, b) => (a.className || '').localeCompare(b.className || '', 'ja'));
      setClassrooms(rooms);
      setActiveClassId((current) => {
        if (current && rooms.some((room) => room.id === current)) return current;
        return rooms.length > 0 ? rooms[0].id : '';
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'クラスの読み込みに失敗しました。');
    } finally {
      setLoadingClasses(false);
    }
  }, [uid]);

  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);

  // ---------------------------------------------------------------
  // 選択中クラスの生徒サマリー
  // ---------------------------------------------------------------
  const loadStudents = useCallback(async (classId: string) => {
    if (!classId) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    setError('');
    try {
      const summaries = await fetchClassSummaries(classId);
      setStudents(summaries);
    } catch (loadError) {
      setStudents([]);
      setError(loadError instanceof Error ? loadError.message : '学習状況の取得に失敗しました。');
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents(activeClassId);
  }, [activeClassId, loadStudents]);

  const aggregate = useMemo(() => aggregateClass(students), [students]);

  // ---------------------------------------------------------------
  // 操作
  // ---------------------------------------------------------------
  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const created = await createClassroom({
        schoolName: newSchoolName,
        className: newClassName,
        subject: newSubject,
      });
      setShowCreate(false);
      setNewClassName('');
      // 学校名は次のクラスでもたいてい同じなので残す（連続作成の手間を減らす）
      setClassrooms((prev) => [...prev, created]);
      setActiveClassId(created.id);
      setTab('classes');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'クラスの作成に失敗しました。');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(''), 1800);
    } catch {
      // クリップボードが使えない環境（古い端末・非HTTPS）でも
      // コードは画面に大きく出しているので、失敗しても致命的ではない
      setError('コードのコピーができませんでした。画面の文字を書き写してください。');
    }
  };

  const handleToggleJoin = async (room: ClassroomDoc) => {
    const next = !room.joinOpen;
    // 楽観更新（通信を待たせない）。失敗したら元に戻す。
    setClassrooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, joinOpen: next } : r)));
    try {
      await setJoinOpen(room.id, next);
    } catch (toggleError) {
      setClassrooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, joinOpen: room.joinOpen } : r)));
      setError(toggleError instanceof Error ? toggleError.message : '参加受付の変更に失敗しました。');
    }
  };

  const handleSaveRosterName = async (studentUid: string) => {
    const trimmed = editingName.trim();
    setEditingUid('');
    if (!activeClassId) return;
    try {
      await setRosterName(activeClassId, studentUid, trimmed);
      setStudents((prev) =>
        prev.map((student) =>
          student.uid === studentUid
            ? { ...student, displayName: trimmed || student.displayName }
            : student,
        ),
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '名前の設定に失敗しました。');
    }
  };

  /**
   * CSV を書き出す。
   * ファイル名にクラス名と日付を入れる。先生は複数クラス分を
   * ダウンロードフォルダに溜めるので、名前で判別できないと使えない。
   */
  const handleExportCsv = () => {
    if (students.length === 0) return;
    const csv = buildStudentCsv(students);
    const className = (activeClass?.className || 'クラス').replace(/[\\/:*?"<>|]/g, '_');
    const fileName = `学習状況_${className}_${toDateKey(Date.now())}.csv`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------
  // 未ログイン：先に入口を閉じる
  // ---------------------------------------------------------------
  if (!uid) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-5 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4B5563] hover:text-[#1B2631] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">戻る</span>
        </button>
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E0E1DD] p-6 text-center">
          <School className="w-10 h-10 mx-auto mb-3 text-[#9BA3AE]" />
          <h2 className="text-lg font-bold text-[#1B2631] mb-2">先生用の画面です</h2>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            クラスの管理には Google ログインが必要です。
            <br />
            設定画面からログインしてから、もう一度お試しください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 sm:px-6 py-6">
      {/* ヘッダー */}
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4B5563] hover:text-[#1B2631] transition-colors mb-5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">戻る</span>
        </button>

        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            {/* ホワイトレーベル：学校名を主役にする */}
            {activeClass?.schoolName && (
              <p className="text-xs text-[#6B7280] mb-1">{activeClass.schoolName}</p>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B2631] flex items-center gap-2">
              <Users className="w-6 h-6" style={{ color: theme.accent }} />
              クラスの学習状況
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-95"
            style={{ backgroundColor: theme.accent }}
          >
            <Plus className="w-4 h-4" />
            クラスを作る
          </button>
        </div>

        {/* クラス切り替え */}
        {classrooms.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {classrooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveClassId(room.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-sm border transition-colors ${
                  room.id === activeClassId
                    ? 'bg-white border-transparent font-bold text-[#1B2631]'
                    : 'bg-transparent border-[#E0E1DD] text-[#4B5563] hover:bg-white/60'
                }`}
                style={room.id === activeClassId ? { boxShadow: theme.bubbleShadow } : undefined}
              >
                {room.className}
              </button>
            ))}
          </div>
        )}

        {/* タブ */}
        {classrooms.length > 0 && (
          <div className="flex gap-1 p-1 bg-[#F1EFE9] rounded-xl mb-5 w-fit">
            {([
              { id: 'students' as Tab, label: '生徒の様子' },
              { id: 'classes' as Tab, label: 'クラス設定' },
            ]).map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  tab === item.id ? 'bg-white font-bold text-[#1B2631] shadow-sm' : 'text-[#4B5563]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-[#FDECEA] border border-[#F5C6C0] text-sm text-[#96342B]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {loadingClasses ? (
          <div className="py-16 text-center text-sm text-[#6B7280]">読み込んでいます…</div>
        ) : classrooms.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} accent={theme.accent} />
        ) : tab === 'students' ? (
          <StudentsTab
            students={students}
            aggregate={aggregate}
            loading={loadingStudents}
            theme={theme}
            activeClass={activeClass}
            copiedCode={copiedCode}
            editingUid={editingUid}
            editingName={editingName}
            onCopyCode={handleCopyCode}
            onRefresh={() => void loadStudents(activeClassId)}
            onExportCsv={handleExportCsv}
            onStartEdit={(student) => {
              setEditingUid(student.uid);
              setEditingName(student.displayName === '（名前未設定）' ? '' : student.displayName);
            }}
            onChangeEditingName={setEditingName}
            onSaveEdit={handleSaveRosterName}
            onCancelEdit={() => setEditingUid('')}
          />
        ) : (
          <ClassesTab
            classrooms={classrooms}
            theme={theme}
            copiedCode={copiedCode}
            onCopyCode={handleCopyCode}
            onToggleJoin={handleToggleJoin}
          />
        )}
      </div>

      {showCreate && (
        <CreateClassModal
          schoolName={newSchoolName}
          className={newClassName}
          subject={newSubject}
          creating={creating}
          accent={theme.accent}
          onChangeSchool={setNewSchoolName}
          onChangeClass={setNewClassName}
          onChangeSubject={setNewSubject}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

// ===================================================================
// クラスが1つも無いとき
// ===================================================================

function EmptyState({ onCreate, accent }: { onCreate: () => void; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E1DD] p-7 text-center">
      <School className="w-11 h-11 mx-auto mb-3" style={{ color: accent }} />
      <h2 className="text-lg font-bold text-[#1B2631] mb-2">まずはクラスを1つ作りましょう</h2>
      <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
        クラスを作ると<strong>6文字の参加コード</strong>が発行されます。
        <br />
        黒板やプリントにそのコードを書いて生徒に入力してもらうだけで、
        <br />
        学習の様子がこの画面に集まります。
      </p>
      <div className="text-left text-xs text-[#6B7280] bg-[#FAF8F2] border border-[#E8E5DC] rounded-xl p-3.5 mb-5 leading-relaxed">
        <p className="font-bold text-[#4B5563] mb-1">生徒のデータが見えるしくみ</p>
        生徒が参加コードを入力したときにだけ、その生徒の学習記録を見る許可が作られます。
        先生の側から生徒を勝手に追加することはできません。生徒はいつでもクラスから抜けられ、
        抜けた時点で見られなくなります。
      </div>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-transform active:scale-95"
        style={{ backgroundColor: accent }}
      >
        <Plus className="w-4 h-4" />
        クラスを作る
      </button>
    </div>
  );
}

// ===================================================================
// 生徒の様子タブ
// ===================================================================

type ThemeShape = ReturnType<typeof subjectTheme>;

interface StudentsTabProps {
  students: StudentSummary[];
  aggregate: ReturnType<typeof aggregateClass>;
  loading: boolean;
  theme: ThemeShape;
  activeClass: ClassroomDoc | null;
  copiedCode: string;
  editingUid: string;
  editingName: string;
  onCopyCode: (code: string) => void;
  onRefresh: () => void;
  onExportCsv: () => void;
  onStartEdit: (student: StudentSummary) => void;
  onChangeEditingName: (value: string) => void;
  onSaveEdit: (uid: string) => void;
  onCancelEdit: () => void;
}

function StudentsTab(props: StudentsTabProps) {
  const { students, aggregate, loading, theme, activeClass } = props;

  // 誰も参加していないクラス＝コードの周知が済んでいない状態。
  // ここで一番大きく出すべきなのは参加コードそのもの。
  if (!loading && students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E0E1DD] p-7 text-center">
        <Users className="w-10 h-10 mx-auto mb-3 text-[#9BA3AE]" />
        <h2 className="text-base font-bold text-[#1B2631] mb-2">まだ誰も参加していません</h2>
        <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
          下のコードを生徒に伝えてください。
          <br />
          アプリの「クラスに参加」から入力してもらいます。
        </p>
        {activeClass && (
          <JoinCodeBlock
            code={activeClass.joinCode}
            copied={props.copiedCode === activeClass.joinCode}
            accent={theme.accent}
            onCopy={() => props.onCopyCode(activeClass.joinCode)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 参加コード（授業中にすぐ言えるよう常設） */}
      {activeClass && (
        <div className="bg-white rounded-2xl border border-[#E0E1DD] p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">参加コード</p>
            <p className="text-2xl font-bold tracking-[0.2em] text-[#1B2631]">
              {activeClass.joinCode}
            </p>
          </div>
          <button
            onClick={() => props.onCopyCode(activeClass.joinCode)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-[#E0E1DD] text-[#4B5563] hover:bg-[#FAF8F2] transition-colors"
          >
            {props.copiedCode === activeClass.joinCode ? (
              <>
                <Check className="w-4 h-4 text-[#3E9C93]" />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                コピー
              </>
            )}
          </button>
        </div>
      )}

      {/* 上段：4つの数字 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="在籍" value={`${aggregate.memberCount}人`} accent={theme.accent} />
        <StatCard label="直近7日に学習" value={`${aggregate.activeIn7}人`} accent={theme.accent} />
        <StatCard label="平均で解いた大問" value={`${aggregate.avgSolved}問`} accent={theme.accent} />
        <StatCard label="平均の取り組み度" value={`${aggregate.avgEngagement}`} accent={theme.accent} />
      </div>

      {/* 声を掛けたい生徒（この画面の主目的） */}
      {(aggregate.neverStudied > 0 || aggregate.needsAttention.length > 0) && (
        <div className="bg-[#FFFBEB] border border-[#F4D98C] rounded-2xl p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-[#8A6412] mb-2">
            <AlertTriangle className="w-4 h-4" />
            声を掛けたい生徒
          </p>
          {aggregate.neverStudied > 0 && (
            <p className="text-sm text-[#6B5410] mb-2 leading-relaxed">
              まだ一度も学習していない生徒が <strong>{aggregate.neverStudied}人</strong> います。
              ログインだけして止まっている可能性があります。
            </p>
          )}
          {aggregate.needsAttention.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aggregate.needsAttention.map((student) => (
                <span
                  key={student.uid}
                  className="px-2.5 py-1 rounded-lg bg-white/80 border border-[#EBD9A4] text-xs text-[#6B5410]"
                >
                  {student.displayName}
                  <span className="ml-1 font-bold">未処理{student.overdue}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 操作ボタン */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={props.onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-[#E0E1DD] bg-white text-[#4B5563] hover:bg-[#FAF8F2] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          更新
        </button>
        <button
          onClick={props.onExportCsv}
          disabled={students.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: theme.accent }}
        >
          <Download className="w-4 h-4" />
          CSVで出す
        </button>
      </div>

      {/*
        ⚠️ この注意書きは折りたたまない。
        「取り組み度」が評定として一人歩きすることを防ぐための、
        設計上の安全装置である。
      */}
      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[#F4F7FA] border border-[#D9E4EC] text-xs text-[#3C5A6E] leading-relaxed">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          「取り組み度」は<strong>継続（最大50）</strong>・<strong>立て直し（最大35）</strong>・
          <strong>未処理（最大15）</strong>の合計です。成績そのものではなく、
          先生の判断を助ける材料としてご覧ください。
          <br />
          継続は「直近14日のうち何日やったか（7日で満点）」、立て直しは
          「間違えたあと解き直した割合」、未処理は「期限切れの復習を放置していないか」です。
          間違えた回数そのものは減点していません（挑戦を罰しないため）。
        </span>
      </div>

      {/* 生徒一覧 */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[#6B7280]">学習状況を集めています…</div>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <StudentRow
              key={student.uid}
              student={student}
              theme={theme}
              isEditing={props.editingUid === student.uid}
              editingName={props.editingName}
              onStartEdit={() => props.onStartEdit(student)}
              onChangeEditingName={props.onChangeEditingName}
              onSave={() => props.onSaveEdit(student.uid)}
              onCancel={props.onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ===================================================================
// 小さな部品
// ===================================================================

/** 参加コードを大きく見せるブロック（黒板に書き写す想定で字間を広く取る） */
function JoinCodeBlock({
  code,
  copied,
  accent,
  onCopy,
}: {
  code: string;
  copied: boolean;
  accent: string;
  onCopy: () => void;
}) {
  return (
    <div className="inline-block">
      <p
        className="text-3xl font-bold tracking-[0.28em] text-[#1B2631] px-5 py-3 rounded-xl border-2"
        style={{ borderColor: accent }}
      >
        {code}
      </p>
      <button
        onClick={onCopy}
        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-[#E0E1DD] text-[#4B5563] hover:bg-[#FAF8F2] transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-[#3E9C93]" />
            コピーしました
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            コピー
          </>
        )}
      </button>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E1DD] p-3.5">
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

// ===================================================================
// 生徒1人分の行
// ===================================================================

interface StudentRowProps {
  student: StudentSummary;
  theme: ThemeShape;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onChangeEditingName: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

// React.FC を使うのは、一覧で key を渡すため（既存の ReviewCard などと同じ書き方）。
const StudentRow: React.FC<StudentRowProps> = ({
  student,
  theme,
  isEditing,
  editingName,
  onStartEdit,
  onChangeEditingName,
  onSave,
  onCancel,
}) => {
  const { engagement, review } = student;
  const hasOverdue = review.overdue > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E0E1DD] p-4">
      {/* 名前の行 */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        {isEditing ? (
          <div className="flex-1 flex flex-wrap items-center gap-2">
            <input
              value={editingName}
              onChange={(event) => onChangeEditingName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSave();
                if (event.key === 'Escape') onCancel();
              }}
              autoFocus
              maxLength={24}
              placeholder="出席番号や氏名"
              className="flex-1 min-w-[10rem] px-3 py-1.5 rounded-lg border border-[#C9D2DA] text-sm text-[#1B2631] focus:outline-none focus:border-[#6FA8C5]"
            />
            <button
              onClick={onSave}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: theme.accent }}
            >
              保存
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg text-xs border border-[#E0E1DD] text-[#4B5563]"
            >
              やめる
            </button>
          </div>
        ) : (
          <button
            onClick={onStartEdit}
            className="flex items-center gap-1.5 text-left group"
            title="出席番号や氏名を設定できます（生徒からは変更できません）"
          >
            <span className="text-sm font-bold text-[#1B2631]">{student.displayName}</span>
            <PenLine className="w-3.5 h-3.5 text-[#9BA3AE] group-hover:text-[#4B5563]" />
          </button>
        )}

        {!isEditing && (
          <div className="text-right shrink-0">
            <p className="text-lg font-bold leading-none" style={{ color: theme.accent }}>
              {engagement.score}
            </p>
            <p className="text-[10px] text-[#9BA3AE]">取り組み度</p>
          </div>
        )}
      </div>

      {/*
        内訳バー（3分割）。
        合計値だけを見て判断されないよう、必ず内訳を可視化する。
      */}
      <div className="flex h-2 rounded-full overflow-hidden bg-[#F1EFE9] mb-2">
        <div
          className="bg-[#6FA8C5]"
          style={{ width: `${engagement.breakdown.continuity}%` }}
          title={`継続 ${engagement.breakdown.continuity}/50`}
        />
        <div
          className="bg-[#5BC0BE]"
          style={{ width: `${engagement.breakdown.recovery}%` }}
          title={`立て直し ${engagement.breakdown.recovery}/35`}
        />
        <div
          className="bg-[#F4D03F]"
          style={{ width: `${engagement.breakdown.upkeep}%` }}
          title={`未処理 ${engagement.breakdown.upkeep}/15`}
        />
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[#6B7280] mb-2.5">
        <span>継続 {engagement.breakdown.continuity}/50</span>
        <span>立て直し {engagement.breakdown.recovery}/35</span>
        <span>未処理 {engagement.breakdown.upkeep}/15</span>
      </div>

      {/* 実数（先生が自分で判断し直すための素の値） */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1.5 text-xs text-[#4B5563]">
        <span>
          解いた大問 <strong className="text-[#1B2631]">{student.solvedTotal}</strong>
        </span>
        <span>
          14日で <strong className="text-[#1B2631]">{student.activeDaysIn14}</strong> 日
        </span>
        <span>
          最終学習{' '}
          <strong className="text-[#1B2631]">{student.lastStudiedAt || 'まだなし'}</strong>
        </span>
        <span className={hasOverdue ? 'text-[#96342B]' : undefined}>
          未処理の復習{' '}
          <strong className={hasOverdue ? 'text-[#96342B]' : 'text-[#1B2631]'}>
            {review.overdue}
          </strong>
        </span>
        <span>
          復習リスト <strong className="text-[#1B2631]">{review.total}</strong>
        </span>
        <span>
          定着 <strong className="text-[#1B2631]">{review.mastered}</strong>
        </span>
        <span>
          間違え <strong className="text-[#1B2631]">{review.wrongCount}</strong> 回
        </span>
        <span>
          解き直し <strong className="text-[#1B2631]">{review.retryCount}</strong> 回
        </span>
      </div>
    </div>
  );
};

// ===================================================================
// クラス設定タブ
// ===================================================================

interface ClassesTabProps {
  classrooms: ClassroomDoc[];
  theme: ThemeShape;
  copiedCode: string;
  onCopyCode: (code: string) => void;
  onToggleJoin: (room: ClassroomDoc) => void;
}

function ClassesTab({ classrooms, theme, copiedCode, onCopyCode, onToggleJoin }: ClassesTabProps) {
  return (
    <div className="space-y-3">
      {classrooms.map((room) => {
        const roomTheme = subjectTheme(room.subject);
        return (
          <div key={room.id} className="bg-white rounded-2xl border border-[#E0E1DD] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-[#6B7280]">{room.schoolName}</p>
                <p className="text-base font-bold text-[#1B2631]">{room.className}</p>
                <span
                  className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[11px] ${roomTheme.chipTextClass} ${roomTheme.chipBgClass}`}
                >
                  {roomTheme.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7280] mb-1">参加コード</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-[0.18em] text-[#1B2631]">
                    {room.joinCode}
                  </span>
                  <button
                    onClick={() => onCopyCode(room.joinCode)}
                    className="p-1.5 rounded-lg border border-[#E0E1DD] text-[#4B5563] hover:bg-[#FAF8F2] transition-colors"
                    aria-label="参加コードをコピー"
                  >
                    {copiedCode === room.joinCode ? (
                      <Check className="w-3.5 h-3.5 text-[#3E9C93]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/*
              受付の開閉。
              学期が終わったら閉じられるようにしておくのは、
              卒業生や他クラスの生徒が後から入ってこないようにするため。
            */}
            <button
              onClick={() => onToggleJoin(room)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                room.joinOpen
                  ? 'border-[#A9E0D8] bg-[#F5FCFA] text-[#2F7C74]'
                  : 'border-[#E0E1DD] bg-[#FAF8F2] text-[#6B7280]'
              }`}
            >
              {room.joinOpen ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  参加を受け付けています（閉じる）
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  参加を締め切っています（開く）
                </>
              )}
            </button>
          </div>
        );
      })}

      <p className="text-xs text-[#6B7280] leading-relaxed px-1">
        参加コードは学校名・クラス名とセットで発行されます。学校名はアプリの画面にも表示されます。
        コードは <strong>O と 0</strong>、<strong>I と 1</strong> のような見間違えやすい文字を
        使わない設計なので、黒板に書いても読み違えが起きにくくなっています。
      </p>
    </div>
  );
}

// ===================================================================
// クラス作成モーダル
// ===================================================================

interface CreateClassModalProps {
  schoolName: string;
  className: string;
  subject: ClassroomDoc['subject'];
  creating: boolean;
  accent: string;
  onChangeSchool: (value: string) => void;
  onChangeClass: (value: string) => void;
  onChangeSubject: (value: ClassroomDoc['subject']) => void;
  onClose: () => void;
  onSubmit: () => void;
}

function CreateClassModal(props: CreateClassModalProps) {
  const canSubmit =
    props.schoolName.trim().length > 0 && props.className.trim().length > 0 && !props.creating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 py-6"
      onClick={props.onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#E0E1DD] p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#1B2631] mb-1">クラスを作る</h2>
        <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
          作成すると参加コードが自動で発行されます。あとから変更できるのはクラス名ではなく
          「参加の受付」だけなので、名前は学年・組が分かる形で付けてください。
        </p>

        <label className="block mb-3">
          <span className="block text-xs font-bold text-[#4B5563] mb-1">学校名</span>
          <input
            value={props.schoolName}
            onChange={(event) => props.onChangeSchool(event.target.value)}
            maxLength={40}
            placeholder="例）〇〇県立〇〇高等学校"
            className="w-full px-3 py-2 rounded-xl border border-[#C9D2DA] text-sm text-[#1B2631] focus:outline-none focus:border-[#6FA8C5]"
          />
          <span className="block text-[11px] text-[#9BA3AE] mt-1">
            生徒のアプリ画面にも表示されます。
          </span>
        </label>

        <label className="block mb-3">
          <span className="block text-xs font-bold text-[#4B5563] mb-1">クラス名</span>
          <input
            value={props.className}
            onChange={(event) => props.onChangeClass(event.target.value)}
            maxLength={40}
            placeholder="例）2年A組 化学基礎"
            className="w-full px-3 py-2 rounded-xl border border-[#C9D2DA] text-sm text-[#1B2631] focus:outline-none focus:border-[#6FA8C5]"
          />
        </label>

        <div className="mb-5">
          <span className="block text-xs font-bold text-[#4B5563] mb-1.5">対象科目</span>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_OPTIONS.map((option) => {
              const selected = props.subject === option.value;
              const optionTheme = subjectTheme(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => props.onChangeSubject(option.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm border transition-colors ${
                    selected
                      ? `font-bold ${optionTheme.chipTextClass} ${optionTheme.chipBgClass} border-transparent`
                      : 'border-[#E0E1DD] text-[#4B5563] hover:bg-[#FAF8F2]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={props.onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-[#E0E1DD] text-[#4B5563] hover:bg-[#FAF8F2] transition-colors"
          >
            やめる
          </button>
          <button
            onClick={props.onSubmit}
            disabled={!canSubmit}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: props.accent }}
          >
            {props.creating ? '作成中…' : '作る'}
          </button>
        </div>
      </div>
    </div>
  );
}
