import { motion, useReducedMotion } from 'motion/react';
import { FLOW_STAGES, type FlowStage, getApp, type HeroAppId } from '../../data/heroShowcase';

type Props = {
  stage: FlowStage | 'idle';
  activeAppId: HeroAppId;
};

/**
 * Equal 5-column grid so dots, rail, and labels stay perfectly centered.
 */
export function FlowPipeline({ stage, activeAppId }: Props) {
  const reduce = useReducedMotion();
  const accent = getApp(activeAppId).accent;
  const activeIndex =
    stage === 'idle'
      ? -1
      : stage === 'complete'
        ? FLOW_STAGES.length - 1
        : FLOW_STAGES.findIndex((s) => s.id === stage);
  const count = FLOW_STAGES.length;
  const progress =
    activeIndex < 0 ? 0 : Math.max(activeIndex, 0) / Math.max(count - 1, 1);

  return (
    <div
      className="mx-auto w-full max-w-xl"
      aria-label="Processing pipeline"
      role="status"
    >
      <div
        className="grid items-start"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {/* Rail sits on the first row, spanning column centers */}
        <div className="pointer-events-none relative col-span-full row-start-1 h-4">
          <div className="absolute top-1/2 right-[10%] left-[10%] h-px -translate-y-1/2 bg-[#E6E8EC]" />
          <motion.div
            className="absolute top-1/2 left-[10%] h-px origin-left -translate-y-1/2"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent}99)` }}
            initial={false}
            animate={{
              width: `${progress * 80}%`,
              opacity: activeIndex >= 0 ? 1 : 0,
            }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {FLOW_STAGES.map((s, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div
              key={s.id}
              className="relative z-10 flex flex-col items-center gap-2.5"
            >
              <div className="relative flex h-4 w-4 items-center justify-center">
                {isActive && !reduce && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1.5px solid ${accent}` }}
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <motion.span
                  className="relative block h-2.5 w-2.5 rounded-full"
                  animate={{
                    backgroundColor: isActive || isPast ? accent : '#C8CCD4',
                    scale: isActive ? 1.2 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                />
              </div>
              <span
                className="w-full text-center text-[10px] font-medium tracking-wide sm:text-[11px]"
                style={{
                  color: isActive ? accent : isPast ? '#2A2420' : '#5C5F66',
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
