import { useId, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { getApp, type FlowStage, type HeroAppId, type WorkspaceMode } from '../../data/heroShowcase';
import { theme } from '../../../theme/tokens';

type Props = {
  activeId: HeroAppId;
  stage: FlowStage | 'idle';
  mode: WorkspaceMode;
  /** Destination in % of workspace box. */
  to: { x: number; y: number };
  /** Origin (Live Flow) in %. */
  from?: { x: number; y: number };
};

/**
 * Magnetic voice/info path from Live Flow → active application.
 * Stage drives waveform energy, particle travel, and settle.
 */
export function FlowPath({
  activeId,
  stage,
  mode,
  to,
  from = { x: 50, y: 52 },
}: Props) {
  const id = useId().replace(/:/g, '');
  const reduce = !!useReducedMotion();
  const accent = getApp(activeId).accent;

  const delivering =
    stage === 'delivering' || stage === 'complete' || stage === 'transforming';
  const active = stage !== 'idle' && mode === 'focus';

  const d = useMemo(() => {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // Soft curve — pulled magnetically toward destination
    const cx = mx + (x2 - x1) * 0.08;
    const cy = my - 8;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  }, [from.x, from.y, to.x, to.y]);

  const particleCount =
    stage === 'transcribing' || stage === 'understanding'
      ? 4
      : stage === 'transforming' || stage === 'delivering'
        ? 6
        : stage === 'complete'
          ? 2
          : 0;

  if (mode === 'ecosystem') {
    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {['gmail', 'slack', 'notion', 'chatgpt', 'cursor', 'browser'].map((aid, i) => {
          const app = getApp(aid as HeroAppId);
          const path = `M ${from.x} ${from.y} Q ${(from.x + app.x) / 2} ${(from.y + app.y) / 2 - 4} ${app.x} ${app.y}`;
          return (
            <motion.path
              key={aid}
              d={path}
              fill="none"
              stroke={app.accent}
              strokeWidth="0.15"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.35 }}
              transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.08 }}
            />
          );
        })}
      </svg>
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fp-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.85" />
          <stop offset="55%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
        </linearGradient>
        <filter id={`fpb-${id}`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>

      {/* Soft glow under path */}
      <motion.path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth="0.6"
        strokeLinecap="round"
        filter={`url(#fpb-${id})`}
        animate={{
          opacity: active ? (delivering ? 0.45 : 0.22) : 0,
        }}
        transition={{ duration: 0.45 }}
      />

      <motion.path
        d={d}
        fill="none"
        stroke={`url(#fp-${id})`}
        strokeWidth={
          stage === 'listening'
            ? 0.22
            : stage === 'transforming'
              ? 0.35
              : delivering
                ? 0.4
                : 0.28
        }
        strokeLinecap="round"
        strokeDasharray={
          stage === 'listening'
            ? '0.8 1.2'
            : stage === 'understanding'
              ? '1.4 0.6'
              : stage === 'transforming'
                ? '0.5 0.9 1.6 0.9'
                : '2 0.8'
        }
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          pathLength: active ? 1 : 0,
          strokeDashoffset: reduce || !active ? 0 : [0, -12],
        }}
        transition={{
          opacity: { duration: 0.35 },
          pathLength: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
          strokeDashoffset: { duration: 2.4, repeat: Infinity, ease: 'linear' },
        }}
      />

      {/* Branch flicker while transforming */}
      {stage === 'transforming' && !reduce && (
        <>
          <motion.path
            d={`M ${from.x} ${from.y} Q ${from.x - 6} ${(from.y + to.y) / 2} ${to.x - 4} ${to.y}`}
            fill="none"
            stroke={accent}
            strokeWidth="0.18"
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: [0, 0.5, 0], pathLength: [0, 1, 1] }}
            transition={{ duration: 0.9 }}
          />
          <motion.path
            d={`M ${from.x} ${from.y} Q ${from.x + 6} ${(from.y + to.y) / 2} ${to.x + 4} ${to.y}`}
            fill="none"
            stroke={accent}
            strokeWidth="0.18"
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: [0, 0.45, 0], pathLength: [0, 1, 1] }}
            transition={{ duration: 0.9, delay: 0.05 }}
          />
        </>
      )}

      {!reduce &&
        Array.from({ length: particleCount }).map((_, i) => {
          const t0 = i / Math.max(particleCount, 1);
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2 - 8;
          return (
            <motion.circle
              key={`${activeId}-${stage}-${i}`}
              r="0.32"
              fill={i % 2 === 0 ? theme.primary : accent}
              initial={{ opacity: 0, cx: from.x, cy: from.y }}
              animate={{
                opacity: stage === 'complete' ? [0.9, 0] : [0, 0.95, 0],
                cx: [from.x, mx, to.x],
                cy: [from.y, my, to.y],
              }}
              transition={{
                duration: stage === 'delivering' ? 0.9 : 1.35,
                delay: t0 * 0.35,
                repeat: stage === 'complete' ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
    </svg>
  );
}
