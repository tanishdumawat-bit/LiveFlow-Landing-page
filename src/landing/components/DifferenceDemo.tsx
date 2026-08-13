import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { TextTransform } from '../animations/TextTransform';
import { VoiceFlow } from '../animations/VoiceFlow';
import { DIFFERENCE_POLISHED, DIFFERENCE_RAW } from '../data/demos';

const TAGS = [
  { id: 'filler', label: 'Fillers removed' },
  { id: 'clarity', label: 'Clarity' },
  { id: 'tone', label: 'Tone' },
  { id: 'context', label: 'Context' },
] as const;

/**
 * The big difference: normal dictation vs Live Flow polish.
 * Claims only filler/clarity polish — not deep intent understanding.
 */
export function DifferenceDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const [phase, setPhase] = useState<'idle' | 'raw' | 'processing' | 'done'>('idle');

  useEffect(() => {
    if (!inView) {
      setPhase('idle');
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
      setPhase('idle');
      schedule(() => !cancelled && setPhase('raw'), 500);
      schedule(() => !cancelled && setPhase('processing'), 2200);
      schedule(() => !cancelled && setPhase('done'), 3800);
      schedule(() => !cancelled && run(), 7200);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const transformPhase =
    phase === 'done' ? 'transformed' : phase === 'processing' ? 'processing' : 'raw';

  return (
    <section id="difference" className="bg-[#FFFFFF] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E] uppercase">
            The difference
          </p>
          <RevealHeadline
            as="h2"
            lines={['Your keyboard hears words.', 'Live Flow understands what you meant.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <p className="mt-4 max-w-xl text-base text-[#5C534C] sm:text-lg">
            Same speech. Clearer writing — fillers cleaned up, grammar tightened, tone ready to send.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#E9DECB] bg-[#FAF3E9] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#5C534C]">You speak</p>
              <VoiceFlow
                state={phase === 'idle' ? 'idle' : phase === 'done' ? 'complete' : 'listening'}
                className="h-6 w-24"
                showParticles={false}
              />
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[#2A2420]">{DIFFERENCE_RAW}</p>
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-[#E9DECB] bg-[#F2E6D3]/60 p-5 sm:p-6"
            >
              <p className="text-sm font-medium text-[#5C534C]">Normal dictation</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5C534C]/90">{DIFFERENCE_RAW}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="rounded-2xl border border-[#C4501E]/25 bg-white p-5 shadow-[0_12px_36px_rgba(42,36,32,0.06)] sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#C4501E]">Live Flow</p>
                <AnimatePresence>
                  {phase === 'done' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[11px] font-medium tracking-wide text-[#4A7C6F]"
                    >
                      Ready to send
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-3 min-h-[88px]">
                {(phase === 'raw' || phase === 'processing' || phase === 'done') && (
                  <TextTransform
                    from={DIFFERENCE_RAW}
                    to={DIFFERENCE_POLISHED}
                    phase={transformPhase}
                  />
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {TAGS.map((tag, i) => (
                  <motion.span
                    key={tag.id}
                    initial={{ opacity: 0.35 }}
                    animate={{
                      opacity: phase === 'done' || (phase === 'processing' && i < 2) ? 1 : 0.4,
                      backgroundColor:
                        phase === 'done' ? 'rgba(74,124,111,0.12)' : 'rgba(242,230,211,0.9)',
                    }}
                    className="rounded-full border border-[#E9DECB] px-2.5 py-1 text-[11px] font-medium text-[#2A2420]"
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
