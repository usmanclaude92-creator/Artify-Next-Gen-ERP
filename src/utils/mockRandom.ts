/**
 * Deterministic stand-in for Math.random() used when generating mock document
 * numbers, so demos and tests produce the same sequence on every page load.
 */
let state = 0x2f6e2b1;

export const mockRandom = (): number => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
