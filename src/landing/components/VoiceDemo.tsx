import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TextTransform } from '../animations/TextTransform';
import { VoiceFlow } from '../animations/VoiceFlow';

const FROM =
  "I think maybe we should probably move this to next week because we don't have enough testing";
const TO = 'I suggest we move this to next week to allow enough time for testing.';

export function VoiceDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'raw' | 'processing' | 'transformed'>('raw');

  useEffect(() => {
    if (reduce) {
      setPhase('transformed');
      return;
    }
    let cancelled = false;
    const cycle = () => {
      if (cancelled) return;
      setPhase('raw');
      window.setTimeout(() => {
        if (!cancelled) setPhase('processing');
      }, 1600);
      window.setTimeout(() => {
        if (!cancelled) setPhase('transformed');
      }, 3000);
    };
    cycle();
    const loop = window.setInterval(cycle, 7000);
    return () => {
      cancelled = true;
      clearInterval(loop);
    };
  }, [reduce]);

  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0d0d0f] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#9b87ff] uppercase">
              Voice → Understanding → Action
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Watch speech become intention</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[#8a8a93]"
            >
              {phase === 'raw' && 'Raw speech'}
              {phase === 'processing' && 'Understanding…'}
              {phase === 'transformed' && 'Polished'}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="mt-5">
          <VoiceFlow
            state={phase === 'processing' ? 'processing' : phase === 'raw' ? 'transcribing' : 'complete'}
            className="h-10 w-full"
          />
        </div>

        <div className="mt-6 min-h-[88px]">
          <TextTransform from={FROM} to={TO} phase={phase} className="text-base sm:text-lg" />
        </div>
      </div>
    </section>
  );
}
