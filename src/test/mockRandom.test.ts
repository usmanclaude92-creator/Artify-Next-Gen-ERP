import { describe, expect, it } from 'vitest';
import { mockRandom } from '../utils/mockRandom';

describe('mockRandom', () => {
  it('returns values in [0, 1)', () => {
    for (let i = 0; i < 1000; i++) {
      const v = mockRandom();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
