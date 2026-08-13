import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';
import { DEV_CODE, DEV_LABELS, DEV_SPEECH } from '../data/demos';

/**
 * Developer mode storytelling.
 * Labeled as product vision / demo — not a guarantee of semantic codegen.
 */
export function DeveloperDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const [phase, setPhase] = useState<'speech' | 'code'>('speech');

  useEffect(() => {
    if (!inView) {
      setPhase('speech');
      return;
    }
    if (reduce) {
      setPhase('code');
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      if (cancelled) return;
      setPhase('speech');
      schedule(() => !cancelled && setPhase('code'), 2400);
      schedule(() => !cancelled && run(), 7000);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  return (
    <section id="developers" className="bg-[#FAF3E9] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E] uppercase">
              For builders
            </p>
            <RevealHeadline
              as="h2"
              lines={['Developers, stop typing', 'boilerplate.']}
              className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
            />
            <p className="mt-4 text-base text-[#5C534C] sm:text-lg">
              Speak the shape of the function. Live Flow drafts the structure into your editor.
            </p>
          </div>
          <span className="rounded-full border border-[#E9DECB] bg-white px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#5C534C]">
            Product vision · demo
          </span>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-[#E9DECB] bg-white p-5 sm:p-6">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5C534C] uppercase">
              You speak
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#2A2420]">{DEV_SPEECH}</p>
            <VoiceFlow
              state={phase === 'speech' ? 'listening' : 'complete'}
              className="mt-6 h-8 w-full"
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {DEV_LABELS.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#E9DECB] bg-[#FAF3E9] px-2.5 py-1 text-[11px] text-[#5C534C]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E9DECB] bg-[#1a1613] p-5 shadow-[0_16px_40px_rgba(42,36,32,0.12)] sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C4501E]/80" />
              <span className="text-xs text-[#E8D5C4]">Cursor · TypeScript</span>
            </div>
            <AnimatePresence mode="wait">
              {phase === 'speech' ? (
                <motion.p
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-sm text-[#E8D5C4]"
                >
                  Waiting for structure…
                </motion.p>
              ) : (
                <motion.pre
                  key="code"
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(6px)' }
                  }
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-x-auto font-mono text-[13px] leading-relaxed text-[#FAF3E9] sm:text-sm"
                >
                  {DEV_CODE}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
