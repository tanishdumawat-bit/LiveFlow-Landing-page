import { AnimatePresence, motion } from 'motion/react';
import type { FlowDestination } from '../../data/contextFlow';

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
      className="overflow-hidden rounded-2xl border bg-white shadow-[0_16px_48px_rgba(42,36,32,0.08)]"
      style={{
        borderColor: phase === 'delivered' || phase === 'ready' ? `${destination.accent}55` : '#E6E8EC',
        boxShadow:
          phase === 'delivered'
            ? `0 0 0 1px ${destination.accent}33, 0 18px 48px rgba(42,36,32,0.12)`
            : undefined,
      }}
    >
      <div className="flex items-center gap-2 border-b border-[#E6E8EC] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full" style={{ background: destination.accent }} />
        <span className="text-xs font-semibold text-[#2A2420]">{destination.name}</span>
        <span className="text-[11px] text-[#5C5F66]">· {destination.windowTitle}</span>
        <span className="ml-auto text-[10px] font-medium tracking-wide text-[#5C5F66]">
          {destination.tone}
        </span>
      </div>

      <div className="min-h-[160px] bg-[#FAFBFC] px-4 py-4 sm:min-h-[180px]">
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
                  className={`whitespace-pre-wrap text-[13px] leading-relaxed text-[#2A2420] ${
                    destination.id === 'cursor' ? 'font-mono text-[12px] text-[#4A7C6F]' : ''
                  }`}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              className="text-sm text-[#5C5F66]/70"
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
          className="border-t border-[#E6E8EC] px-4 py-2 text-center text-[11px] font-medium text-[#4A7C6F]"
        >
          Delivered
        </motion.div>
      )}
    </motion.div>
  );
}
