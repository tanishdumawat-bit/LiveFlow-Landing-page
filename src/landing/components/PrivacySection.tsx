import { motion, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';

const STEPS = [
  'You start a session',
  'Temporary audio is captured',
  'Relay processes the input',
  'Result appears',
  'Temporary data is discarded according to your session',
];

const HIGHLIGHTS = [
  'Your API key — configured in Settings',
  'Local preferences on your Mac',
  'Explicit recording — you start the session',
  'No unnecessary permanent audio archive',
];

export function PrivacySection() {
  const reduce = useReducedMotion();

  return (
    <section id="privacy" className="relative overflow-hidden bg-midnight px-4 py-24 sm:px-6 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 10% 20%, color-mix(in srgb, var(--teal) 18%, transparent), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 50%)',
        }}
      />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Privacy</p>
          <RevealHeadline
            as="h2"
            lines={['Your voice', 'stays yours.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-cream sm:text-5xl"
          />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#cbb8ae] sm:text-lg">
            Relay is designed with privacy in mind. Audio is processed only when you
            explicitly start a session. Temporary captures are not meant to become a
            permanent archive.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-cream">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-midnight-card p-6 shadow-ink sm:p-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-teal uppercase">
            Session architecture
          </p>
          <ol className="mt-5 space-y-4 text-sm text-cream">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-teal/30 bg-teal/10 text-[11px] text-teal">
                  {i + 1}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ol>

          <div className="relative mt-8 h-16 overflow-hidden rounded-xl border border-white/10 bg-midnight">
            <motion.div
              animate={
                reduce
                  ? undefined
                  : {
                      opacity: [1, 1, 0.15],
                      filter: ['blur(0px)', 'blur(0px)', 'blur(8px)'],
                    }
              }
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.55, 1] }}
            >
              <VoiceFlow state="listening" className="h-16 w-full" amplitude={0.85} />
            </motion.div>
            <motion.p
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-cream"
              animate={reduce ? undefined : { opacity: [0, 0, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.55, 1] }}
            >
              Result stays. Waveform fades.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
