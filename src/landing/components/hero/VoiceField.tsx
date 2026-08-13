import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { type TokenKind } from '../../data/orbit';
import { WAVE_SCENES } from '../../data/wave';
import { mix } from '../../../theme/tokens';

type Speck = {
  id: number;
  text: string;
  written?: string | null;
  kind: TokenKind | 'punct';
  drops: boolean;
  angle: number;
  radius: number;
  speed: number;
  dir: number;
  z: number;
  rx: number;
  ry: number;
};

const SCENE = WAVE_SCENES[0]!;
const CLEAN = SCENE.clean;

function fragments() {
  const items: { text: string; written?: string | null; kind: TokenKind | 'punct'; drops: boolean }[] =
    [];
  for (const w of SCENE.words) {
    items.push({
      text: w.spoken,
      written: w.clean,
      kind: w.kind,
      drops: w.clean === null,
    });
    if (w.punct) {
      items.push({ text: w.punct, kind: 'punct', drops: false });
    }
  }
  return items;
}

function seed(): Speck[] {
  const base = fragments();
  const copies = 2;
  return Array.from({ length: copies }, () => base)
    .flat()
    .map((w, i) => {
      const ring = i % 3;
      return {
        id: i,
        text: w.text,
        written: w.written,
        kind: w.kind,
        drops: w.drops,
        angle: (i / (base.length * copies)) * Math.PI * 2 + ring * 0.28,
        radius: 26 + ring * 10 + (i % 4),
        speed: 0.1 + (i % 6) * 0.025,
        dir: i % 2 === 0 ? 1 : -1,
        z: ring * 36 - 40,
        rx: 1.18 - ring * 0.08,
        ry: 0.68 + ring * 0.04,
      };
    });
}

function kindColor(kind: TokenKind | 'punct') {
  if (kind === 'keep') return 'var(--ink)';
  if (kind === 'filler') return 'var(--primary)';
  if (kind === 'punct') return 'var(--gold)';
  return 'var(--violet)';
}

const BUCKETS = [
  { id: 'filler', label: 'Filler', color: 'var(--primary)', hint: 'um, wait, like' },
  { id: 'fix', label: 'Correction', color: 'var(--violet)', hint: 'gonna, the the' },
  { id: 'punct', label: 'Punctuation', color: 'var(--gold)', hint: '.  —' },
] as const;

type Pulse = 'orbit' | 'strike' | 'clean';

/**
 * Full-viewport first hit: a 3D disc of spoken fragments around a giant
 * headline. Mouse tilts the field. A shockwave periodically ejects fillers
 * and leaves a clean sentence in the core.
 */
export function VoiceField() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const specks = useRef(seed());
  const [tick, setTick] = useState(0);
  const [pulse, setPulse] = useState<Pulse>('orbit');
  const pulseRef = useRef<Pulse>('orbit');
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 80, damping: 18 });
  const ry = useSpring(mx, { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const el = root.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
      my.set(((e.clientY - r.top) / r.height - 0.5) * -10);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [mx, my, reduce]);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = 0;
    let lastPaint = 0;
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const p = pulseRef.current;
      specks.current.forEach((s) => {
        s.angle += s.speed * s.dir * dt * (p === 'strike' ? 1.8 : 1);
        if (p === 'strike' && s.drops) {
          s.radius += dt * 28;
        } else if (p === 'clean' && !s.drops) {
          s.radius += (36 - s.radius) * dt * 2.2;
        } else if (p === 'orbit') {
          const home = 26 + (s.id % 3) * 10 + (s.id % 4);
          s.radius += (home - s.radius) * dt * 1.6;
        }
      });
      if (now - lastPaint >= 32) {
        lastPaint = now;
        setTick((n) => n + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const ids: number[] = [];
    const later = (fn: () => void, ms: number) => {
      ids.push(window.setTimeout(fn, ms));
    };
    const run = () => {
      if (cancelled) return;
      pulseRef.current = 'orbit';
      setPulse('orbit');
      later(() => {
        if (cancelled) return;
        pulseRef.current = 'strike';
        setPulse('strike');
      }, 4200);
      later(() => {
        if (cancelled) return;
        pulseRef.current = 'clean';
        setPulse('clean');
      }, 5600);
      later(() => {
        if (cancelled) return;
        specks.current = seed();
        run();
      }, 8600);
    };
    run();
    return () => {
      cancelled = true;
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [reduce]);

  const items = useMemo(() => specks.current, [tick]);

  return (
    <div ref={root} className="relative min-h-[100svh] overflow-hidden pt-20">
      <div className="absolute inset-0 z-0" style={{ perspective: '1400px' }}>
        <motion.div
          className="absolute inset-0"
          style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: 'preserve-3d' }}
        >
          {[38, 52, 66, 80].map((size, i) => (
            <motion.div
              key={size}
              className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border"
              style={{
                width: `${size}vmin`,
                height: `${size * 0.72}vmin`,
                marginLeft: `${-size / 2}vmin`,
                marginTop: `${-(size * 0.72) / 2}vmin`,
                borderColor: mix(i % 2 ? 'var(--violet)' : 'var(--primary)', 22),
                transform: 'translateZ(-40px)',
              }}
              animate={reduce ? undefined : { rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 40 + i * 10, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {!reduce &&
            items.map((s) => {
              const x = 50 + Math.cos(s.angle) * s.radius * s.rx;
              const y = 48 + Math.sin(s.angle) * s.radius * s.ry;
              const dx = x - 50;
              const dy = (y - 48) / 0.72;
              if (Math.hypot(dx, dy) < 16) return null;
              const striking = pulse === 'strike' && s.drops;
              const label =
                (pulse === 'clean' || pulse === 'strike') && s.written ? s.written : s.text;
              return (
                <span
                  key={s.id}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) translateZ(${s.z}px)`,
                    color: kindColor(s.kind),
                    opacity: pulse === 'clean' && s.drops ? 0.08 : s.kind === 'keep' ? 0.78 : 0.95,
                    fontSize: s.kind === 'punct' ? '1.75rem' : s.drops ? '0.82rem' : '0.95rem',
                    fontFamily: s.kind === 'punct' ? 'var(--font-serif)' : 'var(--font-sans)',
                    fontWeight: 600,
                    textDecoration: striking ? 'line-through' : 'none',
                    textShadow:
                      s.kind === 'keep'
                        ? 'none'
                        : `0 0 22px ${mix(kindColor(s.kind), 45)}`,
                  }}
                >
                  {label}
                </span>
              );
            })}
        </motion.div>
      </div>

      {!reduce && (
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
          animate={{ scale: [0.25, 1.55], opacity: [0.45, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 5.8, ease: 'easeOut' }}
        />
      )}

      <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 px-4 text-center isolate">
        <div className="absolute top-1/2 left-1/2 h-64 w-[28rem] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 blur-2xl sm:h-80" />
        <div className="relative">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
            {pulse === 'strike' ? 'Cleaning up' : pulse === 'clean' ? 'Ready' : 'Live Flow · listening'}
          </p>
          <h1 className="text-[clamp(2.4rem,7.4vw,6rem)] leading-[1.12] font-semibold tracking-tight">
            <span className="block text-ink">Don’t type,</span>
            <span className="mt-1 block overflow-visible py-[0.12em] font-serif italic text-headline-gradient">
              just speak.
            </span>
          </h1>
          <motion.p
            className="mx-auto mt-6 max-w-xl px-2 font-serif text-[15px] leading-snug text-ink italic sm:text-xl"
            animate={{ opacity: pulse === 'clean' ? 1 : 0.22, y: pulse === 'clean' ? 0 : 8 }}
            transition={{ duration: 0.5 }}
          >
            {CLEAN}
          </motion.p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {BUCKETS.map((b) => {
              const on =
                pulse === 'strike' ||
                (b.id === 'punct' && pulse === 'clean') ||
                pulse === 'orbit';
              return (
                <li
                  key={b.id}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
                  style={{
                    color: b.color,
                    background: mix(b.color, 12),
                    boxShadow: `inset 0 0 0 1px ${mix(b.color, 28)}`,
                    opacity: on ? 1 : 0.45,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                  {b.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
