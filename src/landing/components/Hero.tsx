import { useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { HeroAura } from './hero/HeroAura';
import { VoiceField } from './hero/VoiceField';

export function Hero() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const bgY = useTransform(smooth, [0, 1], reduce ? ['0%', '0%'] : ['0%', '8%']);

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <HeroAura accent="#ff5a32" y={bgY} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,color-mix(in_srgb,var(--violet)_18%,transparent),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <VoiceField />
      </div>
    </section>
  );
}
