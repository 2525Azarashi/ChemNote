import React from 'react';
import type { ListeningMaterial } from '../data/englishListeningQ1AProblems';

/** Render only printed question data. The shared document never follows answer-page keys. */
export function ListeningMaterials({ material, activeSubId }: {
  material: ListeningMaterial;
  activeSubId?: string;
}) {
  const activeNumber = activeSubId?.match(/_(\d+)$/)?.[1];
  const text = (value: string) => value.split(/(\(\s*\d+\s*\))/).map((part, i) => {
    const number = part.match(/^\(\s*(\d+)\s*\)$/)?.[1];
    if (!number) return part;
    return <mark key={i} data-material-blank={number}
      aria-current={number === activeNumber ? 'true' : undefined}
      className={`inline-block whitespace-nowrap rounded border px-2 font-bold ${
        number === activeNumber ? 'border-amber-500 bg-amber-100 text-gray-900' : 'border-gray-300 bg-white text-gray-700'
      }`}>({number})</mark>;
  });
  const sections = material.sections?.map((section, i) => (
        <section key={i} className="mb-3 rounded-lg border border-gray-200 px-3 py-2">
          {section.heading && <h3 className="mb-2 font-bold">{section.heading}</h3>}
          <ul className="space-y-2">
            {section.rows.map((row, j) => <li key={j}>{text(row)}</li>)}
          </ul>
        </section>
      ));
  return (
    <article data-listening-material className="min-w-0 font-modern text-[16px] leading-relaxed text-gray-900">
      <h2 className="mb-1.5 text-base font-bold leading-snug">{material.title}</h2>
      {!material.images?.length && material.instruction && <p className="mb-3 text-sm text-gray-600">{material.instruction}</p>}
      {!material.images?.length && sections}
      {material.table && <div className="mb-3 overflow-x-auto" tabIndex={0} aria-label="資料の表">
        <table className="w-full border-collapse text-left text-[16px]">
          <thead><tr>{material.table.headers.map((cell, i) =>
            <th key={i} scope="col" className="border border-gray-300 bg-blue-50 px-3 py-2">{cell}</th>)}</tr></thead>
          <tbody>{material.table.rows.map((row, i) => <tr key={i}>
            {row.map((cell, j) => <td key={j} className="min-w-20 border border-gray-300 px-3 py-2">{text(cell) || '\u00a0'}</td>)}
          </tr>)}</tbody>
        </table>
      </div>}
      {material.images?.map(image => <figure data-material-graph key={image.src} className="mb-4">
        {image.caption !== material.title && <figcaption className="mb-1 text-sm font-bold">{image.caption}</figcaption>}
        {/* 補足は1行の小さな文字に（スマホの資料ペインは高さが限られるため） */}
        <p className="mb-0.5 text-[11px] leading-tight text-gray-500">横にスクロールして図全体を確認できます</p>
        <div tabIndex={0} aria-label={`${image.caption}・横スクロール`}
          className="overflow-x-auto overscroll-x-contain rounded border border-gray-200 bg-white">
          <img src={image.src} alt={image.caption} className="block h-auto w-full max-w-none"
            style={{ minWidth: image.minWidth || 360 }} />
        </div>
      </figure>)}
      {!!material.images?.length && material.instruction && <p className="mb-3 text-sm text-gray-600">{material.instruction}</p>}
      {!!material.images?.length && sections}
    </article>
  );
}
