import { describe, it, expect } from 'vitest';
import { safeAvatarUrl } from '../src/features/safety/avatarUrl';

describe('safeAvatarUrl（他人のアイコンは Google の配信元だけ）', () => {
  it('Google のアイコンは通す', () => {
    expect(safeAvatarUrl('https://lh3.googleusercontent.com/a/abc=s96-c')).toContain('googleusercontent.com');
  });
  it.each([
    'http://lh3.googleusercontent.com/a/x',
    'https://evil.example.com/track.gif',
    'https://googleusercontent.com.evil.com/x',
    'javascript:alert(1)',
    'data:image/svg+xml,<svg onload=alert(1)>',
    'https://user:pw@lh3.googleusercontent.com/x',
    '',
    'https://lh3.googleusercontent.com/' + 'a'.repeat(600),
  ])('%s は出さない', (u) => expect(safeAvatarUrl(u)).toBe(''));
});
