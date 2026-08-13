import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: string;
};

/**
 * Scroll entrance — fade/rise only.
 * Codrops 3D page classes were leaving tall sections at opacity 0
 * (blank holes between marquees) when IntersectionObserver missed.
 */
export function SectionReveal({ children, className = '' }: SectionRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;
    const fallback = window.setTimeout(() => {
      node.style.opacity = '1';
    }, 1200);
    return () => window.clearTimeout(fallback);
  }, [reduce]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06, margin: '0px 0px -4% 0px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
