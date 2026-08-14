import { CircularCorrection } from './orbit/CircularCorrection';

export function CircularCleanupSection() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="mb-4 text-center text-[11px] font-semibold tracking-[0.2em] text-violet uppercase">
        Same cleanup, in the round
      </p>
      <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/55 px-2 py-6 shadow-stage backdrop-blur-xl sm:rounded-[40px] sm:px-6 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--violet) 12%, transparent) 42%, transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <CircularCorrection />
        </div>
      </div>
    </section>
  );
}
