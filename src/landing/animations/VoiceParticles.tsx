import { motion, useReducedMotion } from 'motion/react';

type VoiceParticlesProps = {
  active?: boolean;
  count?: number;
  className?: string;
};

export function VoiceParticles({ active = true, count = 12, className = '' }: VoiceParticlesProps) {
  const reduce = useReducedMotion();
  if (reduce || !active) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 42 + (i % 4) * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[#9b87ff]"
            style={{ marginLeft: -2, marginTop: -2 }}
            initial={{ x, y, opacity: 0.15, scale: 0.6 }}
            animate={{
              x: [x, x * 0.35, x],
              y: [y, y * 0.35, y],
              opacity: [0.15, 0.85, 0.15],
              scale: [0.6, 1.1, 0.6],
            }}
            transition={{
              duration: 2.2 + (i % 3) * 0.35,
              repeat: Infinity,
              delay: i * 0.08,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
