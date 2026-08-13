import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type TextMorphProps = {
  from: string;
  to: string;
  phase: 'raw' | 'processing' | 'polished';
  className?: string;
};

export function TextMorph({ from, to, phase, className = '' }: TextMorphProps) {
  const reduce = useReducedMotion();
  const text = phase === 'polished' ? to : from;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${phase}-${text}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', y: 6 }}
          animate={
            phase === 'processing'
              ? reduce
                ? { opacity: 0.7 }
                : { opacity: [0.55, 0.9, 0.55], filter: ['blur(4px)', 'blur(1px)', 'blur(4px)'] }
              : reduce
                ? { opacity: 1 }
                : { opacity: 1, filter: 'blur(0px)', y: 0 }
          }
          exit={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)', y: -4 }}
          transition={{ duration: phase === 'processing' ? 1.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-pre-wrap text-[15px] leading-relaxed text-background"
        >
          {text}
        </motion.p>
      </AnimatePresence>

      {phase === 'processing' && !reduce ? (
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-16 from-transparent to-transparent"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent, color-mix(in srgb, var(--primary) 40%, transparent), transparent)',
          }}
          initial={{ left: '-20%' }}
          animate={{ left: '110%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
