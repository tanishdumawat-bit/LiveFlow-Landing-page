import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TextTransform } from '../animations/TextTransform';
import { VoiceFlow } from '../animations/VoiceFlow';

const demos = [
  {
    app: 'Slack',
    accent: '#611f69',
    speech: 'hey Alex just wanted to give you an update',
    output: 'Hey Alex, just wanted to give you a quick update.',
  },
  {
    app: 'Gmail',
    accent: '#ea4335',
    speech: 'hey Alex just wanted to give you an update',
    output: 'Hi Alex,\n\nJust wanted to give you a quick update.',
  },
  {
    app: 'Cursor',
    accent: '#7c5cff',
    speech: 'hey Alex just wanted to give you an update',
    output: 'Create a function that sends a status update to Alex.',
  },
];

export function AppContextSection() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'processing' | 'transformed'>('transformed');
  const current = demos[index] ?? demos[0];

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setPhase('processing');
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % demos.length);
        setPhase('transformed');
      }, 700);
    }, 4200);
    return () => clearInterval(id);
  }, [reduce]);

  const select = (i: number) => {
    setIndex(i);
    if (reduce) {
      setPhase('transformed');
      return;
    }
    setPhase('processing');
    window.setTimeout(() => setPhase('transformed'), 900);
  };

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f]">
        <div className="border-b border-white/8 px-5 py-4 sm:px-7">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#9b87ff] uppercase">
            Same voice · Different context · Different output
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">App-aware intelligence</h2>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-white/8 p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <p className="text-xs text-[#8a8a93]">You speak</p>
            <p className="mt-3 text-base leading-relaxed text-[#d4d4dc]">{current.speech}</p>
            <VoiceFlow state={phase === 'processing' ? 'processing' : 'idle'} className="mt-5 h-8 w-full max-w-sm" />
          </div>

          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.app}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121214] px-3 py-1 text-xs text-white">
                  <span className="h-2 w-2 rounded-full" style={{ background: current.accent }} />
                  Active app: {current.app}
                </div>
                <div className="rounded-xl border border-white/8 bg-[#121214] p-4">
                  <TextTransform from={current.speech} to={current.output} phase={phase} />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex gap-2">
              {demos.map((d, i) => (
                <button
                  key={d.app}
                  type="button"
                  aria-label={`Show ${d.app} output`}
                  onClick={() => select(i)}
                  className={`h-1.5 flex-1 rounded-full transition ${
                    i === index ? 'bg-[#7c5cff]' : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
