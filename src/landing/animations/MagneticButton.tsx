import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { ReactNode, MouseEvent } from 'react';

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticButton({ href, children, className = '', strength = 18 }: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set((dx / rect.width) * strength);
    y.set((dy / rect.height) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
