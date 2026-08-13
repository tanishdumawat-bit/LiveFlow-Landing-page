import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getApp, type FlowStage, type HeroAppId } from '../../data/heroShowcase';
import { mix, theme } from '../../../theme/tokens';

type Props = {
  activeId: HeroAppId;
  stage: FlowStage | 'idle';
  delivered: boolean;
};

function MiniWave({ color, active }: { color: string; active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-3 items-end gap-[2px]">
      {[0.4, 0.85, 0.55, 1, 0.65, 0.9, 0.45].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: color, originY: 1 }}
          animate={
            reduce || !active
              ? { height: 4 + h * 4, opacity: 0.45 }
              : { height: [4, 4 + h * 8, 5], opacity: [0.5, 1, 0.55] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.7 + i * 0.05, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }
          }
        />
      ))}
    </div>
  );
}

function CardChrome({
  id,
  title,
  accent,
  primary,
  children,
}: {
  id: HeroAppId;
  title: string;
  accent: string;
  primary: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      id={`hero-card-${id}`}
      role="tabpanel"
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white"
      style={{
        borderColor: primary ? accent : theme.border,
        boxShadow: primary
          ? `0 0 0 1px ${accent}35, 0 16px 40px ${mix(theme.ink, 10)}`
          : `0 4px 16px ${mix(theme.ink, 4)}`,
      }}
      animate={{
        opacity: primary ? 1 : 0.55,
        scale: primary ? 1 : 0.98,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] font-semibold tracking-wide text-ink">{title}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-3 py-2.5 text-[11px] leading-relaxed text-ink">
        {children}
      </div>
      <div className="flex h-9 shrink-0 items-center justify-between border-t border-border px-3">
        <span className="text-[10px] font-medium tracking-wide text-muted">Live Flow</span>
        <MiniWave color={accent} active={primary} />
      </div>
    </motion.div>
  );
}

function GmailBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p>
        <span className="text-muted">To:</span> sarah@company.com
      </p>
      <p>
        <span className="text-muted">Subject:</span> Project update
      </p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div
            key="body"
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="space-y-1.5 pt-1 text-ink"
          >
            <p>Hi Sarah,</p>
            <p>
              Just wanted to let you know I&apos;ll have the proposal ready first thing tomorrow
              morning.
            </p>
            <p>Talk soon!</p>
            <p className="text-muted">— Chinmay</p>
          </motion.div>
        ) : (
          <motion.div key="empty" className="space-y-1.5 pt-2">
            <div className="h-2 w-[80%] rounded bg-surface-alt" />
            <div className="h-2 w-full rounded bg-surface-alt" />
            <div className="h-2 w-[60%] rounded bg-surface-alt" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlackBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-ink/80"># product-team</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div
            key="msg"
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="rounded-lg bg-surface-alt p-2"
          >
            <p className="mb-1 text-[10px] font-semibold text-primary-dark">Chinmay</p>
            <p>
              Just a quick update — I&apos;ll have the proposal ready tomorrow morning.
              <br />
              <br />
              Let me know if you need anything else!
            </p>
          </motion.div>
        ) : (
          <motion.div key="empty" className="h-16 rounded-lg bg-surface-alt" />
        )}
      </AnimatePresence>
    </div>
  );
}

function NotionBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-ink">Project Update</p>
      <p>
        <span className="text-muted">Status:</span> In Progress
      </p>
      <p className="text-muted">Update</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="mb-2">&quot;I&apos;ll have the proposal ready tomorrow morning.&quot;</p>
            <p className="text-muted">Next Steps</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>Review proposal</li>
              <li>Finalize deck</li>
            </ul>
          </motion.div>
        ) : (
          <div className="h-12 rounded bg-surface-alt" />
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatGptBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-muted">User</p>
      <p className="rounded-lg bg-surface-alt p-2">
        &quot;Help me draft an update to share with the team.&quot;
      </p>
      <p className="text-muted">Assistant</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div
            key="a"
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            className="rounded-lg border border-success/25 bg-success/8 p-2"
          >
            Here&apos;s a concise update you can share:
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>Proposal will be ready tomorrow morning.</li>
              <li>Final review in progress.</li>
              <li>Will share by EOD.</li>
            </ul>
          </motion.div>
        ) : (
          <div className="h-14 rounded-lg bg-surface-alt" />
        )}
      </AnimatePresence>
    </div>
  );
}

function CursorBody({ reveal }: { reveal: boolean }) {
  return (
    <pre className="overflow-hidden font-mono text-[10px] leading-relaxed text-success">
      <code>
        {`// Implement proposal
// update flow

`}
        {reveal ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {`const update = {
  message:
    'Proposal will be ready
     tomorrow morning.'
};

sendUpdate(update);`}
          </motion.span>
        ) : (
          <span className="text-filler">{`const update = { … }`}</span>
        )}
      </code>
    </pre>
  );
}

function BrowserBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-ink">Project Roadmap</p>
      <p className="text-muted">Latest update</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.p key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Proposal will be ready tomorrow morning.
          </motion.p>
        ) : (
          <div className="h-3 w-4/5 rounded bg-surface-alt" />
        )}
      </AnimatePresence>
      <div className="mt-2 flex h-12 items-end gap-1.5">
        {[40, 65, 45, 80, 55, 70].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-success/35"
            initial={{ height: 8 }}
            animate={{ height: reveal ? h * 0.45 : 10 + (i % 3) * 6 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
          />
        ))}
      </div>
    </div>
  );
}

function CardContent({ id, reveal }: { id: HeroAppId; reveal: boolean }) {
  switch (id) {
    case 'gmail':
      return <GmailBody reveal={reveal} />;
    case 'slack':
      return <SlackBody reveal={reveal} />;
    case 'notion':
      return <NotionBody reveal={reveal} />;
    case 'chatgpt':
      return <ChatGptBody reveal={reveal} />;
    case 'cursor':
      return <CursorBody reveal={reveal} />;
    case 'browser':
      return <BrowserBody reveal={reveal} />;
  }
}

type CardsProps = Props & {
  order: HeroAppId[];
};

export function AppCardsRow({ activeId, stage, delivered, order }: CardsProps) {
  const reveal = delivered || stage === 'delivering';

  return (
    <>
      {/* Desktop: equal aligned row */}
      <div className="mx-auto hidden w-full max-w-5xl md:block">
        <div className="grid grid-cols-6 items-stretch gap-3">
          {order.map((id) => {
            const app = getApp(id);
            const primary = id === activeId;
            return (
              <div key={id} className="h-[260px] min-w-0 lg:h-[280px]">
                <CardChrome id={id} title={app.name} accent={app.accent} primary={primary}>
                  <CardContent id={id} reveal={primary && reveal} />
                </CardChrome>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: single primary card */}
      <div className="mx-auto w-full max-w-sm md:hidden">
        <div className="h-[300px]">
          <CardChrome
            id={activeId}
            title={getApp(activeId).name}
            accent={getApp(activeId).accent}
            primary
          >
            <CardContent id={activeId} reveal={reveal} />
          </CardChrome>
        </div>
      </div>
    </>
  );
}
