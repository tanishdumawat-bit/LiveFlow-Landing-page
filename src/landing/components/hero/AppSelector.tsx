import { motion, useReducedMotion } from 'motion/react';
import { HERO_APPS, type HeroAppId } from '../../data/heroShowcase';

type Props = {
  activeId: HeroAppId;
  onSelect: (id: HeroAppId) => void;
};

/** Workspace navigation — not a tab bar of equal cards. */
export function AppSelector({ activeId, onSelect }: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Navigate workspace destinations"
      className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2"
    >
      {HERO_APPS.map((app) => {
        const active = app.id === activeId;
        return (
          <motion.button
            key={app.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`hero-card-${app.id}`}
            onClick={() => onSelect(app.id)}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            animate={reduce || !active ? undefined : { y: [0, -1, 0] }}
            transition={
              active
                ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 400, damping: 28 }
            }
            className="relative inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium tracking-tight whitespace-nowrap sm:px-4"
            style={{
              color: active ? '#2A2420' : '#8A8F98',
              background: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
              borderColor: active ? app.accent : 'rgba(230,232,236,0.7)',
              boxShadow: active
                ? `0 8px 22px rgba(42,36,32,0.1), 0 0 0 1px ${app.accent}30, 0 0 18px ${app.accent}22`
                : 'none',
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: app.accent,
                opacity: active ? 1 : 0.45,
                boxShadow: active ? `0 0 8px ${app.accent}` : 'none',
              }}
            />
            {app.name}
          </motion.button>
        );
      })}
    </div>
  );
}
