import { MATH_COURSES, MATH_CURRICULUM_UNITS, MATH_CURRICULUM_SOURCE, MATH_VIDEO_REFERENCES, type MathCurriculumUnit } from '../mathCurriculum';
import type { LearningPart } from './adv_thermo';

const escape = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function unitHtml(unit: MathCurriculumUnit): string {
  return `<section data-math-unit="${unit.id}">
    <h3>${escape(unit.title)}</h3>
    <p>${unit.topics.map(escape).join(' ／ ')}</p>
    <div class="box box-note"><h4>考え方・解く順序</h4><ol>${unit.lesson.map(text => `<li>${escape(text)}</li>`).join('')}</ol></div>
    <div class="box box-important"><p><strong>見落とし注意：</strong>${escape(unit.caution)}</p></div>
    ${unit.exercises.map((exercise, i) => `<div class="box box-review">
      <h4>例題 ${i + 1}</h4><p>${escape(exercise.prompt)}</p>
      <details><summary>解答・解説</summary><p><strong>答え：</strong>${escape(exercise.answer)}</p><p>${escape(exercise.explanation)}</p></details>
    </div>`).join('')}
    ${unit.videos.map(key => {
      const video = MATH_VIDEO_REFERENCES[key];
      return `<aside class="box box-note"><p><a href="${video.url}" target="_blank" rel="noopener noreferrer">参考動画：${escape(video.title)}（YouTube・別タブ）</a></p><p>${escape(video.note)}</p><p>考え方の参考資料です。本アプリの問題・解説は独自作成で、動画投稿者の監修・提携を示すものではありません。</p></aside>`;
    }).join('')}
  </section>`;
}

const supplements: Record<string, string> = {
  mca: '場合の数・確率、整数の詳しい演習は、既存の「場合の数・確率」「整数」タブにもあります。',
  mc3: '置換積分・部分積分・定積分の技巧は、既存の「数III 積分法」タブで詳しく学べます。',
  mcc: '平面・空間ベクトルは、既存の「ベクトル」タブに要点と例題があります。',
};

export const MATH_CURRICULUM_SECTIONS = MATH_COURSES.map(course => ({ id: course.id, title: `${course.title}・基礎から標準` }));
export const MATH_CURRICULUM_PARTS: Record<string, LearningPart[]> = Object.fromEntries(MATH_COURSES.map(course => [course.id,
  MATH_CURRICULUM_UNITS.filter(unit => unit.course === course.id).map((unit, index) => ({
    id: unit.id, no: String(index + 1), title: unit.title, short: unit.title, html: unitHtml(unit),
  })),
]));
export const MATH_CURRICULUM_HTML: Record<string, string> = Object.fromEntries(MATH_COURSES.map(course => [course.id,
  `<h3>${course.title}・基礎から標準</h3><p>要点を読む → 例題を自力で解く → 解説で確認 → 演習問題で定着、の順で進めましょう。</p>
  <p>現行課程の各分野への入口を広げた教材です。入試の全解法・全難度を網羅したものではありません。${supplements[course.id] || ''}</p>
  <p><a href="${MATH_CURRICULUM_SOURCE}" target="_blank" rel="noopener noreferrer">範囲の基準：文部科学省・高等学校学習指導要領解説（数学編、別タブ）</a></p>` + MATH_CURRICULUM_PARTS[course.id].map(part => part.html).join(''),
]));
