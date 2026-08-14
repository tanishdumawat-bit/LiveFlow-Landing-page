import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';
import {
  MEETING_INTEL_EXAMPLE,
  NOTE_EXTRACTION,
  NOTE_MEETING_LINES,
} from '../data/demos';

type Phase = 'meeting' | 'transcribing' | 'extracting' | 'done';

function CountUp({
  to,
  inView,
  suffix = '',
}: {
  to: number;
  inView: boolean;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    <span>
      {n}
      {suffix}
    </span>
  );
}

export function NoteTakerSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const intelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.25 });
  const intelInView = useInView(intelRef, { once: true, amount: 0.4 });
  const [phase, setPhase] = useState<Phase>('meeting');

  useEffect(() => {
    if (!inView) {
      setPhase('meeting');
      return;
    }
    if (reduce) {
      setPhase('done');
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      if (cancelled) return;
      setPhase('meeting');
      schedule(() => !cancelled && setPhase('transcribing'), 1800);
      schedule(() => !cancelled && setPhase('extracting'), 3400);
      schedule(() => !cancelled && setPhase('done'), 4800);
      schedule(() => !cancelled && run(), 9800);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const pipeline = [
    'Meeting',
    'Live transcription',
    'Summary',
    'Decisions',
    'Action items',
    'Follow-up',
  ];

  const activePipe =
    phase === 'meeting'
      ? 0
      : phase === 'transcribing'
        ? 1
        : phase === 'extracting'
          ? 3
          : 5;

  return (
    <section id="note-taker" className="relative overflow-hidden bg-surface-alt px-4 py-24 sm:px-6 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 10% 0%, color-mix(in srgb, var(--teal) 16%, transparent), transparent 55%), radial-gradient(ellipse 40% 40% at 100% 100%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl" ref={ref}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">
            Note Taker
          </p>
          <RevealHeadline
            as="h2"
            lines={['Stop taking notes.', 'Start having conversations.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
          />
          <p className="mt-4 text-base text-muted sm:text-lg">
            Keep your attention on the conversation. Live Flow captures what matters.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {pipeline.map((label, i) => (
            <span
              key={label}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                i <= activePipe
                  ? 'border-success/35 bg-success/12 text-ink'
                  : 'border-border bg-white/70 text-muted'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Meeting</p>
              <VoiceFlow
                state={phase === 'done' ? 'complete' : 'listening'}
                className="h-6 w-20"
                showParticles={false}
              />
            </div>
            <div className="space-y-3">
              {NOTE_MEETING_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0.4 }}
                  animate={{
                    opacity: phase === 'extracting' || phase === 'done' ? 0.45 : 1,
                    y: phase === 'extracting' && !reduce ? -4 * i : 0,
                  }}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-ink"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            <p className="text-sm font-medium text-ink">What matters</p>
            <AnimatePresence mode="wait">
              {phase !== 'done' ? (
                <motion.p
                  key="wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-sm text-muted"
                >
                  {phase === 'meeting' && 'Listening to the room…'}
                  {phase === 'transcribing' && 'Capturing the conversation…'}
                  {phase === 'extracting' && 'Pulling decisions and owners…'}
                </motion.p>
              ) : (
                <motion.div
                  key="out"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                      Decision
                    </p>
                    <p className="mt-1 text-sm text-ink">{NOTE_EXTRACTION.decision}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                      Action items
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-ink">
                      {NOTE_EXTRACTION.actions.map((a) => (
                        <li key={a.owner}>
                          <span className="font-medium">{a.owner}</span>
                          <span className="text-muted"> → {a.task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                      Next step
                    </p>
                    <p className="mt-1 text-sm text-ink">{NOTE_EXTRACTION.next}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                      Follow-up
                    </p>
                    <p className="mt-1 text-sm text-ink">{NOTE_EXTRACTION.followUp}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Meeting intelligence - illustrative example numbers */}
        <div ref={intelRef} className="mt-20">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Meetings go in.
              <br />
              <span className="font-serif italic text-teal">Momentum comes out.</span>
            </h3>
            <p className="mt-3 text-sm text-muted">
              Example meeting view - illustrative numbers, not measured product metrics.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Meeting',
                value: (
                  <CountUp to={MEETING_INTEL_EXAMPLE.durationMin} inView={intelInView} suffix=" min" />
                ),
              },
              {
                label: 'Transcript lines',
                value: (
                  <CountUp to={MEETING_INTEL_EXAMPLE.transcriptLines} inView={intelInView} />
                ),
              },
              {
                label: 'Decisions',
                value: <CountUp to={MEETING_INTEL_EXAMPLE.decisions} inView={intelInView} />,
              },
              {
                label: 'Action items',
                value: <CountUp to={MEETING_INTEL_EXAMPLE.actionItems} inView={intelInView} />,
              },
              {
                label: 'Open questions',
                value: <CountUp to={MEETING_INTEL_EXAMPLE.openQuestions} inView={intelInView} />,
              },
              {
                label: 'Follow-up email',
                value: <CountUp to={MEETING_INTEL_EXAMPLE.followUps} inView={intelInView} />,
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="rounded-2xl border border-border bg-white px-5 py-4"
              >
                <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                  {card.label}
                </p>
                <p className="mt-2 font-serif text-3xl tracking-tight text-ink">
                  {card.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
