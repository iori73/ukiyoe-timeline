/**
 * モーショントークン - Motion Tokens
 *
 * CSS変数 (App.css :root) と同じ値を JS で共有する。
 * Framer Motion は CSS変数を直接参照できないため、
 * 同じ値を JS 定数として定義する。
 *
 * CSS側: --duration-fast: 0.2s / --ease-ukiyoe: cubic-bezier(0.19, 1.0, 0.22, 1.0)
 * JS側:  duration.fast = 0.2   / easing.ukiyoe = [0.19, 1.0, 0.22, 1.0]
 */

// ─── Duration (秒) ─────────────────────────────────
export const duration = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
  slower: 1,
  slowest: 1.5,
};

// ─── Easing (cubic-bezier 配列) ────────────────────
export const easing = {
  ukiyoe: [0.19, 1.0, 0.22, 1.0],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
};

/** CSS の transition 用（inline style で cubic-bezier 文字列が必要な場合） */
export const easingCss = {
  ukiyoe: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// ─── Transition プリセット ──────────────────────────
export const transition = {
  fast: { duration: duration.fast, ease: easing.easeInOut },
  normal: { duration: duration.normal, ease: easing.easeInOut },
  slow: { duration: duration.slow, ease: easing.ukiyoe },
  slower: { duration: duration.slower, ease: easing.ukiyoe },
  pageEnter: { duration: duration.slowest, ease: easing.ukiyoe },
};

// ─── Spring プリセット ──────────────────────────────
export const spring = {
  gentle: { type: 'spring', stiffness: 15, damping: 12, mass: 1.2 },
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
};

// ─── Stagger (子要素の遅延) ─────────────────────────
export const stagger = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.1,
};

// ─── prefers-reduced-motion 対応 ────────────────────
export const reducedMotion = {
  duration: 0.01,
  ease: 'linear',
};
