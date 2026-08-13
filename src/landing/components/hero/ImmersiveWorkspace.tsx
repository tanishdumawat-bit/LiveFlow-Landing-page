import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  CAMERA_EASE,
  HERO_APPS,
  HERO_OUTPUTS,
  getApp,
  type FlowStage,
  type HeroAppId,
  type WorkspaceMode,
} from '../../data/heroShowcase';
import { FlowPath } from './FlowPath';
import { mix, theme } from '../../../theme/tokens';
import { AppIconBadge } from '../shared/AppIcon';

type Props = {
  activeId: HeroAppId;
  stage: FlowStage | 'idle';
  mode: WorkspaceMode;
  contextFlash: boolean;
  onSelect: (id: HeroAppId) => void;
};

function AppBody({ id, reveal }: { id: HeroAppId; reveal: boolean }) {
  const out = HERO_OUTPUTS[id];

  if (id === 'gmail') {
    return (
      <div className="space-y-1.5 text-[11px] leading-relaxed">
        <p>
          <span className="text-muted">To:</span> sarah@company.com
        </p>
        <AnimatePresence mode="wait">
          {reveal ? (
            <motion.div
              key="g"
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="space-y-1 whitespace-pre-line text-ink"
            >
              {out.lines.join('\n')}
            </motion.div>
          ) : (
            <motion.div key="e" className="space-y-1.5 pt-1">
              <div className="h-2 w-[75%] rounded bg-surface-alt" />
              <div className="h-2 w-full rounded bg-surface-alt" />
              <div className="h-2 w-[55%] rounded bg-surface-alt" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (id === 'slack') {
    return (
      <div className="space-y-2 text-[11px]">
        <p className="font-medium text-ink/80">{out.title}</p>
        <AnimatePresence mode="wait">
          {reveal ? (
            <motion.div
              key="s"
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="rounded-lg bg-surface-alt/90 p-2 text-ink"
            >
              <p className="mb-1 text-[10px] font-semibold text-primary-dark">Chinmay</p>
              <p>{out.lines[0]}</p>
            </motion.div>
          ) : (
            <div className="h-14 rounded-lg bg-surface-alt/80" />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (id === 'notion') {
    return (
      <div className="space-y-1.5 text-[11px]">
        <p className="text-sm font-semibold tracking-wide text-ink">{out.title}</p>
        <AnimatePresence mode="wait">
          {reveal ? (
            <motion.div
              key="n"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1 text-ink"
            >
              <p className="text-muted">Status</p>
              <p className="font-medium">In progress</p>
              <p className="pt-1 text-muted">Next update</p>
              <p className="font-medium">Pending</p>
            </motion.div>
          ) : (
            <div className="h-12 rounded bg-surface-alt/80" />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (id === 'chatgpt') {
    return (
      <div className="space-y-2 text-[11px]">
        <p className="text-muted">You</p>
        <AnimatePresence mode="wait">
          {reveal ? (
            <motion.p
              key="c"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="rounded-lg bg-surface-alt/90 p-2 text-ink"
            >
              {out.lines[0]}
            </motion.p>
          ) : (
            <div className="h-10 rounded-lg bg-surface-alt/80" />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (id === 'cursor') {
    return (
      <pre className="overflow-hidden font-mono text-[10px] leading-relaxed text-success">
        <code>
          {reveal ? (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {out.lines.join('\n')}
            </motion.span>
          ) : (
            <span className="text-filler">// waiting for instruction…</span>
          )}
        </code>
      </pre>
    );
  }

  return (
    <div className="space-y-2 text-[11px]">
      <div className="flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-2.5 py-1">
        <span className="text-muted">⌕</span>
        <AnimatePresence mode="wait">
          {reveal ? (
            <motion.span
              key="b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="truncate text-ink"
            >
              {out.lines[0]}
            </motion.span>
          ) : (
            <span className="text-filler">Search the web…</span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function WorkspacePane({
  id,
  primary,
  ecosystem,
  reveal,
  reduce,
  onSelect,
  floatSeed,
}: {
  id: HeroAppId;
  primary: boolean;
  ecosystem: boolean;
  reveal: boolean;
  reduce: boolean;
  onSelect: (id: HeroAppId) => void;
  floatSeed: number;
}) {
  const app = getApp(id);
  const scale = ecosystem ? 0.72 : primary ? 1.08 : 0.62;
  const opacity = ecosystem ? 0.85 : primary ? 1 : 0.38;
  const blur = ecosystem ? 0 : primary ? 0 : 2.5;
  const z = ecosystem ? 2 : primary ? 30 : 5;
  const rot = ecosystem ? 0 : primary ? 0 : id === 'slack' || id === 'chatgpt' ? -2.5 : 2.5;
  const idle = !primary && !ecosystem;

  return (
    <motion.button
      type="button"
      id={`hero-card-${id}`}
      aria-label={`Focus ${app.name}`}
      onClick={() => onSelect(id)}
      className="absolute w-[200px] origin-center -translate-x-1/2 -translate-y-1/2 text-left sm:w-[220px] lg:w-[240px]"
      style={{
        left: `${app.x}%`,
        top: `${app.y}%`,
        zIndex: z,
      }}
      initial={false}
      animate={{
        scale,
        opacity,
        filter: `blur(${blur}px)`,
        rotate: rot,
      }}
      transition={{
        duration: reduce ? 0 : 0.85,
        ease: CAMERA_EASE,
      }}
    >
      <motion.div
        animate={
          reduce || !idle
            ? { y: 0 }
            : { y: [0, -5, 0, 4, 0] }
        }
        transition={
          reduce || !idle
            ? { duration: 0.4 }
            : {
                duration: 6 + floatSeed,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: floatSeed * 0.6,
              }
        }
      >
        <div
          className="relative overflow-hidden rounded-[18px] bg-white/75 backdrop-blur-xl"
          style={{
            boxShadow: primary
              ? `0 20px 50px ${mix(theme.ink, 14)}, 0 0 0 1px ${app.accent}40, 0 0 28px ${app.accent}18`
              : ecosystem
                ? `0 10px 28px ${mix(theme.ink, 8)}, 0 0 0 1px ${app.accent}22`
                : `0 8px 24px ${mix(theme.ink, 6)}`,
            border: primary ? `1px solid ${app.accent}55` : `1px solid ${mix(theme.border, 70)}`,
          }}
        >
          {primary && !ecosystem && !reduce && (
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-[18px]"
              style={{ border: `1px solid ${app.accent}` }}
              animate={{ opacity: [0.5, 0], scale: [1, 1.04] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <div className="flex h-9 items-center gap-2 px-3">
            <AppIconBadge name={app.name} accent={app.accent} size="xs" />
            <span className="text-[10px] font-semibold tracking-wide text-ink">{app.name}</span>
            {primary && !ecosystem && (
              <span className="ml-auto flex items-center gap-1 text-[9px] font-medium tracking-wide text-muted uppercase">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: app.accent, boxShadow: `0 0 6px ${app.accent}` }}
                />
                Active
              </span>
            )}
          </div>
          <div className="overflow-hidden px-3 pb-3 pt-1 sm:min-h-[132px]">
            <AppBody id={id} reveal={reveal && (primary || ecosystem)} />
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

/**
 * One spatial workspace — apps as destinations, Live Flow as anchor, camera follows focus.
 */
export function ImmersiveWorkspace({
  activeId,
  stage,
  mode,
  contextFlash,
  onSelect,
}: Props) {
  const reduce = !!useReducedMotion();
  const active = getApp(activeId);
  const reveal = stage === 'delivering' || stage === 'complete';
  const ecosystem = mode === 'ecosystem';

  // Camera: pull active app toward center; pull back for ecosystem
  const camX = ecosystem ? 0 : (50 - active.x) * 3.4;
  const camY = ecosystem ? 0 : (48 - active.y) * 2.8;
  const camScale = ecosystem ? 0.92 : 1.04;
  const camRot = ecosystem ? 0 : (active.x - 50) * -0.035;

  return (
    <>
      {/* Desktop / tablet spatial world */}
      <div className="relative mx-auto hidden w-full max-w-5xl md:block">
        <div
          className="relative h-[440px] overflow-hidden rounded-[28px] sm:h-[480px] lg:h-[520px]"
          style={{
            perspective: '1400px',
            background:
              `radial-gradient(ellipse 80% 60% at 50% 45%, ${mix(theme.card, 55)} 0%, ${mix(theme.surfaceAlt, 35)} 45%, transparent 75%)`,
          }}
        >
          {/* Soft ambient depth */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                `radial-gradient(circle at 30% 25%, ${mix(theme.primary, 8)}, transparent 40%), radial-gradient(circle at 70% 70%, ${mix(theme.accent, 18)}, transparent 42%)`,
            }}
          />

          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              x: camX,
              y: camY,
              scale: camScale,
              rotateZ: camRot,
            }}
            transition={{ duration: reduce ? 0 : 0.95, ease: CAMERA_EASE }}
          >
            <FlowPath
              activeId={activeId}
              stage={stage}
              mode={mode}
              to={{ x: active.x, y: active.y }}
              from={{ x: 50, y: 52 }}
            />

            {HERO_APPS.map((app, i) => (
              <WorkspacePane
                key={app.id}
                id={app.id}
                primary={app.id === activeId}
                ecosystem={ecosystem}
                reveal={reveal}
                reduce={reduce}
                onSelect={onSelect}
                floatSeed={i}
              />
            ))}

            {/* Live Flow anchor — overlaps the world */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[52%] z-40 -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: stage === 'listening' ? 1.04 : ecosystem ? 1.1 : 1,
                opacity: 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-cta-lg"
                  style={{
                    background: theme.micOrb,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" />
                    <path
                      d="M5 11a7 7 0 0 0 14 0"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 18v3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase">
                  Live Flow
                </p>
                <AnimatePresence>
                  {contextFlash && !ecosystem && (
                    <motion.p
                      key="ctx"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 rounded-full border border-white/80 bg-white/90 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-ink shadow-sm"
                    >
                      Context · {active.name}
                    </motion.p>
                  )}
                </AnimatePresence>
                {ecosystem && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-center text-xs font-medium text-ink"
                  >
                    One voice.
                    <span className="font-serif italic text-primary"> Every workflow.</span>
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: focus card + world as depth backdrop */}
      <div className="mx-auto w-full max-w-sm md:hidden">
        <div className="relative overflow-hidden rounded-[24px] bg-white/70 p-4 shadow-card-md backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <AppIconBadge name={active.name} accent={active.accent} size="sm" />
            <span className="text-sm font-semibold text-ink">{active.name}</span>
            {contextFlash && (
              <span className="ml-auto text-[10px] font-medium tracking-wide text-muted uppercase">
                Context
              </span>
            )}
          </div>
          <div className="min-h-[180px]">
            <AppBody id={activeId} reveal={reveal} />
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {HERO_APPS.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-label={a.name}
                onClick={() => onSelect(a.id)}
                className="h-1.5 w-1.5 rounded-full transition"
                style={{
                  background: a.id === activeId ? a.accent : theme.filler,
                  transform: a.id === activeId ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
