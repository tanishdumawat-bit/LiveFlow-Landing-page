import { HAS_MEASURED_METRICS, MEASURED_METRICS } from '../data/demos';
import { RevealHeadline } from '../animations/RevealHeadline';

/**
 * Hidden until MEASURED_METRICS has real values.
 * Do not invent statistics for marketing.
 */
export function MetricsSection() {
  if (!HAS_MEASURED_METRICS) return null;

  const visible = MEASURED_METRICS.filter((m) => m.value != null && m.value !== '');

  return (
    <section id="metrics" className="bg-[#FAF3E9] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealHeadline
          as="h2"
          lines={['What we measure.']}
          className="text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-[#E9DECB] bg-white px-5 py-6"
            >
              <p className="text-[11px] font-medium tracking-wide text-[#5C534C] uppercase">
                {m.label}
              </p>
              <p className="mt-2 font-serif text-4xl text-[#2A2420]">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
