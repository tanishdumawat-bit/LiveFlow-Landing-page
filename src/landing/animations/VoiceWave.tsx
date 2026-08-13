import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type VoiceWaveProps = {
  active?: boolean;
  amplitude?: number;
  className?: string;
  color?: string;
  secondaryColor?: string;
};

export function VoiceWave({
  active = true,
  amplitude = 1,
  className = '',
  color = '#7c5cff',
  secondaryColor = '#5ce1e6',
}: VoiceWaveProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const amp = Math.max(0.15, Math.min(amplitude, 1.4));

  if (reduce || !active) {
    return (
      <svg viewBox="0 0 240 48" className={className} aria-hidden="true">
        <path
          d="M0 24 C40 24 40 24 80 24 S120 24 160 24 S200 24 240 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.45"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.2" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={`M0 24 C30 ${24 - 10 * amp} 50 ${24 + 12 * amp} 80 24 S110 ${24 - 14 * amp} 140 24 S180 ${24 + 10 * amp} 210 24 S230 ${24 - 6 * amp} 240 24`}
        fill="none"
        stroke={secondaryColor}
        strokeWidth="1.5"
        opacity="0.35"
        animate={{
          d: [
            `M0 24 C30 ${24 - 10 * amp} 50 ${24 + 12 * amp} 80 24 S110 ${24 - 14 * amp} 140 24 S180 ${24 + 10 * amp} 210 24 S230 ${24 - 6 * amp} 240 24`,
            `M0 24 C30 ${24 + 8 * amp} 50 ${24 - 14 * amp} 80 24 S110 ${24 + 12 * amp} 140 24 S180 ${24 - 8 * amp} 210 24 S230 ${24 + 5 * amp} 240 24`,
            `M0 24 C30 ${24 - 10 * amp} 50 ${24 + 12 * amp} 80 24 S110 ${24 - 14 * amp} 140 24 S180 ${24 + 10 * amp} 210 24 S230 ${24 - 6 * amp} 240 24`,
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.path
        d={`M0 24 C25 ${24 - 14 * amp} 55 ${24 + 16 * amp} 90 24 S125 ${24 - 18 * amp} 160 24 S195 ${24 + 12 * amp} 220 24 S235 ${24 - 8 * amp} 240 24`}
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth="2.25"
        strokeLinecap="round"
        filter={`url(#${id}-glow)`}
        animate={{
          d: [
            `M0 24 C25 ${24 - 14 * amp} 55 ${24 + 16 * amp} 90 24 S125 ${24 - 18 * amp} 160 24 S195 ${24 + 12 * amp} 220 24 S235 ${24 - 8 * amp} 240 24`,
            `M0 24 C25 ${24 + 12 * amp} 55 ${24 - 18 * amp} 90 24 S125 ${24 + 16 * amp} 160 24 S195 ${24 - 14 * amp} 220 24 S235 ${24 + 7 * amp} 240 24`,
            `M0 24 C25 ${24 - 14 * amp} 55 ${24 + 16 * amp} 90 24 S125 ${24 - 18 * amp} 160 24 S195 ${24 + 12 * amp} 220 24 S235 ${24 - 8 * amp} 240 24`,
          ],
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}
