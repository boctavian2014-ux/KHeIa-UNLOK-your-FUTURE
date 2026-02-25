jest.mock('../../../src/services/supabase', () => ({
  supabase: { from: jest.fn() },
}));

import {
  getLevelFromXP,
  getXPForNextLevel,
  getXPMultiplier,
  buildProgressCertificateShareText,
  buildTestResultShareText,
} from '../../../src/services/gamification.service';

describe('gamification.service', () => {
  it('computes level from XP', () => {
    expect(getLevelFromXP(0)).toBe(1);
    expect(getLevelFromXP(99)).toBe(1);
    expect(getLevelFromXP(100)).toBe(2);
    expect(getLevelFromXP(250)).toBe(3);
  });

  it('computes XP for next level', () => {
    expect(getXPForNextLevel(0)).toBe(100);
    expect(getXPForNextLevel(50)).toBe(50);
    expect(getXPForNextLevel(100)).toBe(100);
  });

  it('getXPMultiplier returns correct multipliers', () => {
    expect(getXPMultiplier(0)).toBe(1);
    expect(getXPMultiplier(2)).toBe(1);
    expect(getXPMultiplier(3)).toBe(1.25);
    expect(getXPMultiplier(7)).toBe(1.5);
    expect(getXPMultiplier(14)).toBe(1.75);
    expect(getXPMultiplier(21)).toBe(2);
    expect(getXPMultiplier(30)).toBe(2);
  });

  it('buildProgressCertificateShareText formats correctly', () => {
    const text = buildProgressCertificateShareText(8, 10, 'Text literar');
    expect(text).toContain('8/10');
    expect(text).toContain('80%');
    expect(text).toContain('Text literar');
    expect(text).toContain('KhEIa');
    expect(text).toContain('Evaluare Națională 2026');
  });

  it('buildTestResultShareText formats correctly', () => {
    const text = buildTestResultShareText(15, 20, 'Română');
    expect(text).toContain('15/20');
    expect(text).toContain('75%');
    expect(text).toContain('Română');
    expect(text).toContain('KhEIa');
  });
});
