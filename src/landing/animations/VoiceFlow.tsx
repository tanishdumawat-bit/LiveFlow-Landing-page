import { useId, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { theme } from '../../theme/tokens';

export type VoiceFlowState = 'idle' | 'listening' | 'processing' | 'transcribing' | 'complete';

type VoiceFlowProps = {
  state?: VoiceFlowState;
  amplitude?: number;
  className?: string;
  stretch?: number;
  showParticles?: boolean;
};

const STATE_AMP: Record<VoiceFlowState, number> = {
  idle: 0.28,
  listening: 1,
  transcribing: 0.85,
  processing: 0.55,
  complete: 0.22,
};

function buildPath(amp: number, seed: number) {
  const a = amp;
  const s = seed;
  return `M0 24 C28 ${24 - 12 * a * s} 52 ${24 + 14 * a} 80 24 S128 ${24 - 16 * a * s} 160 24 S208 ${24 + 12 * a} 240 24 S280 ${24 - 8 * a} 320 24`;
}

export function VoiceFlow({
  state = 'idle',
  amplitude,
  className = '',
  stretch = 1,
  showParticles = true,
}: VoiceFlowProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const amp = amplitude ?? STATE_AMP[state];
  const active = state !== 'idle' && state !== 'complete';
  const color = state === 'listening' || state === 'transcribing' ? theme.primary : theme.success;
  const secondary = theme.filler;

  const paths = useMemo(
    () => ({
      primary: [buildPath(amp, 1), buildPath(amp * 1.05, 0.75), buildPath(amp, 1.1)],
      ghost: [buildPath(amp * 0.7, 0.85), buildPath(amp * 0.8, 1.15), buildPath(amp * 0.7, 0.9)],
    }),
    [amp],
  );

  if (reduce) {
    return (
      <svg
        viewBox="0 0 320 48"
        className={className}
        style={{ transform: `scaleX(${stretch})` }}
        aria-hidden="true"
      >
        <path d={buildPath(0.2, 1)} fill="none" stroke={color} strokeWidth="1.5" opacity="0.45" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 48"
      className={className}
      style={{ transform: `scaleX(${stretch})`, transformOrigin: 'center' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.15" />
          <stop offset="45%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.2" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={paths.ghost[0]}
        fill="none"
        stroke={secondary}
        strokeWidth="1.4"
        opacity={active ? 0.35 : 0.18}
        animate={{ d: paths.ghost }}
        transition={{ duration: active ? 1.8 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.path
        d={paths.primary[0]}
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth={active ? 2.4 : 1.8}
        strokeLinecap="round"
        filter={`url(#${id}-glow)`}
        animate={{ d: paths.primary }}
        transition={{ duration: active ? 1.35 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {showParticles && active &&
        [0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            r={1.6 + (i % 2)}
            fill={i % 2 ? secondary : color}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              offsetDistance: ['0%', '100%'],
            }}
            style={{
              offsetPath: `path("${paths.primary[0]}")`,
            }}
            transition={{
              duration: 2.1 + i * 0.25,
              repeat: Infinity,
              delay: i * 0.35,
              ease: 'easeInOut',
            }}
          />
        ))}
    </svg>
  );
}
