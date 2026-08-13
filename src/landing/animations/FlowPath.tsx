import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type FlowPathProps = {
  progress?: number;
  intensity?: number;
  active?: boolean;
  className?: string;
  /** SVG path from viewBox 0 0 100 100 */
  d?: string;
  color?: string;
};

const DEFAULT_PATH = 'M12 50 C28 42 40 58 50 50 S72 40 88 50';

export function FlowPath({
  progress = 1,
  intensity = 1,
  active = true,
  className = '',
  d = DEFAULT_PATH,
  color = '#9b87ff',
}: FlowPathProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const opacity = active ? 0.35 + intensity * 0.55 : 0.12;

  return (
    <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5ce1e6" stopOpacity="0.15" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#5ce1e6" stopOpacity="0.2" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={d} fill="none" stroke={color} strokeOpacity={0.12} strokeWidth="0.6" />

      <motion.path
        d={d}
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth={active ? 1.1 : 0.5}
        strokeLinecap="round"
        filter={active ? `url(#${id}-glow)` : undefined}
        style={{ pathLength: progress, opacity }}
        initial={reduce ? undefined : { pathLength: 0 }}
        animate={reduce ? { pathLength: progress, opacity } : { pathLength: progress, opacity }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />

      {active && !reduce && (
        <motion.circle
          r="1.2"
          fill={color}
          style={{ offsetPath: `path("${d}")` }}
          animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6 / Math.max(intensity, 0.4), repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </svg>
  );
}
