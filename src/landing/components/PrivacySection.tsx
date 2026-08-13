import { motion, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';

const STEPS = [
  'You start a session',
  'Temporary audio is captured',
  'Live Flow processes the input',
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
    <section
      id="privacy"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-28"
      style={{ background: 'linear-gradient(180deg, #EEF4F1 0%, #E7F0EC 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(74,124,111,0.12),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <div>
          <RevealHeadline
            as="h2"
            lines={['Your voice', 'is yours.']}
            className="text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5C534C] sm:text-lg">
            Live Flow is designed with privacy in mind. Audio is processed only when you
            explicitly start a session. Temporary meeting captures are not meant to become a
            permanent archive.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#2A2420]">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4A7C6F]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E9DECB] bg-white p-6 shadow-[0_16px_48px_rgba(42,36,32,0.06)] sm:p-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#4A7C6F] uppercase">
            Session architecture
          </p>
          <ol className="mt-5 space-y-4 text-sm text-[#2A2420]">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4A7C6F]/25 bg-[#4A7C6F]/10 text-[11px] text-[#4A7C6F]">
                  {i + 1}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ol>

          <div className="relative mt-8 h-16 overflow-hidden rounded-xl border border-[#E9DECB] bg-[#FAF3E9]">
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
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-[#2A2420]"
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
