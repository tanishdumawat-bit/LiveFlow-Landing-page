import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CountUp } from './CountUp';

export type Metric = {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

type Props = {
  items: readonly Metric[];
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
};

export function MetricStrip({ items, tone = 'light', align = 'left', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const number = tone === 'dark' ? 'text-cream' : 'text-ink';
  const label = tone === 'dark' ? 'text-[#9a8b82]' : 'text-muted';
  const alignCls = align === 'center' ? 'text-center' : 'text-center sm:text-left';

  return (
    <div
      ref={ref}
      className={`grid grid-cols-3 gap-3 sm:gap-6 ${className}`}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`${alignCls}`}
        >
          <p className={`font-serif text-4xl tracking-tight sm:text-5xl ${number}`}>
            <CountUp
              to={item.to}
              inView={inView}
              suffix={item.suffix}
              prefix={item.prefix}
              duration={1100 + i * 180}
            />
          </p>
          <p className={`mt-1 text-[11px] font-medium tracking-[0.14em] uppercase ${label}`}>
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
