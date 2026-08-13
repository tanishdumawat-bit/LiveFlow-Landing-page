import { motion, useReducedMotion, type MotionValue } from 'motion/react';

type Props = {
  /** Active app's accent color — the aura subtly follows it. */
  accent: string;
  y?: MotionValue<string>;
};

/**
 * Fully generated ambient background — no product photo, just warm
 * gradient light + a faint dot grid, so the hero reads as pure brand color.
 */
export function HeroAura({ accent, y }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div className="absolute inset-0" style={{ y }} aria-hidden="true">
      <div className="absolute inset-0 bg-background" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ink) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black 0%, transparent 75%)',
        }}
      />

      <motion.div
        className="absolute top-[-10%] left-[-15%] h-[55vh] w-[55vh] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}2e 0%, transparent 68%)` }}
        animate={reduce ? undefined : { x: [0, 36, -14, 0], y: [0, 24, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-accent absolute top-[6%] right-[-10%] h-[50vh] w-[50vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { x: [0, -28, 16, 0], y: [0, 20, -14, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-violet absolute top-[18%] left-[38%] h-[42vh] w-[42vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { x: [0, 20, -24, 0], y: [0, -16, 12, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb-primary absolute bottom-[-18%] left-1/3 h-[46vh] w-[62vh] rounded-full blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
