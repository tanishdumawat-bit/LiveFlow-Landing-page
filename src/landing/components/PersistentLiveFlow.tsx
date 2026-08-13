import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';

/**
 * Small persistent Live Flow presence that stays visible while exploring the page.
 */
export function PersistentLiveFlow() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setVisible(v > 0.08 && v < 0.92);
    setPulse(v > 0.18 && v < 0.55);
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 md:block"
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 16,
      }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 shadow-nav backdrop-blur-xl">
        <motion.span
          className={`h-2 w-2 rounded-full ${pulse ? 'bg-primary' : 'bg-success'}`}
          animate={pulse ? { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="text-[11px] font-medium text-ink">
          {pulse ? 'Live Flow · in your workflow' : 'Live Flow'}
        </span>
      </div>
    </motion.div>
  );
}
