import { motion, useReducedMotion } from 'motion/react';
import { FLOW_STAGES, type FlowStage, getApp, type HeroAppId } from '../../data/heroShowcase';
import { theme } from '../../../theme/tokens';

type Props = {
  stage: FlowStage | 'idle';
  activeAppId: HeroAppId;
};

export function FlowPipeline({ stage, activeAppId }: Props) {
  const reduce = useReducedMotion();
  const accent = getApp(activeAppId).accent;
  const activeIndex =
    stage === 'idle' ? -1 : FLOW_STAGES.findIndex((s) => s.id === stage);

  return (
    <div className="mx-auto w-full max-w-2xl px-2" aria-label="Processing pipeline" role="status">
      <div className="relative flex items-start justify-between">
        <div
          className="absolute top-[7px] right-[8%] left-[8%] h-px"
          style={{ background: theme.border }}
        />
        {activeIndex >= 0 && (
          <motion.div
            className="absolute top-[7px] left-[8%] h-px origin-left"
            style={{
              background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
            }}
            initial={false}
            animate={{
              width: `${(Math.max(activeIndex, 0) / (FLOW_STAGES.length - 1)) * 84}%`,
              opacity: 1,
            }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        )}

        {FLOW_STAGES.map((s, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div key={s.id} className="relative z-10 flex w-[18%] flex-col items-center gap-2">
              <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                {isActive && !reduce && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1px solid ${accent}` }}
                    animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <motion.span
                  className="relative h-2.5 w-2.5 rounded-full"
                  animate={{
                    backgroundColor: isActive || isPast ? accent : theme.filler,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
              </div>
              <span
                className="text-center text-[10px] font-medium tracking-wide sm:text-[11px]"
                style={{
                  color: isActive ? accent : isPast ? theme.ink : theme.muted,
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
