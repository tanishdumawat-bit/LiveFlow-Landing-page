import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import {
  KIND_META,
  ORBIT_SCENES,
  type OrbitScene,
  type OrbitToken,
  type TokenKind,
} from '../../data/orbit';
import { mix, theme } from '../../../theme/tokens';

export type OrbitPhase = 'inflow' | 'orbit' | 'identify' | 'eject' | 'settle' | 'hold';

const PHASE_MS: Record<OrbitPhase, number> = {
  inflow: 1300,
  orbit: 1500,
  identify: 2000,
  eject: 1300,
  settle: 1400,
  hold: 2200,
};

const PHASE_ORDER: OrbitPhase[] = ['inflow', 'orbit', 'identify', 'eject', 'settle', 'hold'];

const EASE = [0.16, 1, 0.3, 1] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function radiusFor(phase: OrbitPhase, kind: TokenKind, p: number, reduce: boolean) {
  if (reduce) return kind === 'keep' && (phase === 'settle' || phase === 'hold') ? 0 : 38;
  const orbit = 38;
  if (phase === 'inflow') return lerp(58, orbit, easeOutCubic(p));
  if (phase === 'eject' && kind !== 'keep') return lerp(orbit, 64, easeOutCubic(p));
  if (phase === 'settle' && kind === 'keep') return lerp(orbit, 0, easeOutCubic(p));
  if (phase === 'settle' && kind !== 'keep') return 64;
  if (phase === 'hold' && kind === 'keep') return 0;
  if (phase === 'hold' && kind !== 'keep') return 64;
  return orbit;
}

function opacityFor(phase: OrbitPhase, kind: TokenKind, p: number) {
  if (phase === 'inflow') return lerp(0, 1, Math.min(1, p * 1.4));
  if (phase === 'eject' && kind !== 'keep') return lerp(1, 0, p);
  if (phase === 'settle' && kind !== 'keep') return 0;
  if (phase === 'settle' && kind === 'keep') return lerp(1, 0, p);
  if (phase === 'hold' && kind !== 'keep') return 0;
  if (phase === 'hold' && kind === 'keep') return 0;
  return 1;
}

function RingText({
  text,
  r,
  duration,
  reverse,
  fill,
  size = 12,
  active,
}: {
  text: string;
  r: number;
  duration: number;
  reverse?: boolean;
  fill: string;
  size?: number;
  active: boolean;
}) {
  const rawId = useId();
  const id = `orbit-ring-${rawId.replace(/:/g, '')}`;
  const pathRef = useRef<SVGTextPathElement>(null);
  const cx = 280;
  const cy = 280;
  const d = `M ${cx - r},${cy} a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`;
  const loop = `${text}   ·   ${text}   ·   ${text}   ·   `;

  useEffect(() => {
    if (!active || !pathRef.current) return;
    const controls = animate(0, 100, {
      duration,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: (v) => {
        const offset = reverse ? 100 - v : v;
        pathRef.current?.setAttribute('startOffset', `${-offset}%`);
      },
    });
    return () => controls.stop();
  }, [active, duration, reverse]);

  return (
    <>
      <path id={id} d={d} fill="none" />
      <text
        fill={fill}
        fontSize={size}
        fontFamily="Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
        fontWeight="500"
        letterSpacing="0.04em"
      >
        <textPath ref={pathRef} href={`#${id}`} startOffset="0%">
          {loop}
        </textPath>
      </text>
    </>
  );
}

function WordChip({
  token,
  index,
  total,
  phase,
  rotation,
  progress,
  reduce,
}: {
  token: OrbitToken;
  index: number;
  total: number;
  phase: OrbitPhase;
  rotation: number;
  progress: number;
  reduce: boolean;
}) {
  const meta = KIND_META[token.kind];
  const base = (index / total) * Math.PI * 2 - Math.PI / 2;
  const angle = base + rotation;
  const r = radiusFor(phase, token.kind, progress, reduce);
  const opacity = opacityFor(phase, token.kind, progress);
  const tagged = phase === 'identify' && token.kind !== 'keep';
  const correcting = tagged || (phase === 'eject' && token.kind === 'correction');
  const label =
    phase === 'identify' && token.kind !== 'keep'
      ? KIND_META[token.kind].label
      : phase === 'eject' && token.replacement
        ? token.replacement
        : token.text;

  const x = 50 + Math.cos(angle) * r;
  const y = 50 + Math.sin(angle) * r;

  return (
    <motion.div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, opacity }}
      initial={false}
      animate={{
        scale: tagged ? 1.08 : phase === 'eject' && token.kind !== 'keep' ? 0.72 : 1,
      }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="flex flex-col items-center gap-1">
        {token.kind !== 'keep' && (phase === 'identify' || phase === 'eject') && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: phase === 'identify' ? 1 : 0, y: 0 }}
            className="rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase"
            style={{
              color: meta.color,
              background: mix(meta.soft, 92),
              boxShadow: `0 0 0 1px ${mix(meta.color, 28)}`,
            }}
          >
            {KIND_META[token.kind].label.replace(' identified', '')}
          </motion.span>
        )}
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap sm:text-[12px]"
          style={{
            color: correcting ? meta.color : theme.ink,
            background: correcting ? mix(meta.soft, 88) : mix(theme.card, 92),
            border: `1px solid ${correcting ? mix(meta.color, 35) : mix(theme.border, 80)}`,
            textDecoration: token.kind !== 'keep' && phase === 'identify' ? 'line-through' : 'none',
            boxShadow: correcting
              ? `0 8px 24px ${mix(meta.color, 18)}`
              : `0 8px 20px ${mix(theme.ink, 6)}`,
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function CenterStage({
  scene,
  phase,
  reduce,
}: {
  scene: OrbitScene;
  phase: OrbitPhase;
  reduce: boolean;
}) {
  const live = phase === 'inflow' || phase === 'orbit';
  const cleaning = phase === 'identify' || phase === 'eject';
  const done = phase === 'settle' || phase === 'hold';

  return (
    <div className="absolute top-1/2 left-1/2 z-10 w-[min(78%,280px)] -translate-x-1/2 -translate-y-1/2 text-center sm:w-[320px]">
      <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center">
        {!reduce && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: `1px solid ${mix(theme.primary, 45)}` }}
              animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-[-8px] rounded-full"
              style={{ border: `1px solid ${mix(theme.violet, 35)}` }}
              animate={{ scale: [1, 1.4], opacity: [0.35, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />
          </>
        )}
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-cta-lg"
          style={{ background: theme.micOrb }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" />
            <path
              d="M5 11a7 7 0 0 0 14 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
        {live ? 'Listening' : cleaning ? 'Cleaning up' : 'Ready to send'}
      </p>

      <div className="mt-3 min-h-[4.5rem]">
        {done ? (
          <motion.p
            key={scene.clean}
            initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="font-serif text-[17px] leading-snug text-ink italic sm:text-[19px]"
          >
            {scene.clean}
          </motion.p>
        ) : (
          <p className="text-[12px] leading-relaxed text-muted/80 italic sm:text-[13px]">
            {cleaning ? 'Fillers, corrections, repetitions - all of it.' : 'Speak the way you think.'}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Flagship WhisperFlow-inspired stage: circular text rings + word chips
 * that fly in, get tagged (filler / correction / repetition), fly out,
 * and settle as a polished sentence in the center.
 */
export function CircularCorrection() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<OrbitPhase>('inflow');
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef<OrbitPhase>('inflow');
  const phaseStart = useRef(0);
  const scene = ORBIT_SCENES[sceneIndex]!;

  const tags = useMemo(() => {
    const kinds = new Set(scene.tokens.map((t) => t.kind).filter((k) => k !== 'keep'));
    return Array.from(kinds) as Exclude<TokenKind, 'keep'>[];
  }, [scene]);

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    let lastPaint = 0;
    phaseStart.current = 0;
    const tick = (now: number) => {
      if (!phaseStart.current) phaseStart.current = now;
      const current = phaseRef.current;
      const elapsed = now - phaseStart.current;
      const budget = PHASE_MS[current];
      const p = Math.min(1, elapsed / budget);
      if (now - lastPaint >= 32) {
        lastPaint = now;
        setRotation(now * 0.00022);
        setProgress(p);
      }
      if (elapsed >= budget) {
        const i = PHASE_ORDER.indexOf(current);
        const next =
          i === PHASE_ORDER.length - 1
            ? 'inflow'
            : PHASE_ORDER[i + 1]!;
        if (i === PHASE_ORDER.length - 1) {
          setSceneIndex((s) => (s + 1) % ORBIT_SCENES.length);
        }
        phaseRef.current = next;
        setPhase(next);
        phaseStart.current = now;
        setProgress(0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  useEffect(() => {
    if (reduce) setPhase('hold');
  }, [reduce]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[640px]">
      <div className="relative aspect-square w-full overflow-visible">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 560 560"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="orbitFade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={theme.primary} stopOpacity="0.55" />
              <stop offset="50%" stopColor={theme.violet} stopOpacity="0.4" />
              <stop offset="100%" stopColor={theme.gold} stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {[210, 168, 126].map((r, i) => (
            <motion.circle
              key={r}
              cx="280"
              cy="280"
              r={r}
              fill="none"
              stroke="url(#orbitFade)"
              strokeWidth={i === 1 ? 1.2 : 0.7}
              strokeDasharray={i === 0 ? '3 10' : i === 1 ? '1 8' : '2 14'}
              opacity={0.55}
              animate={
                reduce
                  ? undefined
                  : { rotate: i % 2 === 0 ? 360 : -360 }
              }
              transition={{ duration: 28 + i * 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '280px 280px' }}
            />
          ))}

          <g opacity={phase === 'settle' || phase === 'hold' ? 0.22 : 0.55}>
            <RingText
              text={scene.rawLine}
              r={232}
              duration={32}
              fill={mix(theme.ink, 45)}
              active={inView && !reduce}
            />
          </g>
          <g opacity={phase === 'settle' || phase === 'hold' ? 0.85 : 0.2}>
            <RingText
              text={scene.clean}
              r={148}
              duration={26}
              reverse
              fill={theme.violet}
              size={13}
              active={inView && !reduce}
            />
          </g>
        </svg>

        {scene.tokens.map((token, i) => (
          <WordChip
            key={`${scene.id}-${token.id}`}
            token={token}
            index={i}
            total={scene.tokens.length}
            phase={reduce ? 'orbit' : phase}
            rotation={reduce ? i * 0.05 : rotation}
            progress={reduce ? 1 : progress}
            reduce={reduce}
          />
        ))}

        <CenterStage scene={scene} phase={reduce ? 'hold' : phase} reduce={reduce} />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {tags.map((kind) => (
          <span
            key={kind}
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
            style={{
              color: KIND_META[kind].color,
              background: mix(KIND_META[kind].soft, 90),
              opacity: phase === 'identify' || phase === 'eject' ? 1 : 0.45,
            }}
          >
            {KIND_META[kind].label}
          </span>
        ))}
      </div>
    </div>
  );
}
