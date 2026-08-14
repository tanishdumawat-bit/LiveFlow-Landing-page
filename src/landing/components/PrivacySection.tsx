import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { VoiceFlow } from '../animations/VoiceFlow';

const PILLARS = [
  {
    n: '01',
    title: 'You choose when to speak',
    body: 'Relay only captures audio when you explicitly start a session.',
  },
  {
    n: '02',
    title: 'Your connection is private',
    body: 'Every user gets a secure, unique key. Your credentials aren’t exposed to the apps you use.',
  },
  {
    n: '03',
    title: 'No permanent voice archive',
    body: 'Audio is used for the active session and temporary session data is discarded according to the session lifecycle.',
  },
] as const;

const STATEMENTS = [
  'Private by design.',
  'Explicit by default.',
  'Nothing happens until you speak.',
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function PrivacySection() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.35 });

  return (
    <section
      id="privacy"
      ref={sectionRef}
      className="relative overflow-hidden bg-midnight px-4 py-24 sm:px-6 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 10% 20%, color-mix(in srgb, var(--teal) 18%, transparent), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 50%)',
        }}
      />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Privacy</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-cream sm:text-5xl lg:text-[3.4rem]">
            <span className="block">Your voice</span>
            <span className="mt-1 block font-serif italic">stays yours.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#cbb8ae] sm:text-lg">
            Relay is built to give you the speed of voice without giving up control of your data.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#9a8b82] sm:text-[17px]">
            You decide when Relay listens, what gets processed, and what remains after your session
            ends.
          </p>
          <ul className="mt-10 space-y-2.5">
            {STATEMENTS.map((line, i) => (
              <motion.li
                key={line}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease }}
                className="text-sm font-semibold tracking-tight text-cream sm:text-[15px]"
              >
                {line}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-midnight-card p-6 shadow-ink sm:p-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-teal uppercase">
            Session architecture
          </p>
          <ol className="mt-6 space-y-6">
            {PILLARS.map((item, i) => (
              <motion.li
                key={item.n}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.12 + i * 0.14, ease }}
                className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1"
              >
                <motion.span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-teal/30 bg-teal/10 text-[11px] font-medium text-teal"
                  animate={
                    reduce || !inView
                      ? undefined
                      : {
                          boxShadow: [
                            '0 0 0 0 rgba(20,184,166,0)',
                            '0 0 12px 1px rgba(20,184,166,0.35)',
                            '0 0 0 0 rgba(20,184,166,0)',
                          ],
                          borderColor: [
                            'rgba(20,184,166,0.3)',
                            'rgba(20,184,166,0.7)',
                            'rgba(20,184,166,0.3)',
                          ],
                        }
                  }
                  transition={{
                    duration: 3.2,
                    delay: i * 0.45,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {item.n}
                </motion.span>
                <p className="self-center text-sm font-semibold text-cream">{item.title}</p>
                <span aria-hidden="true" />
                <p className="text-sm leading-relaxed text-[#cbb8ae]">{item.body}</p>
              </motion.li>
            ))}
          </ol>

          <div className="relative mt-8 h-16 overflow-hidden rounded-xl border border-white/10 bg-midnight">
            <motion.div
              animate={
                reduce || !inView
                  ? undefined
                  : {
                      opacity: [0.85, 1, 0.18],
                      scale: [1, 1.015, 1],
                      filter: ['blur(0px)', 'blur(0px)', 'blur(7px)'],
                    }
              }
              transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.52, 1], ease: 'easeInOut' }}
            >
              <VoiceFlow state="listening" className="h-16 w-full" amplitude={0.85} />
            </motion.div>
            <motion.p
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-cream"
              animate={reduce || !inView ? undefined : { opacity: [0, 0, 1] }}
              transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.52, 1] }}
            >
              Result stays. Waveform fades.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
