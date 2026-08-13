import { motion, useReducedMotion } from 'motion/react';

export function AmbientBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FFFFFF]" />
      <motion.div
        className="absolute -left-24 top-0 h-[42vh] w-[42vh] rounded-full bg-[radial-gradient(circle,rgba(196,80,30,0.06),transparent_65%)] blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 top-[28%] h-[36vh] w-[36vh] rounded-full bg-[radial-gradient(circle,rgba(74,124,111,0.06),transparent_65%)] blur-3xl"
        animate={reduce ? undefined : { x: [0, -30, 20, 0], y: [0, -20, 25, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[40vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(200,210,230,0.35),transparent_70%)] blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}
