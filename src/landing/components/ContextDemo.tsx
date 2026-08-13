import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';
import { CONTEXT_APPS, CONTEXT_SPEECH } from '../data/demos';

/**
 * Same voice → different destination outputs.
 * Illustrates context-aware formatting, not magic intent APIs.
 */
export function ContextDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.28 });
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(true);
  const current = CONTEXT_APPS[index] ?? CONTEXT_APPS[0]!;

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      setRevealed(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % CONTEXT_APPS.length);
        setRevealed(true);
      }, 280);
    }, 4800);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const select = (i: number) => {
    if (i === index) return;
    setRevealed(false);
    window.setTimeout(
      () => {
        setIndex(i);
        setRevealed(true);
      },
      reduce ? 0 : 220,
    );
  };

  return (
    <section id="context" className="bg-[#FAF3E9] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E] uppercase">
            Context
          </p>
          <RevealHeadline
            as="h2"
            lines={['Same voice.', 'Different context.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <p className="mt-4 text-base text-[#5C534C] sm:text-lg">
            One spoken thought. Live Flow shapes it for where it’s going.
          </p>
        </div>

        <div className="mt-10 rounded-[28px] border border-[#E9DECB] bg-[#FFFFFF] p-5 shadow-[0_16px_48px_rgba(42,36,32,0.05)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="flex flex-1 flex-col rounded-2xl border border-[#E9DECB] bg-[#F2E6D3]/55 p-5">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5C534C] uppercase">
                You say
              </p>
              <p className="mt-3 text-lg leading-relaxed text-[#2A2420] sm:text-xl">
                “{CONTEXT_SPEECH}”
              </p>
              <div className="mt-auto pt-6">
                <VoiceFlow
                  state={revealed ? 'idle' : 'processing'}
                  className="h-8 w-full max-w-xs"
                />
              </div>
            </div>

            <div className="hidden items-center px-2 lg:flex" aria-hidden="true">
              <motion.div
                animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="h-px w-10 bg-[#C4501E]/50"
              />
            </div>

            <div className="flex-[1.15]">
              <div
                className="mb-4 flex flex-wrap gap-2"
                role="tablist"
                aria-label="Destination apps"
              >
                {CONTEXT_APPS.map((app, i) => (
                  <button
                    key={app.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    onClick={() => select(i)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      i === index
                        ? 'border-[#C4501E]/35 bg-[#C4501E]/10 text-[#2A2420]'
                        : 'border-[#E9DECB] bg-[#FAF3E9] text-[#5C534C] hover:border-[#D3B49B]'
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: app.accent }}
                      aria-hidden="true"
                    />
                    {app.name}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                  animate={
                    revealed
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0.4, y: 4, filter: 'blur(2px)' }
                  }
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-[200px] rounded-2xl border border-[#E9DECB] bg-[#FAF3E9] p-5"
                  role="tabpanel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: current.accent }}
                    />
                    <p className="text-sm font-medium text-[#2A2420]">{current.name}</p>
                    <span className="text-xs text-[#5C534C]">· {current.label}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-[#2A2420]">
                    {current.output}
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
