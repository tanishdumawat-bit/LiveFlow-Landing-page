import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

type Props = {
  to: number;
  inView: boolean;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({
  to,
  inView,
  suffix = '',
  prefix = '',
  duration = 1300,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce, duration]);

  return (
    <span className={className}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
