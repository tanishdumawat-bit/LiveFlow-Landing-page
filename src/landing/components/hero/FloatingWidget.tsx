import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getApp, type FlowStage, type HeroAppId } from '../../data/heroShowcase';
import { mix, theme } from '../../../theme/tokens';

type Props = {
  stage: FlowStage | 'idle';
  activeAppId: HeroAppId;
  seconds: number;
  onMicClick?: () => void;
};

function AudioBars({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-7 items-end gap-[3px]" aria-hidden="true">
      {[0.35, 0.7, 0.5, 0.95, 0.45, 0.8, 0.55, 0.75].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-success"
          animate={
            reduce || !active
              ? { height: 6 + h * 8, opacity: 0.4 }
              : { height: [6, 8 + h * 18, 7], opacity: [0.55, 1, 0.6] }
          }
          transition={{
            duration: 0.55 + (i % 3) * 0.08,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" />
      <path
        d="M5 11a7 7 0 0 0 14 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LeftWave({ active, accent }: { active: boolean; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-4 items-center gap-[2px]" aria-hidden="true">
      {[0.5, 0.9, 0.4, 1, 0.65, 0.85, 0.35, 0.7].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: accent }}
          animate={
            reduce || !active
              ? { height: 3 + h * 5, opacity: 0.4 }
              : { height: [3, 4 + h * 10, 4], opacity: [0.45, 1, 0.5] }
          }
          transition={{ duration: 0.65 + i * 0.03, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

const STAGE_LABEL: Record<FlowStage | 'idle', string> = {
  idle: 'Ready',
  listening: 'Listening…',
  transcribing: 'Transcribing…',
  understanding: 'Understanding…',
  transforming: 'Transforming…',
  delivering: 'Inserted',
  complete: 'Delivered',
};

export function FloatingWidget({ stage, activeAppId, seconds, onMicClick }: Props) {
  const reduce = useReducedMotion();
  const accent = getApp(activeAppId).accent;
  const live = stage === 'listening' || stage === 'transcribing';
  const active = stage !== 'idle';
  const mm = String(Math.floor(seconds / 60));
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <motion.div
      layout
      className="relative mx-auto w-full max-w-[650px]"
      animate={reduce ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="pointer-events-none absolute -inset-x-16 -bottom-10 -top-8 -z-10 rounded-[100%]"
        style={{
          background: `radial-gradient(ellipse at 50% 70%, ${accent}18, transparent 60%)`,
        }}
      />

      <div
        className="relative flex items-center justify-between gap-4 rounded-[999px] border border-border bg-white px-5 py-4 shadow-card-md sm:px-7 sm:py-5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pl-1">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight text-ink">Live Flow</span>
            <LeftWave active={live} accent={live ? theme.primary : accent} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium"
              style={{ color: live ? theme.primary : active ? accent : theme.muted }}
            >
              {STAGE_LABEL[stage]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="relative flex shrink-0 items-center justify-center">
          {!reduce && live && (
            <motion.span
              className="absolute inset-[-10px] rounded-full border border-primary/40"
              animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <motion.button
            type="button"
            aria-label="Live Flow microphone"
            onClick={onMicClick}
            className="relative flex h-[64px] w-[64px] items-center justify-center rounded-full text-white sm:h-[72px] sm:w-[72px]"
            style={{
              background: theme.micOrb,
              boxShadow: live
                ? `0 0 0 2px ${mix(theme.primary, 35)}, 0 12px 32px ${mix(theme.primary, 28)}`
                : `0 0 0 2px ${mix(theme.primary, 22)}, 0 10px 24px ${mix(theme.ink, 12)}`,
            }}
            animate={
              reduce
                ? undefined
                : live
                  ? { scale: [1, 1.04, 1] }
                  : { scale: [1, 1.02, 1] }
            }
            transition={{
              duration: live ? 1.4 : 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
          >
            <MicIcon />
          </motion.button>
        </div>

        <div className="flex flex-1 flex-col items-end gap-1.5 pr-1">
          <span className="font-mono text-sm tabular-nums text-ink/80">
            {mm}:{ss}
          </span>
          <AudioBars active={live} />
        </div>
      </div>
    </motion.div>
  );
}
