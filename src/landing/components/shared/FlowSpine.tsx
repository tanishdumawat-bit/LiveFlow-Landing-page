import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

/**
 * A glowing bead that rides scroll - the visual thread tying sections together.
 */
export function FlowSpine() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 28, restDelta: 0.001 });
  const top = useTransform(smooth, [0, 1], ['8%', '88%']);
  const hue = useTransform(
    smooth,
    [0, 0.25, 0.5, 0.75, 1],
    ['#ff5a32', '#7c5cff', '#14b8a6', '#f4b942', '#ff5a32'],
  );

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-3 z-30 hidden h-full w-6 lg:block"
    >
      <div className="absolute top-[8%] bottom-[8%] left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary/0 via-violet/35 to-gold/0" />
      <motion.span
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
        style={{ top, background: hue, boxShadow: '0 0 18px currentColor' }}
      />
    </div>
  );
}
