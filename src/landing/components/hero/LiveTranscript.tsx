import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  HERO_CLEAN_TEXT,
  HERO_FILLER,
  HERO_KEY_WORDS,
  HERO_RAW_WORDS,
  type FlowStage,
} from '../../data/heroShowcase';

type Props = {
  stage: FlowStage | 'idle';
  accent: string;
  appName: string;
  contextFlash: boolean;
};

/**
 * Physical language transform: raw words → fillers dissolve → keys remain → clean phrase.
 */
export function LiveTranscript({ stage, accent, appName, contextFlash }: Props) {
  const reduce = !!useReducedMotion();
  const showRaw =
    stage === 'transcribing' || stage === 'understanding' || stage === 'transforming';
  const showClean = stage === 'delivering' || stage === 'complete';
  const dissolving = stage === 'understanding' || stage === 'transforming';

  return (
    <div
      className="mx-auto flex min-h-12 w-full max-w-lg flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/70 bg-white/80 px-5 py-3 text-center shadow-[0_8px_24px_rgba(42,36,32,0.05)] backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {(stage === 'idle' || stage === 'listening') && (
          <motion.span
            key="wait"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs tracking-wide text-[#5C5F66]"
          >
            {stage === 'listening' ? 'Listening…' : 'Waiting for voice…'}
          </motion.span>
        )}

        {showRaw && !showClean && (
          <motion.div
            key="raw"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1"
          >
            {HERO_RAW_WORDS.map((word, i) => {
              const bare = word.replace(/\.$/, '').toLowerCase();
              const isFiller = HERO_FILLER.has(bare);
              const isKey = HERO_KEY_WORDS.some((k) => bare.includes(k));
              const hide =
                dissolving && isFiller
                  ? 0.15
                  : dissolving && !isKey && stage === 'transforming'
                    ? 0.35
                    : 1;
              return (
                <motion.span
                  key={`${word}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{
                    opacity: hide,
                    y: dissolving && isFiller ? -4 : 0,
                    filter: dissolving && isFiller ? 'blur(3px)' : 'blur(0px)',
                    scale: dissolving && isKey ? 1.06 : 1,
                    textDecoration: dissolving && isFiller ? 'line-through' : 'none',
                  }}
                  transition={{ delay: reduce ? 0 : i * 0.045, duration: 0.35 }}
                  className="inline-block text-sm"
                  style={{
                    color: dissolving && isKey ? accent : '#2A2420',
                    fontWeight: dissolving && isKey ? 600 : 400,
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.div>
        )}

        {showClean && (
          <motion.p
            key="clean"
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-[#2A2420]"
          >
            {HERO_CLEAN_TEXT}
            <span className="ml-2 text-xs font-medium" style={{ color: accent }}>
              → {appName}
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      {contextFlash && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-semibold tracking-[0.16em] text-[#5C5F66] uppercase"
        >
          Context detected · {appName}
        </motion.p>
      )}
    </div>
  );
}
