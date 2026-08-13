import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  HERO_CLEAN_TEXT,
  HERO_RAW_WORDS,
  type FlowStage,
} from '../../data/heroShowcase';

type Props = {
  stage: FlowStage | 'idle';
  accent: string;
};

/**
 * Live transcription strip — communicates RAW SPEECH → CLEAN TEXT
 * without changing the hero layout.
 */
export function LiveTranscript({ stage, accent }: Props) {
  const reduce = useReducedMotion();

  const showRaw = stage === 'transcribing' || stage === 'understanding';
  const showClean = stage === 'transforming' || stage === 'delivering';
  const processing = stage === 'understanding';

  if (stage === 'idle' || stage === 'listening') {
    return (
      <div className="mx-auto flex h-11 max-w-lg items-center justify-center" aria-hidden="true">
        <motion.span
          className="text-xs tracking-wide text-[#5C534C]/70"
          animate={reduce ? undefined : { opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Waiting for voice…
        </motion.span>
      </div>
    );
  }

  return (
    <div
      className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#E9DECB] bg-white/90 px-4 py-2.5 shadow-[0_8px_24px_rgba(42,36,32,0.05)] backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {showRaw && !showClean && (
          <motion.p
            key="raw"
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              y: 0,
              filter: processing ? 'blur(1.5px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-x-1.5 gap-y-1 text-sm text-[#2A2420]"
          >
            {HERO_RAW_WORDS.map((word, i) => {
              const isFiller = word === 'um';
              return (
                <motion.span
                  key={`${word}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(5px)' }}
                  animate={{
                    opacity: processing && isFiller ? 0.25 : 1,
                    y: 0,
                    filter: 'blur(0px)',
                    textDecoration: processing && isFiller ? 'line-through' : 'none',
                  }}
                  transition={{
                    delay: reduce ? 0 : i * 0.09,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                  style={{ color: isFiller && processing ? '#5C534C' : undefined }}
                >
                  {word}
                </motion.span>
              );
            })}
            {processing && (
              <motion.span
                className="ml-1 inline-block h-3.5 w-0.5 rounded-full"
                style={{ background: accent }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </motion.p>
        )}

        {showClean && (
          <motion.p
            key="clean"
            initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm font-medium text-[#2A2420]"
          >
            {HERO_CLEAN_TEXT}
            {stage === 'delivering' && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-2 text-xs font-medium"
                style={{ color: accent }}
              >
                → inserted
              </motion.span>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
