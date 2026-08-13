import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView, useReducedMotion } from 'motion/react';
import { CORRECTIONS } from '../../data/corrections';
import { mix, theme } from '../../../theme/tokens';

type Point = { x: number; y: number };

const BEFORE_POINTS: Point[] = [
  { x: 7, y: 36 },
  { x: 25, y: 62 },
  { x: 42, y: 40 },
];
const ORB_POINT: Point = { x: 50, y: 50 };
const AFTER_POINTS: Point[] = [
  { x: 58, y: 42 },
  { x: 75, y: 64 },
  { x: 93, y: 38 },
];

/** Fixed "beads" the string always passes through — clouds sit exactly on these. */
const ANCHORS: Point[] = [...BEFORE_POINTS, ORB_POINT, ...AFTER_POINTS];

/**
 * Smooth curve through a list of points (Catmull-Rom → cubic Bézier), so the
 * string reads as one continuous wave instead of straight zig-zag segments.
 */
function smoothPath(points: Point[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * Anchors (where clouds live) stay fixed; a midpoint is inserted between
 * every pair and driven by a phase-shifted sine over time, so the string
 * ripples like a traveling wave while the beads themselves hold still.
 */
function buildFlowingPoints(time: number, animate: boolean): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < ANCHORS.length; i++) {
    const a = ANCHORS[i]!;
    pts.push(a);
    const b = ANCHORS[i + 1];
    if (b) {
      const wobble = animate ? Math.sin(time * 1.6 + i * 1.05) * 4.5 : 0;
      pts.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + wobble });
    }
  }
  return pts;
}

function LiveFlowOrb() {
  const reduce = useReducedMotion();
  return (
    <div
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
      style={{ left: `${ORB_POINT.x}%`, top: `${ORB_POINT.y}%` }}
    >
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-cta-lg sm:h-16 sm:w-16"
        style={{ background: theme.micOrb }}
      >
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${theme.primary}` }}
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" />
          <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className="whitespace-nowrap text-[10px] font-semibold tracking-[0.14em] text-ink uppercase">
        Live Flow
      </p>
    </div>
  );
}

function Cloud({
  point,
  text,
  flaw,
  variant,
  delay,
  inView,
}: {
  point: Point;
  text: string;
  flaw?: string;
  variant: 'before' | 'after';
  delay: number;
  inView: boolean;
}) {
  const reduce = useReducedMotion();
  const parts = flaw
    ? text.split(new RegExp(`(${flaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'))
    : [text];

  return (
    <motion.div
      className="absolute w-26 -translate-x-1/2 -translate-y-1/2 sm:w-32"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      initial={{ opacity: 0, scale: 0.7, y: 8 }}
      animate={
        !inView
          ? undefined
          : reduce
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: [0, -5, 0, 4, 0] }
      }
      transition={
        reduce
          ? { duration: 0.4, delay }
          : {
              opacity: { duration: 0.5, delay },
              scale: { duration: 0.5, delay, type: 'spring', stiffness: 220, damping: 20 },
              y: {
                duration: 4.5 + delay * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.4,
              },
            }
      }
    >
      <div className="relative">
        <div
          className="rounded-2xl border px-3 py-2 text-center shadow-card backdrop-blur-sm"
          style={{
            borderColor: variant === 'after' ? mix(theme.success, 35) : mix(theme.border, 90),
            background: variant === 'after' ? theme.card : mix(theme.card, 88),
          }}
        >
          <p
            className={`text-[10px] leading-snug sm:text-[11px] ${
              variant === 'before' ? 'text-muted italic' : 'font-medium text-ink'
            }`}
          >
            {parts.map((part, i) =>
              flaw && part.toLowerCase() === flaw.toLowerCase() ? (
                <span key={i} className="text-primary/70 line-through">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        </div>
        {/* Tiny bead where the string meets the cloud */}
        <span
          className="absolute top-full left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
          style={{ background: variant === 'after' ? theme.success : theme.filler }}
        />
      </div>
    </motion.div>
  );
}

/**
 * A strung-together wave of thought clouds: raw fragments drift in on the
 * left, pass through the Live Flow anchor, and land as clean sentences on
 * the right — all visible at once, gently bobbing on a shared string.
 */
export function CorrectionBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [pathD, setPathD] = useState(() => smoothPath(buildFlowingPoints(0, false)));
  const lastUpdate = useRef(0);

  useAnimationFrame((t) => {
    if (reduce || !inView) return;
    // Throttle to ~24fps — plenty smooth for a gentle wave, cheaper on re-renders.
    if (t - lastUpdate.current < 42) return;
    lastUpdate.current = t;
    setPathD(smoothPath(buildFlowingPoints(t / 1000, true)));
  });

  return (
    <div ref={ref} className="relative z-10 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-center gap-3">
        <div className="h-px flex-1 origin-right bg-gradient-to-l from-border to-transparent" />
        <span className="text-[10px] font-medium tracking-[0.18em] text-muted/80 uppercase">
          Continue
        </span>
        <div className="h-px flex-1 origin-left bg-gradient-to-r from-border to-transparent" />
      </div>

      <div className="relative mx-auto h-72 w-full max-w-5xl sm:h-80">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Soft glow underlay so the wave reads as an energy line, not a plain wire */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={theme.primary}
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: 'blur(2.5px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.16 } : undefined}
            transition={{ duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke={theme.border}
            strokeWidth="1.1"
            strokeDasharray="2.6 2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 0 }}
            animate={
              inView
                ? {
                    pathLength: 1,
                    opacity: 0.85,
                    strokeDashoffset: reduce ? 0 : [0, -20],
                  }
                : undefined
            }
            transition={{
              pathLength: { duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] },
              strokeDashoffset: { duration: 2.6, repeat: Infinity, ease: 'linear', delay: 1.4 },
            }}
          />
        </svg>

        {BEFORE_POINTS.map((p, i) => (
          <Cloud
            key={CORRECTIONS[i]!.id}
            point={p}
            text={CORRECTIONS[i]!.shortBefore}
            flaw={CORRECTIONS[i]!.flaw}
            variant="before"
            delay={i * 0.15}
            inView={inView}
          />
        ))}

        <LiveFlowOrb />

        {AFTER_POINTS.map((p, i) => (
          <Cloud
            key={`${CORRECTIONS[i]!.id}-after`}
            point={p}
            text={CORRECTIONS[i]!.shortAfter}
            variant="after"
            delay={0.5 + i * 0.15}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
