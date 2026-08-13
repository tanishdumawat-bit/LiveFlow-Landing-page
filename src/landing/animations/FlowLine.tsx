import { motion, useReducedMotion } from 'motion/react';

type FlowLineProps = {
  className?: string;
  vertical?: boolean;
};

export function FlowLine({ className = '', vertical = false }: FlowLineProps) {
  const reduce = useReducedMotion();

  if (vertical) {
    return (
      <svg viewBox="0 0 8 120" className={className} aria-hidden="true">
        <motion.path
          d="M4 0 C4 30 4 60 4 120"
          fill="none"
          stroke="url(#flowV)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduce ? undefined : { pathLength: 0, opacity: 0.3 }}
          whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="flowV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ce1e6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#7c5cff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5ce1e6" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 24" className={className} preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M0 12 C40 4 80 20 120 12 S200 4 240 12 S280 18 320 12"
        fill="none"
        stroke="url(#flowH)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={reduce ? undefined : { pathLength: 0, opacity: 0.35 }}
        whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {!reduce && (
        <motion.circle
          r="2.5"
          fill="#9b87ff"
          animate={{ offsetDistance: ['0%', '100%'] }}
          style={{ offsetPath: 'path("M0 12 C40 4 80 20 120 12 S200 4 240 12 S280 18 320 12")' }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <defs>
        <linearGradient id="flowH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5ce1e6" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#7c5cff" stopOpacity="1" />
          <stop offset="100%" stopColor="#5ce1e6" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
