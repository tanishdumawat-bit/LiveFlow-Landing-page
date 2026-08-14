import { AnimatePresence, motion } from 'motion/react';
import type { FlowDestination } from '../../data/contextFlow';
import { mix, theme } from '../../../theme/tokens';
import { AppIconBadge } from '../shared/AppIcon';

type Props = {
  destination: FlowDestination;
  phase: 'hidden' | 'building' | 'ready' | 'delivered';
  reduce?: boolean;
};

export function AppWindow({ destination, phase, reduce }: Props) {
  const show = phase !== 'hidden';
  const lines = destination.output.split('\n');

  return (
    <motion.div
      layout
      animate={{
        opacity: show ? 1 : 0.35,
        scale: phase === 'delivered' ? 1.02 : show ? 1 : 0.97,
        y: show ? 0 : 8,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="overflow-hidden rounded-2xl border bg-white shadow-card-md"
      style={{
        borderColor: phase === 'delivered' || phase === 'ready' ? `${destination.accent}55` : theme.border,
        boxShadow:
          phase === 'delivered'
            ? `0 0 0 1px ${destination.accent}33, 0 18px 48px ${mix(theme.ink, 12)}`
            : undefined,
      }}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <AppIconBadge name={destination.name} accent={destination.accent} size="xs" />
        <span className="text-xs font-semibold text-ink">{destination.name}</span>
        <span className="text-[11px] text-muted">· {destination.windowTitle}</span>
        <span className="ml-auto text-[10px] font-medium tracking-wide text-muted">
          {destination.tone}
        </span>
      </div>

      <div className="min-h-[160px] bg-surface-alt px-4 py-4 sm:min-h-[180px]">
        <AnimatePresence mode="wait">
          {show ? (
            <motion.div
              key={destination.id + phase}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)' }}
              className="space-y-1"
            >
              {lines.map((line, i) => (
                <motion.p
                  key={`${i}-${line.slice(0, 12)}`}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.35 }}
                  className={`whitespace-pre-wrap text-[13px] leading-relaxed text-ink ${
                    destination.id === 'cursor' ? 'font-mono text-[12px] text-success' : ''
                  }`}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              className="text-sm text-muted/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Waiting for delivery…
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {phase === 'delivered' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-border px-4 py-2 text-center text-[11px] font-medium text-success"
        >
          Delivered
        </motion.div>
      )}
    </motion.div>
  );
}
