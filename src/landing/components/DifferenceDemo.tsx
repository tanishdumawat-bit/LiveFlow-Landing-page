import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { VoiceFlow } from '../animations/VoiceFlow';
import {
  DIFF_AI_CLEAN,
  DIFF_APPS,
  DIFF_TRADITIONAL,
  DIFF_YOU_SPEAK,
  getDiffApp,
  type DiffAppId,
} from '../data/difference';
import { theme } from '../../theme/tokens';

/**
 * Compact differentiation: Transcribe → Improve → Understand + adapt.
 */
export function DifferenceDemo() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.28 });

  const [appId, setAppId] = useState<DiffAppId>('gmail');
  const [step, setStep] = useState(0); // 0 speak, 1 trad, 2 ai, 3 live
  const app = getDiffApp(appId);

  useEffect(() => {
    if (!inView) {
      setStep(0);
      return;
    }
    if (reduce) {
      setStep(3);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const run = () => {
      if (cancelled) return;
      setStep(0);
      schedule(() => !cancelled && setStep(1), 900);
      schedule(() => !cancelled && setStep(2), 2800);
      schedule(() => !cancelled && setStep(3), 4600);
      schedule(() => !cancelled && run(), 11000);
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  return (
    <section id="difference" ref={sectionRef} className="bg-background px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            The difference
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Same speech.
            <br />
            <span className="font-serif italic text-primary">Different result.</span>
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Transcribe. Improve. Or understand — and put it where it belongs.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-2 text-xs font-medium">
          {[
            { label: 'Traditional', verb: 'Transcribe', on: step === 1 },
            { label: 'AI dictation', verb: 'Improve', on: step === 2 },
            { label: 'Live Flow', verb: 'Understand', on: step >= 3 },
          ].map((item) => (
            <span
              key={item.label}
              className={`rounded-full border px-3 py-1.5 transition ${
                item.on
                  ? 'border-primary/35 bg-primary/10 text-primary'
                  : 'border-border bg-surface-alt text-muted'
              }`}
            >
              {item.label}: {item.verb}
            </span>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-border bg-surface-alt p-5 shadow-card sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              You speak
            </p>
            <VoiceFlow
              state={step === 0 ? 'listening' : step < 3 ? 'transcribing' : 'complete'}
              className="h-6 w-24"
              showParticles={false}
            />
          </div>
          <p className="mt-3 text-base font-medium leading-relaxed text-ink sm:text-lg">
            “{DIFF_YOU_SPEAK}”
          </p>

          <div className="mt-6 min-h-[200px]">
            <AnimatePresence mode="wait">
              {step <= 1 && (
                <motion.div
                  key="trad"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-2xl border border-border bg-white p-4"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                    Traditional · Transcribe
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    {DIFF_TRADITIONAL.split(/(um|I think)/g).map((part, i) =>
                      /^(um|I think)$/i.test(part) ? (
                        <span key={i} className="rounded-sm bg-primary/10 text-primary-dark">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-2xl border border-success/25 bg-white p-4"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-success uppercase">
                    AI dictation · Improve
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{DIFF_AI_CLEAN}</p>
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div
                  key="live"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {DIFF_APPS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAppId(a.id)}
                        className="rounded-full border px-3 py-1.5 text-xs font-medium"
                        style={{
                          borderColor: a.id === appId ? `${a.accent}66` : theme.border,
                          background: a.id === appId ? `${a.accent}12` : theme.card,
                        }}
                      >
                        <span
                          className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: a.accent }}
                        />
                        {a.name}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={app.id}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0 }}
                      className="overflow-hidden rounded-2xl border bg-white"
                      style={{ borderColor: `${app.accent}44` }}
                    >
                      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: app.accent }} />
                        <span className="text-xs font-semibold text-ink">{app.name}</span>
                        <span className="text-[11px] text-muted">→ {app.format}</span>
                      </div>
                      <pre className="whitespace-pre-wrap bg-surface-alt px-4 py-4 font-sans text-[13px] leading-relaxed text-ink">
                        {app.output}
                      </pre>
                      <p className="border-t border-border px-4 py-2 text-[11px] text-muted">
                        {app.contextLine}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Traditional writes what you said. AI can clean it up.{' '}
          <span className="font-medium text-ink">
            Live Flow understands — and adapts to the app.
          </span>
        </p>
      </div>
    </section>
  );
}
