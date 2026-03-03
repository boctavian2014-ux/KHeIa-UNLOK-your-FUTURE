import { isNonEmpty } from '@/utils/validators';

describe('validators', () => {
  describe('isNonEmpty', () => {
    it('returns true for non-empty string', () => {
      expect(isNonEmpty('a')).toBe(true);
      expect(isNonEmpty('hello')).toBe(true);
      expect(isNonEmpty('  x  ')).toBe(true);
    });
    it('returns false for empty string', () => {
      expect(isNonEmpty('')).toBe(false);
    });
    it('returns false for whitespace-only string', () => {
      expect(isNonEmpty('   ')).toBe(false);
      expect(isNonEmpty('\t')).toBe(false);
    });
  });
});
