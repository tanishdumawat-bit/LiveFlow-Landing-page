import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';
import { TextTransform } from '../animations/TextTransform';

const RAW = 'um hey can you send me the latest update';
const POLISHED = 'Could you send me the latest update?';

export function DictationDemo() {
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
      setStep(5);
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
      schedule(() => {
        if (!cancelled) setStep(1);
      }, 600);
      schedule(() => {
        if (!cancelled) setStep(2);
      }, 1600);
      schedule(() => {
        if (!cancelled) setStep(3);
      }, 2800);
      schedule(() => {
        if (!cancelled) setStep(4);
      }, 4000);
      schedule(() => {
        if (!cancelled) setStep(5);
      }, 5000);
      schedule(() => {
        if (!cancelled) run();
      }, 7800);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const phase =
    step < 1
      ? 'idle'
      : step < 3
        ? 'listening'
        : step < 4
          ? 'processing'
          : 'complete';

  return (
    <section className="bg-[#FFFFFF] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <div className="max-w-2xl">
          <RevealHeadline
            as="h2"
            lines={['Stop typing what you', 'already know how to say.']}
            className="text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-4 text-base text-[#5C534C] sm:text-lg"
          >
            Speak once. Live Flow polishes and inserts into the app you’re in.
          </motion.p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[#E9DECB] bg-[#FAF3E9] p-5"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={step >= 1 && step < 5 ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 1.2, repeat: step >= 1 && step < 5 ? Infinity : 0 }}
                className={`flex h-12 w-12 items-center justify-center rounded-full border bg-white ${
                  step >= 1 && step < 5
                    ? 'border-[#C4501E]/40 glow-record'
                    : 'border-[#E9DECB]'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    step >= 1 && step < 5 ? 'bg-[#C4501E]' : 'bg-[#4A7C6F]'
                  }`}
                />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-[#2A2420]">Dictation</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-[#5C534C]"
                  >
                    {step === 0 && 'Idle'}
                    {step === 1 && 'Listening'}
                    {step === 2 && 'Transcribing'}
                    {step === 3 && 'Understanding'}
                    {step >= 4 && 'Ready to insert'}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <VoiceFlow
              state={
                phase === 'idle'
                  ? 'idle'
                  : phase === 'listening'
                    ? 'listening'
                    : phase === 'processing'
                      ? 'processing'
                      : 'complete'
              }
              className="mt-4 h-10 w-full"
            />
            <div className="mt-4 min-h-[72px] rounded-xl border border-[#E9DECB] bg-white p-3">
              <AnimatePresence mode="wait">
                {step >= 2 && step < 4 && (
                  <motion.div
                    key="raw"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)' }}
                  >
                    <TextTransform
                      from={RAW}
                      to={POLISHED}
                      phase={step === 3 ? 'processing' : 'raw'}
                    />
                  </motion.div>
                )}
                {step >= 4 && (
                  <motion.div
                    key="out"
                    initial={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  >
                    <TextTransform from={RAW} to={POLISHED} phase="transformed" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            animate={
              reduce
                ? undefined
                : step >= 5
                  ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                  : { opacity: 0.85, scale: 0.985, filter: 'blur(0.5px)' }
            }
            className="relative overflow-hidden rounded-2xl border border-[#E9DECB] bg-[#FAF3E9]"
          >
            {/* Soft flow line from left demo → destination */}
            {!reduce && step >= 4 && step < 6 && (
              <motion.div
                className="pointer-events-none absolute top-1/2 -left-6 hidden h-px w-6 bg-[#C4501E]/50 lg:block"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                transition={{ duration: 0.9 }}
                style={{ originX: 0 }}
              />
            )}
            <div className="flex items-center gap-2 border-b border-[#E9DECB] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#611f69]" />
              <span className="text-sm text-[#2A2420]">Slack · #product</span>
            </div>
            <div className="space-y-3 p-4">
              <div className="max-w-[80%] rounded-xl bg-white px-3 py-2 text-sm text-[#5C534C]">
                Any update on testing?
              </div>
              <motion.div
                animate={
                  step >= 5
                    ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
                    : { opacity: 0.35, y: 10, filter: 'blur(2px)', scale: 0.98 }
                }
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                className="rounded-xl border border-[#E9DECB] bg-white px-3 py-3"
              >
                <p className="text-sm text-[#2A2420]">{step >= 5 ? POLISHED : 'Message…'}</p>
                <div className="mt-3 flex justify-end">
                  <motion.span
                    animate={step >= 5 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`rounded-md px-3 py-1 text-xs font-medium ${
                      step >= 5 ? 'bg-[#C4501E] text-white' : 'bg-[#F2E6D3] text-[#5C534C]'
                    }`}
                  >
                    Send
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
