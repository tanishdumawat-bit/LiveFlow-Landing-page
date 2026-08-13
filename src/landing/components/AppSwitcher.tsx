import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { APP_PROFILES } from '../data/apps';
import { TextTransform } from '../animations/TextTransform';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';

export function AppSwitcher() {
  const reduce = useReducedMotion();
  const tabs = APP_PROFILES.filter((a) => ['slack', 'gmail', 'meet', 'cursor'].includes(a.id));
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? 'slack');
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const [phase, setPhase] = useState<'raw' | 'processing' | 'transformed'>('transformed');

  const onSelect = (id: string) => {
    setActiveId(id);
    if (reduce) {
      setPhase('transformed');
      return;
    }
    setPhase('processing');
    window.setTimeout(() => setPhase('transformed'), 1100);
  };

  return (
    <section className="px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <RevealHeadline
            as="h2"
            lines={['Live Flow knows', 'where you are.']}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-4 text-base leading-relaxed text-[#8a8a93] sm:text-lg"
          >
            Your words should sound different in Slack, email, code, and meetings. Live Flow adapts
            automatically.
          </motion.p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f]">
          <div
            className="flex gap-1 overflow-x-auto border-b border-white/8 p-2"
            role="tablist"
            aria-label="Application context"
          >
            {tabs.map((tab) => {
              const selected = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onSelect(tab.id)}
                  className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    selected ? 'text-white' : 'text-[#8a8a93] hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="app-tab"
                      className="absolute inset-0 rounded-xl bg-[#121214] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-0 lg:grid-cols-2">
            <div className="border-b border-white/8 p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#8a8a93] uppercase">
                Same speech
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#d4d4dc]">{active.input}</p>
              <div className="mt-5">
                <VoiceFlow
                  state={phase === 'processing' ? 'processing' : 'idle'}
                  className="h-8 w-full max-w-xs"
                  showParticles={phase === 'processing'}
                />
              </div>
              <p className="mt-6 text-[11px] font-semibold tracking-[0.16em] text-[#8a8a93] uppercase">
                Active app
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121214] px-3 py-1.5 text-sm text-white"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: active.accent }} />
                  {active.name}
                  <span className="text-[#8a8a93]">· {active.tone}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-5 sm:p-7">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#9b87ff] uppercase">
                Adapted output
              </p>
              <motion.div
                layout
                className="mt-4 min-h-[140px] rounded-xl border border-white/8 bg-[#121214] p-4"
                style={{
                  boxShadow:
                    phase === 'processing' ? '0 0 0 1px rgba(124,92,255,0.25)' : 'none',
                }}
              >
                <div className="mb-3 flex items-center justify-between text-xs text-[#8a8a93]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active.windowTitle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {active.windowTitle}
                    </motion.span>
                  </AnimatePresence>
                  <span>Live Flow</span>
                </div>
                <TextTransform
                  key={active.id}
                  from={active.input}
                  to={active.output}
                  phase={phase === 'raw' ? 'raw' : phase}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
