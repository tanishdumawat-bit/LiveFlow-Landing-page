/**
 * JS/inline-style access to the Warm Coral theme.
 * Hex values live only in `src/styles.css` `:root`. Change them there.
 */
export const theme = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  muted: 'var(--muted)',
  surface: 'var(--surface)',
  surfaceAlt: 'var(--surface-alt)',
  border: 'var(--border)',
  primary: 'var(--primary)',
  primaryDark: 'var(--primary-dark)',
  primarySoft: 'var(--primary-soft)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  ink: 'var(--ink)',
  card: 'var(--card)',
  filler: 'var(--filler)',
  success: 'var(--success)',
  onPrimary: 'var(--on-primary)',
  micOrb: 'var(--gradient-mic-orb)',
} as const;

export type ThemeToken = keyof typeof theme;

/** Mix a theme color with transparency for inline shadows/overlays. */
export function mix(token: `var(--${string})`, percent: number) {
  return `color-mix(in srgb, ${token} ${percent}%, transparent)`;
}
