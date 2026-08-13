import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { VoiceFlow } from './VoiceFlow';

type SectionBridgeProps = {
  from?: string;
  to?: string;
};

/**
 * Visual seam between “pages” (sections) — voice energy travels across.
 */
export function SectionBridge({ from = 'Voice', to = 'Action' }: SectionBridgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const stretch = useSpring(useTransform(scrollYProgress, [0.1, 0.7], [0.45, 1.4]), {
    stiffness: 90,
    damping: 28,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const lineScale = useSpring(useTransform(scrollYProgress, [0.15, 0.6], [0.2, 1]), {
    stiffness: 100,
    damping: 26,
  });

  return (
    <div ref={ref} className="relative z-10 -my-4 px-4 py-6 sm:-my-6 sm:px-6 sm:py-8" aria-hidden="true">
      <motion.div style={reduce ? undefined : { opacity, y }} className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-center gap-3">
          <motion.div
            className="h-px flex-1 origin-right bg-gradient-to-l from-[#E9DECB] to-transparent"
            style={reduce ? undefined : { scaleX: lineScale }}
          />
          <span className="text-[10px] font-medium tracking-[0.18em] text-[#5C534C]/80 uppercase">
            Continue
          </span>
          <motion.div
            className="h-px flex-1 origin-left bg-gradient-to-r from-[#E9DECB] to-transparent"
            style={reduce ? undefined : { scaleX: lineScale }}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-[10px] font-medium tracking-[0.2em] text-[#5C534C] uppercase">
            {from}
          </span>
          <motion.div
            style={reduce ? undefined : { scaleX: stretch }}
            className="min-w-0 flex-1 origin-left"
          >
            <VoiceFlow state="processing" className="h-8 w-full" showParticles={!reduce} />
          </motion.div>
          <span className="shrink-0 text-[10px] font-medium tracking-[0.2em] text-[#5C534C] uppercase">
            {to}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
