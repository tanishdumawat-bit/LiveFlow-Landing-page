import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { VoiceFlow } from '../../animations/VoiceFlow';
import {
  CONTEXT_FLOW_SPEECH,
  FLOW_DESTINATIONS,
  FLOW_PHASES,
  getDestination,
  type FlowDestinationId,
  type FlowPhase,
} from '../../data/contextFlow';
import { AppWindow } from './AppWindow';
import { FlowProgress } from './FlowProgress';
import { theme } from '../../../theme/tokens';
import { AppIconBadge } from '../shared/AppIcon';

const PHASE_ORDER: FlowPhase[] = ['speak', 'understand', 'transform', 'deliver'];

/**
 * Simple Context Flow: same voice → pick an app → see the right output.
 * Fast timed loop + instant app switching.
 */
export function ContextFlowExperience() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.3 });

  const [phase, setPhase] = useState<FlowPhase>('speak');
  const [destinationId, setDestinationId] = useState<FlowDestinationId>('gmail');
  const destination = getDestination(destinationId);

  // Quick auto progression when in view
  useEffect(() => {
    if (!inView) {
      setPhase('speak');
      return;
    }
    if (reduce) {
      setPhase('deliver');
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      if (cancelled) return;
      setPhase('speak');
      schedule(() => !cancelled && setPhase('understand'), 700);
      schedule(() => !cancelled && setPhase('transform'), 1600);
      schedule(() => !cancelled && setPhase('deliver'), 2400);
      schedule(() => !cancelled && run(), 7500);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const selectApp = (id: FlowDestinationId) => {
    setDestinationId(id);
    // Jump to result quickly - intuitive feedback
    setPhase('transform');
    window.setTimeout(() => setPhase('deliver'), reduce ? 0 : 350);
  };

  const phaseMeta = FLOW_PHASES.find((p) => p.id === phase) ?? FLOW_PHASES[0]!;
  const showResult = phase === 'transform' || phase === 'deliver';

  return (
    <section
      id="context"
      ref={sectionRef}
      aria-labelledby="context-flow-heading"
      className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 90% 10%, color-mix(in srgb, var(--sky) 16%, transparent), transparent 55%), radial-gradient(ellipse 40% 40% at 0% 90%, color-mix(in srgb, var(--violet) 12%, transparent), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-sky uppercase">
            Context
          </p>
          <h2
            id="context-flow-heading"
            className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            One thought.
            <br />
            <span className="font-serif italic text-violet">The right words.</span>
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Same voice. Different apps. Relay shapes the output for where you are.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <FlowProgress phase={phase} reduce={reduce} />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: voice + steps */}
          <div className="rounded-[28px] border border-border bg-surface-alt p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
                style={{
                  background: theme.micOrb,
                }}
                animate={
                  reduce || phase !== 'speak'
                    ? undefined
                    : { scale: [1, 1.05, 1] }
                }
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
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
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-ink">Relay</p>
                <p className="text-xs text-muted">
                  {phase === 'speak' && 'Listening…'}
                  {phase === 'understand' && 'Reading context…'}
                  {phase === 'transform' && 'Shaping output…'}
                  {phase === 'deliver' && 'Delivered'}
                </p>
              </div>
              <VoiceFlow
                state={
                  phase === 'speak'
                    ? 'listening'
                    : phase === 'understand'
                      ? 'processing'
                      : phase === 'deliver'
                        ? 'complete'
                        : 'transcribing'
                }
                className="ml-auto h-7 w-20"
                showParticles={false}
              />
            </div>

            <p className="mt-5 text-base font-medium leading-relaxed text-ink">
              “{CONTEXT_FLOW_SPEECH}”
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PHASE_ORDER.map((id) => {
                const meta = FLOW_PHASES.find((p) => p.id === id)!;
                const on = PHASE_ORDER.indexOf(id) <= PHASE_ORDER.indexOf(phase);
                return (
                  <div
                    key={id}
                    className={`rounded-xl border px-2.5 py-2 text-center ${
                      on
                        ? 'border-primary/30 bg-primary/8'
                        : 'border-border bg-white'
                    }`}
                  >
                    <p className="text-[10px] font-semibold tracking-wide text-muted">
                      {meta.n}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${
                        on ? 'text-primary' : 'text-muted'
                      }`}
                    >
                      {meta.title}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-sm text-muted">{phaseMeta.body}</p>
          </div>

          {/* Right: apps + result */}
          <div className="rounded-[28px] border border-border bg-white p-5 shadow-card sm:p-6">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Choose where it goes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FLOW_DESTINATIONS.map((d) => {
                const on = d.id === destinationId;
                return (
                  <motion.button
                    key={d.id}
                    type="button"
                    onClick={() => selectApp(d.id)}
                    whileHover={reduce ? undefined : { y: -1, scale: 1.02 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition"
                    style={{
                      borderColor: on ? `${d.accent}66` : theme.border,
                      background: on ? `${d.accent}12` : theme.surfaceAlt,
                      color: theme.ink,
                      boxShadow: on ? `0 6px 16px ${d.accent}22` : 'none',
                    }}
                  >
                    <AppIconBadge name={d.name} accent={d.accent} size="xs" className={on ? '' : 'opacity-75'} />
                    {d.name}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 min-h-[200px]">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt text-sm text-muted"
                  >
                    {phase === 'speak' ? 'Hearing your thought…' : 'Understanding context…'}
                  </motion.div>
                ) : (
                  <motion.div
                    key={destinationId + phase}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                  >
                    <AppWindow
                      destination={destination}
                      phase={phase === 'deliver' ? 'delivered' : 'building'}
                      reduce={reduce}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Same speech · <span className="font-medium text-ink">{destination.name}</span> ·{' '}
              {destination.tone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
