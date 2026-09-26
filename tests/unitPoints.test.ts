/** ひとりで学ぶ：「この単元のポイント」 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { getChaptersOfSubject } from '../src/data/allChapters';

describe('この単元のポイント', () => {
  it('演習の見出しにポイントのボタンと一覧があり、答えは出さない', () => {
    const src = readFileSync('src/components/QuizHeader.tsx', 'utf8');
    expect(src).toContain('data-unit-points-button');
    expect(src).toContain('この単元のポイント');
    expect(src).not.toMatch(/correctAnswer|explanation/);
    expect(readFileSync('src/components/Quiz.tsx', 'utf8')).toContain('topics={Array.isArray(chapter.topics) ? chapter.topics : []}');
  });
  it('演習できる教科の単元にはポイント（topics）がある', () => {
    for (const id of ['chemistry_basic', 'chemistry', 'math', 'biology_basic', 'english_grammar', 'geography']) {
      const cs = getChaptersOfSubject(id);
      const withTopics = cs.filter((c: any) => Array.isArray(c.topics) && c.topics.length > 0);
      expect(withTopics.length, id).toBe(cs.length);
    }
  });
});
