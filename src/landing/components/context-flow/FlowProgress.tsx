import { motion } from 'motion/react';
import { FLOW_PHASES, type FlowPhase, phaseIndex } from '../../data/contextFlow';

type Props = {
  phase: FlowPhase;
  reduce?: boolean;
};

export function FlowProgress({ phase, reduce }: Props) {
  const active = phaseIndex(phase);

  return (
    <div className="mx-auto w-full max-w-2xl" aria-label="Context flow progress">
      <div className="relative grid grid-cols-4 gap-2">
        <div className="pointer-events-none absolute top-2 right-[12%] left-[12%] h-px bg-[#E6E8EC]" />
        <motion.div
          className="pointer-events-none absolute top-2 left-[12%] h-px origin-left bg-[#C4501E]"
          animate={{ width: `${(Math.max(active, 0) / 3) * 76}%` }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
        {FLOW_PHASES.map((step, i) => {
          const on = i <= active;
          const current = i === active;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <span
                className={`block h-2.5 w-2.5 rounded-full transition ${
                  current
                    ? 'scale-125 bg-[#C4501E] shadow-[0_0_12px_rgba(196,80,30,0.45)]'
                    : on
                      ? 'bg-[#C4501E]'
                      : 'bg-[#C8CCD4]'
                }`}
              />
              <span
                className={`text-center text-[10px] font-medium tracking-wide sm:text-[11px] ${
                  current ? 'text-[#C4501E]' : on ? 'text-[#2A2420]' : 'text-[#5C5F66]'
                }`}
              >
                <span className="mr-1 opacity-60">{step.n}</span>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
