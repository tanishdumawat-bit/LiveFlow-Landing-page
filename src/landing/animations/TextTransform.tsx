import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type TextTransformPhase = 'raw' | 'processing' | 'transformed';

type TextTransformProps = {
  from: string;
  to: string;
  phase: TextTransformPhase;
  className?: string;
};

function WordLayer({ text, dim }: { text: string; dim?: boolean }) {
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.35em] gap-y-1 ${dim ? 'opacity-50' : ''}`}>
      {text.split(/(\s+)/).map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={`s-${i}`}>{token}</span>;
        return (
          <motion.span
            key={`${token}-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: i * 0.035, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {token}
          </motion.span>
        );
      })}
    </span>
  );
}

export function TextTransform({ from, to, phase, className = '' }: TextTransformProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <p className={`whitespace-pre-wrap text-[15px] leading-relaxed text-ink ${className}`}>
        {phase === 'transformed' ? to : from}
      </p>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {phase === 'raw' && (
          <motion.p
            key="raw"
            initial={{ opacity: 0, clipPath: 'inset(0 40% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink"
          >
            <WordLayer text={from} />
          </motion.p>
        )}

        {phase === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <motion.p
              animate={{
                filter: ['blur(0px)', 'blur(3px)', 'blur(1px)'],
                opacity: [0.85, 0.55, 0.75],
                letterSpacing: ['0em', '0.02em', '0.01em'],
              }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="whitespace-pre-wrap text-[15px] leading-relaxed text-muted"
            >
              {from}
            </motion.p>
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-20"
              style={{
                background:
                  'linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 28%, transparent), color-mix(in srgb, var(--accent) 35%, transparent), transparent)',
              }}
              initial={{ left: '-25%' }}
              animate={{ left: '110%' }}
              transition={{ duration: 1.15, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              aria-hidden="true"
            />
          </motion.div>
        )}

        {phase === 'transformed' && (
          <motion.p
            key="transformed"
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)', scale: 0.985 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink"
          >
            <WordLayer text={to} />
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
