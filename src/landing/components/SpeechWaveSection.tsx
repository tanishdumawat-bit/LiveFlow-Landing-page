import { SpeechWave } from './hero/SpeechWave';

/**
 * The spoken-wave cleanup - lives below the hero so the first screen can stay wild.
 */
export function SpeechWaveSection() {
  return (
    <section id="cleanup" className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 0%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 60%), radial-gradient(ellipse 40% 40% at 100% 80%, color-mix(in srgb, var(--violet) 12%, transparent), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Speak → write
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Rambling in.
            <span className="mt-1 block font-serif text-violet italic">Punctuated. Cleaned. Sent.</span>
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Words arrive on a wave. Commas land. Fillers drop. What’s left is the sentence you meant.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[32px] border border-white/70 bg-white/70 px-5 py-8 shadow-stage backdrop-blur-xl sm:px-8 sm:py-10">
          <SpeechWave />
        </div>
      </div>
    </section>
  );
}
