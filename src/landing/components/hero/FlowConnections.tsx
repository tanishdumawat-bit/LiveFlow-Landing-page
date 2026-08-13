import { motion, useReducedMotion } from 'motion/react';

/** Soft organic energy paths weaving between cards — decorative SVG layer. */
export function FlowConnections({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-1/3 z-0 hidden h-40 w-full md:block"
      viewBox="0 0 1200 160"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="heroFlowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C4501E" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#D3B49B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4A7C6F" stopOpacity="0.4" />
        </linearGradient>
        <filter id="heroFlowBlur" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <motion.path
        d="M40 90 C 180 20, 280 140, 420 70 S 620 20, 760 95 S 980 150, 1160 60"
        stroke="url(#heroFlowGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#heroFlowBlur)"
        fill="none"
        strokeDasharray="8 14"
        animate={reduce ? undefined : { strokeDashoffset: [0, -120] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        opacity={0.65}
      />
      <motion.path
        d="M60 110 C 220 160, 340 40, 500 100 S 720 150, 880 55 S 1040 30, 1140 100"
        stroke={accent}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 18"
        animate={reduce ? undefined : { strokeDashoffset: [0, 100] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        opacity={0.3}
      />
    </svg>
  );
}
