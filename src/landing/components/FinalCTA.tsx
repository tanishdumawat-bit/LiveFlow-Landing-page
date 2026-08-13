import { useEffect, useId, useRef } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { DOWNLOAD_URL } from '../data/apps';
import { MagneticButton } from '../animations/MagneticButton';

function OrbitLabel({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const rawId = useId();
  const id = `cta-ring-${rawId.replace(/:/g, '')}`;
  const pathRef = useRef<SVGTextPathElement>(null);
  const r = 124;
  const cx = 150;
  const cy = 150;
  const d = `M ${cx - r},${cy} a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`;
  const loop = `${text}   ·   ${text}   ·   ${text}   ·   `;

  useEffect(() => {
    if (reduce || !pathRef.current) return;
    const controls = animate(0, 100, {
      duration: 18,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: (v) => pathRef.current?.setAttribute('startOffset', `${-v}%`),
    });
    return () => controls.stop();
  }, [reduce]);

  return (
    <svg
      className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
      viewBox="0 0 300 300"
      aria-hidden="true"
    >
      <path id={id} d={d} fill="none" />
      <text
        fill="var(--gold)"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.18em"
        fontFamily="Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
      >
        <textPath ref={pathRef} href={`#${id}`}>
          {loop}
        </textPath>
      </text>
    </svg>
  );
}

export function FinalCTA() {
  return (
    <section id="download" className="relative overflow-hidden bg-midnight px-4 py-24 sm:px-6 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 40%, color-mix(in srgb, var(--primary) 28%, transparent), color-mix(in srgb, var(--violet) 18%, transparent) 42%, transparent 70%)',
        }}
      />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Start flowing</p>
        <h2 className="mt-4 font-serif text-5xl tracking-tight text-cream italic sm:text-6xl lg:text-7xl">
          Don’t type.
          <span className="mt-1 block text-primary">Just speak.</span>
        </h2>
        <p className="mt-5 max-w-lg text-base text-[#cbb8ae] sm:text-lg">
          Effortless voice dictation on your Mac. Fillers out, meaning in, cursor wherever you left it.
        </p>

        <div className="relative mt-12 flex h-[300px] w-[300px] items-center justify-center">
          <OrbitLabel text="TALK 4× FASTER  ·  LIVE FLOW  ·  OPTION + SPACE" />
          <MagneticButton
            href={DOWNLOAD_URL}
            className="relative z-10 inline-flex h-14 items-center rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-cta-lg hover:bg-primary-dark"
          >
            Download for Mac
          </MagneticButton>
        </div>
        <p className="mt-4 text-sm text-[#9a8b82]">Free to start · Built for macOS</p>
      </div>
    </section>
  );
}
