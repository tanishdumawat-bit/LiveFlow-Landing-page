import { motion, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';

const STEPS = [
  { title: 'You start', detail: 'Recording begins only when you say so.' },
  { title: 'Temporary capture', detail: 'Audio is held for this session only.' },
  { title: 'Process', detail: 'Live Flow turns speech into useful text.' },
  { title: 'Result appears', detail: 'Words land where you need them.' },
  { title: 'Capture discarded', detail: 'Temporary audio does not become an archive.' },
] as const;

const HIGHLIGHTS = [
  { title: 'Your API key', detail: 'Configured in Settings on your Mac.' },
  { title: 'Local preferences', detail: 'Tone and habits stay on device.' },
  { title: 'Explicit sessions', detail: 'Nothing records until you start.' },
  { title: 'No lasting archive', detail: 'Temporary captures are not meant to persist.' },
] as const;

export function PrivacySection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="privacy"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-28"
      style={{ background: 'linear-gradient(180deg, #F7F9F8 0%, #F3F6F5 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(74,124,111,0.12),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#4A7C6F] uppercase">
            Privacy
          </p>
          <RevealHeadline
            as="h2"
            lines={['Your voice', 'is yours.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5C5F66] sm:text-lg">
            You start every session. Live Flow processes that moment — not a permanent audio
            history.
          </p>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#E6E8EC] pt-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#4A7C6F] uppercase">
              What stays with you
            </p>
            <ul className="mt-6 space-y-5">
              {HIGHLIGHTS.map((item) => (
                <li key={item.title} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#4A7C6F]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-[#2A2420]">{item.title}</p>
                  <span aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-[#5C5F66]">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#4A7C6F] uppercase">
              In a session
            </p>
            <ol className="mt-6 space-y-5">
              {STEPS.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#4A7C6F]/25 bg-[#4A7C6F]/10 text-[11px] font-medium text-[#4A7C6F]">
                    {i + 1}
                  </span>
                  <p className="self-center text-sm font-semibold text-[#2A2420]">{step.title}</p>
                  <span aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-[#5C5F66]">{step.detail}</p>
                </li>
              ))}
            </ol>

            <div className="relative mt-8 h-14 overflow-hidden rounded-xl border border-[#E6E8EC] bg-white">
              <motion.div
                animate={
                  reduce
                    ? undefined
                    : {
                        opacity: [1, 1, 0.12],
                        filter: ['blur(0px)', 'blur(0px)', 'blur(8px)'],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.55, 1] }}
              >
                <VoiceFlow state="listening" className="h-14 w-full" amplitude={0.85} />
              </motion.div>
              <motion.p
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium text-[#2A2420]"
                animate={reduce ? undefined : { opacity: [0, 0, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.55, 1] }}
              >
                Result stays. Waveform fades.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
