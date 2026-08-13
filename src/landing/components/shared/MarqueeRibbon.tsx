import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export type RibbonTone = 'coral' | 'violet' | 'teal' | 'gold' | 'sky' | 'midnight';

const TONE: Record<RibbonTone, { from: string; via: string; to: string; ink: string }> = {
  coral: {
    from: 'color-mix(in srgb, var(--primary-soft) 70%, var(--background))',
    via: 'color-mix(in srgb, var(--surface) 88%, white)',
    to: 'color-mix(in srgb, var(--violet-soft) 55%, var(--background))',
    ink: 'var(--primary-dark)',
  },
  violet: {
    from: 'color-mix(in srgb, var(--violet-soft) 80%, var(--background))',
    via: 'var(--background)',
    to: 'color-mix(in srgb, var(--teal-soft) 50%, var(--background))',
    ink: 'var(--violet)',
  },
  teal: {
    from: 'color-mix(in srgb, var(--teal-soft) 70%, var(--background))',
    via: 'var(--background)',
    to: 'color-mix(in srgb, var(--accent-soft) 60%, var(--background))',
    ink: 'var(--teal)',
  },
  gold: {
    from: 'color-mix(in srgb, var(--accent-soft) 80%, var(--background))',
    via: 'var(--background)',
    to: 'color-mix(in srgb, var(--sky-soft) 50%, var(--background))',
    ink: 'var(--primary-dark)',
  },
  sky: {
    from: 'color-mix(in srgb, var(--sky-soft) 70%, var(--background))',
    via: 'var(--background)',
    to: 'color-mix(in srgb, var(--surface) 80%, var(--background))',
    ink: 'var(--sky)',
  },
  midnight: {
    from: 'var(--midnight)',
    via: '#1a1512',
    to: 'var(--midnight)',
    ink: 'var(--gold)',
  },
};

type Props = {
  items: string[];
  tone?: RibbonTone;
  reverse?: boolean;
  from?: string;
  to?: string;
  children?: ReactNode;
};

/**
 * Full-bleed moving type that stitches one section into the next.
 */
export function MarqueeRibbon({
  items,
  tone = 'coral',
  reverse,
  from,
  to,
}: Props) {
  const reduce = useReducedMotion();
  const palette = TONE[tone];
  const loop = [...items, ...items, ...items];

  return (
    <div
      className="relative z-10 overflow-hidden py-4 sm:py-5"
      style={{
        background: `linear-gradient(90deg, ${palette.from}, ${palette.via}, ${palette.to})`,
      }}
      aria-hidden="true"
    >
      {(from || to) && (
        <div className="mb-2 flex items-center justify-center gap-3 px-4">
          {from && (
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: palette.ink }}>
              {from}
            </span>
          )}
          <span className="h-px w-10 bg-current opacity-30" style={{ color: palette.ink }} />
          {to && (
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: palette.ink }}>
              {to}
            </span>
          )}
        </div>
      )}
      <div className="mask-x-fade flex overflow-x-hidden overflow-y-visible py-1.5">
        <motion.div
          className="flex shrink-0 gap-8 py-0.5 pr-8 text-[13px] leading-6 font-medium tracking-wide sm:text-[15px]"
          style={{ color: palette.ink }}
          animate={
            reduce
              ? undefined
              : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }
          }
          transition={{ duration: reverse ? 36 : 28, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((item, i) => (
            <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
              <span className="whitespace-nowrap">{item}</span>
              <span className="text-[8px] opacity-50">●</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
