import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

const KEYBOARD_WPM = 35;
/** Illustrative speaking pace range - marketed as up to ~3× vs typical typing. */
const FLOW_WPM = 190;
const CURVED_TEXT =
  "Would you like to set up the file? I can create a new one from scratch, or pull in something you're already working on…";

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function VoiceBars({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-5 items-end gap-[2.5px]" aria-hidden="true">
      {[0.35, 0.7, 0.45, 1, 0.55, 0.85, 0.4, 0.75, 0.5].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-white"
          animate={
            reduce || !active
              ? { height: 4 + h * 8, opacity: 0.55 }
              : { height: [4, 5 + h * 14, 5], opacity: [0.5, 1, 0.55] }
          }
          transition={{
            duration: 0.55 + (i % 4) * 0.07,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
}

function AnimatedWpm({
  value,
  inView,
  className,
}: {
  value: number;
  inView: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span className={className}>
      {n}
      <span className="ml-1 text-[0.45em] font-normal tracking-normal">wpm</span>
    </span>
  );
}

function MovingCurveText({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    if (reduce || !active || !pathRef.current) return;
    const controls = animate(0, 100, {
      duration: 28,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: (v) => {
        pathRef.current?.setAttribute('startOffset', `${-v}%`);
      },
    });
    return () => controls.stop();
  }, [active, reduce]);

  const loop = `${CURVED_TEXT}   ·   ${CURVED_TEXT}   ·   ${CURVED_TEXT}   ·   `;

  return (
    <svg
      className="mx-auto h-[120px] w-full max-w-lg overflow-visible"
      viewBox="0 0 520 130"
      aria-hidden="true"
    >
      <defs>
        <path id="flowTextCurve" d="M 10 105 Q 140 8, 260 42 T 510 18" fill="none" />
        <linearGradient id="curveFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ink)" stopOpacity="0" />
          <stop offset="10%" stopColor="var(--ink)" stopOpacity="1" />
          <stop offset="90%" stopColor="var(--ink)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text
        fill="url(#curveFade)"
        fontSize="14"
        fontWeight="500"
        fontFamily="Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.02em"
      >
        <textPath ref={pathRef} href="#flowTextCurve" startOffset="0%">
          {loop}
        </textPath>
      </text>
    </svg>
  );
}

export function MetricsSpeed() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });
  const live = useInView(sectionRef, { amount: 0.25 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 28 });
  const bgY = useTransform(smooth, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <section
      ref={sectionRef}
      id="speed"
      aria-label="Speed comparison"
      className="relative overflow-hidden bg-surface-alt px-4 py-24 sm:px-6 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 80% 0%, color-mix(in srgb, var(--gold) 20%, transparent), transparent 55%), radial-gradient(ellipse 40% 50% at 0% 80%, color-mix(in srgb, var(--violet) 12%, transparent), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          Your keyboard has a <em className="text-primary italic">speed limit.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.12, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Typing tops out around 35 WPM. Speaking lands closer to 180-200+. Relay is built so
          your words keep up - up to about 3× faster than a keyboard.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-4 sm:mt-16 md:grid-cols-[0.9fr_1.55fr] md:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.15, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[28px] border border-border bg-background p-7 text-left sm:min-h-[320px] sm:p-8"
          >
            <p className="text-sm font-medium text-muted">Keyboard</p>
            <AnimatedWpm
              value={KEYBOARD_WPM}
              inView={inView}
              className="mt-2 font-serif text-5xl tracking-tight text-ink sm:text-6xl"
            />

            <div className="relative mt-8 h-16 overflow-hidden">
              <motion.p
                className="absolute whitespace-nowrap text-sm leading-relaxed text-muted/70"
                animate={reduce || !live ? { x: 0 } : { x: ['0%', '-45%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                …or pull in something you&apos;re already working on from another project · would
                you like to set up the file? I can create a new one from scratch · or pull in
                something you&apos;re already working on…
              </motion.p>
            </div>

            <div className="mt-auto pt-10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted">
                <MicIcon />
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-[320px] flex-col overflow-hidden rounded-[28px] border border-border text-left shadow-card-lg sm:min-h-[360px]"
          >
            <motion.div
              className="absolute inset-0 scale-110 bg-cover bg-center"
              style={{
                y: bgY,
                backgroundImage: 'url(/assets/metrics-flow-bg.png)',
              }}
            />
            <div className="overlay-metrics absolute inset-0" />

            <div className="relative z-10 flex h-full flex-col p-7 sm:p-8">
              <p className="text-sm font-medium text-primary-dark">Relay</p>
              <div className="mt-2 flex items-baseline gap-2">
                <AnimatedWpm
                  value={FLOW_WPM}
                  inView={inView}
                  className="font-serif text-5xl tracking-tight text-ink sm:text-6xl lg:text-7xl"
                />
              </div>
              <p className="mt-1 text-xs text-primary-dark/80">Illustrative · ~180-200+ speaking pace</p>

              <div className="pointer-events-none relative mt-6 flex-1 drop-shadow-[0_1px_0_color-mix(in_srgb,var(--card)_90%,transparent)]">
                <MovingCurveText active={live} />
              </div>

              <div className="relative z-10 mt-auto flex justify-center pt-4">
                <div className="inline-flex items-center gap-3 rounded-full border border-primary-dark/25 bg-ink px-5 py-2.5 shadow-ink">
                  <VoiceBars active={live} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
