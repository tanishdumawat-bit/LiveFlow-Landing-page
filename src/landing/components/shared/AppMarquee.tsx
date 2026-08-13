import { motion, useReducedMotion } from 'motion/react';
import { HERO_APPS } from '../../data/heroShowcase';
import { AppIconBadge } from './AppIcon';

const NAMES = [
  ...HERO_APPS.map((a) => a.name),
  'Notes',
  'Messages',
  'Terminal',
  'Linear',
  'Notion Calendar',
];

/**
 * Dense “works everywhere” strip so the page never reads as empty white.
 */
export function AppMarquee() {
  const reduce = useReducedMotion();
  const loop = [...NAMES, ...NAMES];

  return (
    <div className="relative mt-10 w-full">
      <p className="mb-4 text-center text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
        Works wherever you type
      </p>
      <div className="mask-x-fade overflow-hidden">
        <motion.div
          className="flex w-max gap-3 pr-3"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((name, i) => {
            const app = HERO_APPS.find((a) => a.name === name);
            return (
              <span
                key={`${name}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-ink shadow-card backdrop-blur-sm"
              >
                {app ? (
                  <AppIconBadge name={app.name} accent={app.accent} size="xs" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-violet" />
                )}
                {name}
              </span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
