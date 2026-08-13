import { motion, useReducedMotion } from 'motion/react';

export function AmbientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />
      <motion.div
        className="orb-primary absolute -left-24 top-0 h-[46vh] w-[46vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-violet absolute -right-10 top-[18%] h-[40vh] w-[40vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { x: [0, -30, 18, 0], y: [0, 22, -16, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-success absolute right-[10%] top-[52%] h-[36vh] w-[36vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { x: [0, -24, 20, 0], y: [0, -20, 25, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-accent absolute bottom-0 left-1/4 h-[42vh] w-[52vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-sky absolute bottom-[10%] right-[-8%] h-[32vh] w-[32vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { x: [0, 16, -10, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="noise-overlay absolute inset-0 opacity-[0.035] mix-blend-multiply" />
    </div>
  );
}
