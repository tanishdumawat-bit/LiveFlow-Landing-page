import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WORKSPACE_APPS } from '../data/workspace';
import { FlowPath } from '../animations/FlowPath';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';
import { MagneticButton } from '../animations/MagneticButton';
import { DOWNLOAD_URL } from '../data/apps';

const FINALE_POS: Record<string, { x: number; y: number }> = {
  gmail: { x: 50, y: 14 },
  slack: { x: 18, y: 40 },
  notion: { x: 82, y: 40 },
  chatgpt: { x: 22, y: 78 },
  cursor: { x: 78, y: 78 },
  browser: { x: 50, y: 88 },
};

/** Final CTA — dark canvas with pulsing Live Flow mic */
export function EcosystemFinale() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  return (
    <section id="download" className="relative overflow-hidden bg-[#2A2420] px-4 py-24 sm:px-6 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,80,30,0.18),transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <RevealHeadline
          as="h2"
          lines={['Stop typing what you', 'already know how to say.']}
          className="text-4xl font-semibold tracking-tight text-[#FAF3E9] sm:text-6xl"
        />
        <p className="mx-auto mt-4 max-w-md text-base text-[#E8D5C4]">
          Speak once. Live Flow takes it from there.
        </p>

        <div className="relative mx-auto mt-14 aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#1a1613]/80">
          <div className="absolute inset-0">
            {WORKSPACE_APPS.map((app) => {
              const pos = FINALE_POS[app.id] ?? { x: 50, y: 50 };
              return (
                <FlowPath
                  key={app.id}
                  d={`M50 50 L${50 + (pos.x - 50) * 0.55} ${50 + (pos.y - 50) * 0.55}`}
                  active
                  intensity={0.55}
                  progress={1}
                  color={app.accent}
                  className="absolute inset-0 h-full w-full"
                />
              );
            })}
          </div>

          {WORKSPACE_APPS.map((app, i) => {
            const pos = FINALE_POS[app.id] ?? { x: 50, y: 50 };
            return (
              <motion.div
                key={app.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/12 bg-[#2A2420] px-3 py-2 text-xs text-[#FAF3E9] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * i, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: app.accent }}
                />
                {app.name}
              </motion.div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 z-10 w-[min(70%,200px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#C4501E]/45 bg-[#1f1a17] p-4 glow-coral">
            <p className="text-center text-[10px] font-semibold tracking-[0.16em] text-[#C4501E] uppercase">
              Live Flow
            </p>
            <VoiceFlow
              state={hover || !reduce ? 'listening' : 'idle'}
              amplitude={hover ? 1 : 0.55}
              className="mt-2 h-8 w-full"
            />
          </div>
        </div>

        <div
          className="mt-14 flex flex-col items-center gap-4"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="mx-auto mb-2 flex items-center gap-3">
            <motion.span
              animate={
                reduce
                  ? undefined
                  : { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C4501E]/40 bg-[#1f1a17]"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#C4501E]" />
            </motion.span>
            <VoiceFlow state="listening" className="h-8 w-28" showParticles={false} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              href={DOWNLOAD_URL}
              className="inline-flex items-center rounded-full bg-[#C4501E] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(196,80,30,0.28)] hover:bg-[#8A4A24]"
            >
              Download for Mac
            </MagneticButton>
            <a
              href="#note-taker"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-[#FAF3E9] transition hover:bg-white/10"
            >
              Explore Note Taker
            </a>
          </div>
          <p className="text-sm text-[#E8D5C4]">Built for macOS</p>
        </div>
      </div>
    </section>
  );
}
