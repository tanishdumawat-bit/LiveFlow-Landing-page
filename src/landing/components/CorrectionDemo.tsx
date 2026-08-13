import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { CORRECTION_STEPS } from '../data/demos';

export function CorrectionDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) {
      setStep(0);
      return;
    }
    if (reduce) {
      setStep(CORRECTION_STEPS.length - 1);
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
      CORRECTION_STEPS.forEach((_, i) => {
        if (i === 0) return;
        schedule(() => {
          if (!cancelled) setStep(i);
        }, i * 1400);
      });
      schedule(() => {
        if (!cancelled) run();
      }, CORRECTION_STEPS.length * 1400 + 2200);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const current = CORRECTION_STEPS[step] ?? CORRECTION_STEPS[0]!;

  return (
    <section id="corrections" className="bg-[#FFFFFF] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E] uppercase">
            Natural speech
          </p>
          <RevealHeadline
            as="h2"
            lines={['Speak naturally.', 'Change your mind naturally.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <p className="mt-4 text-base text-[#5C534C] sm:text-lg">
            Built for how people actually talk — corrections, second thoughts, and clean results.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="mb-6 flex justify-center gap-2">
            {CORRECTION_STEPS.map((s, i) => (
              <span
                key={s.label}
                className={`h-1.5 w-8 rounded-full transition ${
                  i <= step ? 'bg-[#C4501E]' : 'bg-[#E9DECB]'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.label + current.text}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[28px] border border-[#E9DECB] bg-[#FAF3E9] p-8 text-center shadow-[0_12px_40px_rgba(42,36,32,0.05)]"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-[#5C534C] uppercase">
                {current.label}
              </p>
              <p
                className={`mt-4 text-xl leading-relaxed sm:text-2xl ${
                  step === CORRECTION_STEPS.length - 1
                    ? 'font-medium text-[#2A2420]'
                    : 'text-[#2A2420]'
                }`}
              >
                {current.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
