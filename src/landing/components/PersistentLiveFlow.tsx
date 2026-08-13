import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { LiveFlowMark } from './brand/LiveFlowLogo';

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
      <div className="flex items-center gap-2 rounded-full border border-violet/20 bg-white/90 py-1 pr-3 pl-1 shadow-nav backdrop-blur-xl">
        <LiveFlowMark className="h-6 w-6" />
        <span className="text-[11px] font-medium text-ink">
          {pulse ? 'in your workflow' : 'Live Flow'}
        </span>
      </div>
    </motion.div>
  );
}
