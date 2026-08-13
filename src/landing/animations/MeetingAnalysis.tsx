import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MEETING_REPORT, MEETING_SNIPPETS } from '../data/apps';

type Phase = 'recording' | 'transcribing' | 'analyzing' | 'complete';

type MeetingAnalysisProps = {
  phase: Phase;
  elapsed: string;
};

export function MeetingAnalysis({ phase, elapsed }: MeetingAnalysisProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] p-5 sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">Note Taker</p>
          <p className="mt-1 text-xs text-[#8a8a93]">
            {phase === 'recording' && 'Recording'}
            {phase === 'transcribing' && 'Transcribing'}
            {phase === 'analyzing' && 'Analyzing'}
            {phase === 'complete' && 'Complete'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-[#f5f5f7]">{elapsed}</span>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              phase === 'recording' ? 'bg-[#ff3b30] glow-record' : 'bg-[#34c759]'
            }`}
            aria-hidden="true"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'complete' ? (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
            className="relative min-h-[280px]"
          >
            <div className="space-y-3">
              {MEETING_SNIPPETS.map((snippet, i) => (
                <motion.p
                  key={snippet}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: phase === 'analyzing' ? 0.35 : 1,
                    y: phase === 'analyzing' && !reduce ? -8 * i : 0,
                  }}
                  transition={{ delay: 0.15 * i, duration: 0.5 }}
                  className="rounded-lg border border-white/5 bg-[#121214] px-3 py-2 text-sm text-[#c8c8d0]"
                >
                  {snippet}
                </motion.p>
              ))}
            </div>

            {phase === 'analyzing' && (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-28 w-28 rounded-full border border-[#7c5cff]/50"
                  animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ boxShadow: '0 0 40px rgba(124,92,255,0.35)' }}
                />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="report"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {[
              { title: 'Summary', body: MEETING_REPORT.summary },
              { title: 'Decisions', body: MEETING_REPORT.decisions.map((d) => `• ${d}`).join('\n') },
              {
                title: 'Action items',
                body: MEETING_REPORT.actionItems.map((a) => `• ${a.owner} — ${a.task}`).join('\n'),
              },
              {
                title: 'Next steps',
                body: MEETING_REPORT.nextSteps.map((s) => `• ${s}`).join('\n'),
              },
            ].map((card, i) => (
              <motion.article
                key={card.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: 'blur(8px)', scale: 0.96 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                transition={{ delay: 0.08 * i, type: 'spring', stiffness: 220, damping: 22 }}
                className="rounded-xl border border-white/10 bg-[#121214] p-4"
              >
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b87ff]">
                  {card.title}
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#d4d4dc]">{card.body}</p>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
