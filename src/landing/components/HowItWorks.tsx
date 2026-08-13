import { motion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';

const steps = [
  {
    n: '01',
    title: 'Speak',
    body: 'Talk the way you already think.',
    visual: 'listen' as const,
  },
  {
    n: '02',
    title: 'Live Flow understands',
    body: 'Context, vocabulary, tone and destination shape what your words become.',
    visual: 'understand' as const,
  },
  {
    n: '03',
    title: 'Transform',
    body: 'Raw speech becomes useful output.',
    visual: 'transform' as const,
  },
  {
    n: '04',
    title: 'Deliver',
    body: 'Words appear where you need them.',
    visual: 'deliver' as const,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FAF3E9] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealHeadline
          as="h2"
          lines={["Don't type.", "Don't take notes.", 'Just talk.']}
          className="max-w-xl text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
        />
        <p className="mt-4 max-w-lg text-base text-[#5C534C] sm:text-lg">
          Speak once. Live Flow understands what you mean, adapts to where you are, and turns your
          voice into writing — or meeting insight.
        </p>

        <div className="mt-8 hidden md:block">
          <VoiceFlow state="processing" className="h-8 w-full" />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.1 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[#E9DECB] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(42,36,32,0.07)]"
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E]">{step.n}</p>
              <h3 className="mt-3 text-lg font-semibold text-[#2A2420]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C534C]">{step.body}</p>
              <div className="mt-5 h-14 rounded-xl border border-[#E9DECB] bg-[#FAF3E9] p-2.5">
                {step.visual === 'listen' && (
                  <VoiceFlow state="listening" amplitude={0.9} className="h-full w-full" />
                )}
                {step.visual === 'understand' && (
                  <div className="flex h-full items-center text-[11px] text-[#5C534C]">
                    <span className="line-through opacity-50">um maybe…</span>
                    <span className="mx-1.5 text-[#4A7C6F]">→</span>
                    <span className="text-[#2A2420]">clear intent</span>
                  </div>
                )}
                {step.visual === 'transform' && (
                  <div className="flex h-full items-center gap-1.5 text-[11px] text-[#2A2420]">
                    <span className="rounded bg-[#F2E6D3] px-1.5 py-0.5">raw</span>
                    <span className="text-[#C4501E]">→</span>
                    <span className="rounded bg-[#C4501E]/12 px-1.5 py-0.5 text-[#8A4A24]">
                      polished
                    </span>
                  </div>
                )}
                {step.visual === 'deliver' && (
                  <div className="flex h-full flex-wrap items-center gap-1.5 text-[11px] text-[#2A2420]">
                    <span className="rounded bg-[#F2E6D3] px-1.5 py-0.5">Slack</span>
                    <span className="rounded bg-[#F2E6D3] px-1.5 py-0.5">Gmail</span>
                    <span className="rounded bg-[#C4501E]/15 px-1.5 py-0.5 text-[#8A4A24]">
                      Cursor
                    </span>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
