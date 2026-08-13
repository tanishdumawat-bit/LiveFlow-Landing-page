import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getApp, type FlowStage, type HeroAppId } from '../../data/heroShowcase';

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
      layout
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border"
      style={{
        background: primary ? '#FFFFFF' : '#FAF3E9',
        borderColor: primary ? accent : '#E9DECB',
        boxShadow: primary
          ? `0 0 0 1px ${accent}33, 0 18px 40px rgba(42,36,32,0.10)`
          : '0 10px 28px rgba(42,36,32,0.06)',
      }}
      animate={{
        scale: primary ? 1 : 0.96,
        opacity: primary ? 1 : 0.9,
        y: primary ? 0 : 6,
        filter: 'blur(0px)',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      <div className="flex items-center gap-2 border-b border-[#E9DECB] px-3 py-2.5">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <span className="text-[11px] font-semibold tracking-wide text-[#2A2420]">{title}</span>
      </div>
      <div className="min-h-0 flex-1 px-3 py-2.5 text-[11px] leading-relaxed text-[#2A2420]">
        {children}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-[#E9DECB] px-3 py-2">
        <span className="text-[10px] font-medium tracking-wide text-[#5C534C]">Live Flow</span>
        <MiniWave color={accent} active={primary} />
      </div>
    </motion.div>
  );
}

function GmailBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p>
        <span className="text-[#5C534C]">To:</span> sarah@company.com
      </p>
      <p>
        <span className="text-[#5C534C]">Subject:</span> Project update
      </p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div
            key="body"
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="space-y-1.5 pt-1 text-[#2A2420]"
          >
            <p>Hi Sarah,</p>
            <p>
              Just wanted to let you know I&apos;ll have the proposal ready first thing tomorrow
              morning.
            </p>
            <p>Talk soon!</p>
            <p className="text-[#5C534C]">— Chinmay</p>
          </motion.div>
        ) : (
          <motion.div key="empty" className="space-y-1.5 pt-2">
            <div className="h-2 w-[80%] rounded bg-[#F2E6D3]" />
            <div className="h-2 w-full rounded bg-[#F2E6D3]" />
            <div className="h-2 w-[60%] rounded bg-[#F2E6D3]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlackBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-[#2A2420]/80"># product-team</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div
            key="msg"
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="rounded-lg bg-[#F2E6D3] p-2"
          >
            <p className="mb-1 text-[10px] font-semibold text-[#8A4A24]">Chinmay</p>
            <p>
              Just a quick update — I&apos;ll have the proposal ready tomorrow morning.
              <br />
              <br />
              Let me know if you need anything else!
            </p>
          </motion.div>
        ) : (
          <motion.div key="empty" className="h-16 rounded-lg bg-[#F2E6D3]" />
        )}
      </AnimatePresence>
    </div>
  );
}

function NotionBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-[#2A2420]">Project Update</p>
      <p>
        <span className="text-[#5C534C]">Status:</span> In Progress
      </p>
      <p className="text-[#5C534C]">Update</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="mb-2">&quot;I&apos;ll have the proposal ready tomorrow morning.&quot;</p>
            <p className="text-[#5C534C]">Next Steps</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>Review proposal</li>
              <li>Finalize deck</li>
            </ul>
          </motion.div>
        ) : (
          <div className="h-12 rounded bg-[#F2E6D3]" />
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatGptBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-[#5C534C]">User</p>
      <p className="rounded-lg bg-[#F2E6D3] p-2">
        &quot;Help me draft an update to share with the team.&quot;
      </p>
      <p className="text-[#5C534C]">Assistant</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.div
            key="a"
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            className="rounded-lg border border-[#4A7C6F]/25 bg-[#4A7C6F]/08 p-2"
          >
            Here&apos;s a concise update you can share:
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>Proposal will be ready tomorrow morning.</li>
              <li>Final review in progress.</li>
              <li>Will share by EOD.</li>
            </ul>
          </motion.div>
        ) : (
          <div className="h-14 rounded-lg bg-[#F2E6D3]" />
        )}
      </AnimatePresence>
    </div>
  );
}

function CursorBody({ reveal }: { reveal: boolean }) {
  return (
    <pre className="overflow-hidden font-mono text-[10px] leading-relaxed text-[#4A7C6F]">
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
          <span className="text-[#D3B49B]">{`const update = { … }`}</span>
        )}
      </code>
    </pre>
  );
}

function BrowserBody({ reveal }: { reveal: boolean }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-[#2A2420]">Project Roadmap</p>
      <p className="text-[#5C534C]">Latest update</p>
      <AnimatePresence mode="wait">
        {reveal ? (
          <motion.p key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Proposal will be ready tomorrow morning.
          </motion.p>
        ) : (
          <div className="h-3 w-4/5 rounded bg-[#F2E6D3]" />
        )}
      </AnimatePresence>
      <div className="mt-2 flex h-12 items-end gap-1.5">
        {[40, 65, 45, 80, 55, 70].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-[#4A7C6F]/35"
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
  const reduce = useReducedMotion();
  const reveal = delivered || stage === 'delivering';

  return (
    <>
      {/* Desktop / tablet fan */}
      <div
        className="relative mx-auto hidden max-w-6xl perspective-[1400px] md:block"
        style={{ perspective: '1400px' }}
      >
        <div className="relative flex items-stretch justify-center gap-3 px-2 lg:gap-4">
          {order.map((id, index) => {
            const app = getApp(id);
            const primary = id === activeId;
            const offset = index - (order.length - 1) / 2;
            return (
              <motion.div
                key={id}
                className="h-[280px] w-[150px] shrink-0 lg:h-[300px] lg:w-[168px]"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: primary ? 20 : 10 - Math.abs(offset),
                }}
                animate={
                  reduce
                    ? undefined
                    : {
                        rotateY: primary ? 0 : offset * -4,
                        x: primary ? 0 : offset * 2,
                      }
                }
                transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              >
                <CardChrome id={id} title={app.name} accent={app.accent} primary={primary}>
                  <CardContent id={id} reveal={primary && reveal} />
                </CardChrome>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: single primary card */}
      <div className="mx-auto w-full max-w-sm md:hidden">
        <div className="h-[320px]">
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
