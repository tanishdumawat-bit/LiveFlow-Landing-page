import { motion, useReducedMotion } from 'motion/react';
import { HERO_APPS, type HeroAppId } from '../../data/heroShowcase';

type Props = {
  activeId: HeroAppId;
  onSelect: (id: HeroAppId) => void;
};

export function AppSelector({ activeId, onSelect }: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Choose application context"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
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
            whileHover={reduce ? undefined : { y: -1, scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors sm:px-4 sm:py-2"
            style={{
              color: active ? '#2A2420' : '#5C534C',
              background: active ? '#FFFFFF' : '#FAF3E9',
              border: `1px solid ${active ? app.accent : '#E9DECB'}`,
              boxShadow: active
                ? `0 8px 24px rgba(42,36,32,0.08), 0 0 0 1px ${app.accent}33`
                : 'none',
            }}
          >
            <span className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: app.accent,
                  opacity: active ? 1 : 0.75,
                }}
              />
              {app.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
