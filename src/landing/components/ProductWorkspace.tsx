import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SHARED_SPEECH, WORKSPACE_APPS, type WorkspaceAppId } from '../data/workspace';
import { FlowPath } from '../animations/FlowPath';
import { VoiceFlow } from '../animations/VoiceFlow';
import { TextTransform } from '../animations/TextTransform';
import { RevealHeadline } from '../animations/RevealHeadline';
import { AppSurface } from './AppSurface';

type Phase = 'idle' | 'listening' | 'raw' | 'processing' | 'output';

export function ProductWorkspace() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<WorkspaceAppId>('gmail');
  const [phase, setPhase] = useState<Phase>('idle');
  const [autoPlay, setAutoPlay] = useState(true);
  const timers = useRef<number[]>([]);
  const autoPlayRef = useRef(true);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  const active = useMemo(
    () => WORKSPACE_APPS.find((a) => a.id === activeId) ?? WORKSPACE_APPS[0],
    [activeId],
  );

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const runDemoRef = useRef<(appId: WorkspaceAppId, options?: { advance?: boolean }) => void>(
    () => undefined,
  );

  const runDemo = useCallback(
    (appId: WorkspaceAppId, options?: { advance?: boolean }) => {
      clearTimers();
      setActiveId(appId);
      setPhase('idle');

      const schedule = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms));
      };

      if (reduce) {
        setPhase('output');
        if (options?.advance !== false) {
          schedule(() => {
            if (!autoPlayRef.current) return;
            const idx = WORKSPACE_APPS.findIndex((a) => a.id === appId);
            const next = WORKSPACE_APPS[(idx + 1) % WORKSPACE_APPS.length];
            if (next) runDemoRef.current(next.id, { advance: true });
          }, 2800);
        }
        return;
      }

      schedule(() => setPhase('listening'), 500);
      schedule(() => setPhase('raw'), 1400);
      schedule(() => setPhase('processing'), 2600);
      schedule(() => setPhase('output'), 3900);

      if (options?.advance !== false) {
        schedule(() => {
          if (!autoPlayRef.current) return;
          const idx = WORKSPACE_APPS.findIndex((a) => a.id === appId);
          const next = WORKSPACE_APPS[(idx + 1) % WORKSPACE_APPS.length];
          if (next) runDemoRef.current(next.id, { advance: true });
        }, 6200);
      }
    },
    [clearTimers, reduce],
  );

  runDemoRef.current = runDemo;

  useEffect(() => {
    const boot = window.setTimeout(() => runDemo('gmail', { advance: true }), 200);
    return () => {
      window.clearTimeout(boot);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const selectApp = (id: WorkspaceAppId) => {
    setAutoPlay(false);
    autoPlayRef.current = false;
    runDemo(id, { advance: false });
    const resume = window.setTimeout(() => {
      setAutoPlay(true);
      autoPlayRef.current = true;
      const idx = WORKSPACE_APPS.findIndex((a) => a.id === id);
      const next = WORKSPACE_APPS[(idx + 1) % WORKSPACE_APPS.length];
      if (next) runDemo(next.id, { advance: true });
    }, 8000);
    timers.current.push(resume);
  };

  const flowState =
    phase === 'listening'
      ? 'listening'
      : phase === 'raw'
        ? 'transcribing'
        : phase === 'processing'
          ? 'processing'
          : phase === 'output'
            ? 'complete'
            : 'idle';

  return (
    <section id="workspace" className="relative px-4 py-20 sm:px-6 lg:py-28" aria-label="Live Flow product workspace">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-[#9b87ff] uppercase">
            The Live Flow workspace
          </p>
          <RevealHeadline
            as="h2"
            lines={['One voice.', 'Every workflow.']}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          />
          <p className="mt-4 text-base text-[#8a8a93] sm:text-lg">
            Watch Live Flow visit each app — one destination at a time. Same speech. Different result.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Applications"
        >
          {WORKSPACE_APPS.map((app) => {
            const selected = app.id === activeId;
            return (
              <button
                key={app.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectApp(app.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  selected ? 'text-white' : 'text-[#8a8a93] hover:text-white'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="workspace-app-pill"
                    className="absolute inset-0 rounded-full border border-white/12 bg-[#121214]"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: app.accent }} />
                  {app.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0c] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.1),transparent_55%)]" />

          <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8">
            {/* Live Flow stays visible */}
            <motion.div
              layout
              className="rounded-[24px] border border-[rgba(124,92,255,0.35)] bg-[#0d0d0f] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] glow-violet"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      phase === 'listening' || phase === 'raw' ? 'bg-[#ff3b30] glow-record' : 'bg-[#9b87ff]'
                    }`}
                  />
                  <p className="text-xs font-semibold tracking-tight text-white">Live Flow</p>
                </div>
                <p className="text-[10px] text-[#8a8a93]">
                  {phase === 'idle' && 'Ready'}
                  {phase === 'listening' && 'Listening…'}
                  {phase === 'raw' && 'Transcribing…'}
                  {phase === 'processing' && `Adapting · ${active.name}`}
                  {phase === 'output' && `→ ${active.name}`}
                </p>
              </div>

              <VoiceFlow state={flowState} className="mx-auto h-10 w-full" />

              <div className="mt-3 min-h-[88px] rounded-xl border border-white/8 bg-[#121214] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8a8a93]">Same speech</p>
                <AnimatePresence mode="wait">
                  {(phase === 'raw' || phase === 'processing' || phase === 'output') && (
                    <motion.div
                      key={`speech-${phase === 'processing' ? 'proc' : 'stable'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5"
                    >
                      <TextTransform
                        from={SHARED_SPEECH}
                        to={SHARED_SPEECH}
                        phase={phase === 'processing' ? 'processing' : 'raw'}
                        className="text-[13px]"
                      />
                    </motion.div>
                  )}
                  {phase === 'listening' && (
                    <motion.p
                      key="listening"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-[12px] text-[#8a8a93]"
                    >
                      Capturing voice…
                    </motion.p>
                  )}
                  {phase === 'idle' && (
                    <p className="mt-2 text-[12px] text-[#8a8a93]">Speak naturally</p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-[#8a8a93]">
                <span>
                  Context · <span className="text-white">{active.name}</span>
                </span>
                <span>{active.tone}</span>
              </div>

              <div className="mt-4">
                <FlowPath
                  active={phase !== 'idle'}
                  intensity={phase === 'output' ? 1 : 0.6}
                  progress={1}
                  color={active.accent}
                  className="h-8 w-full"
                />
              </div>
            </motion.div>

            {/* Active destination — always fully on-screen */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[24px] border bg-[#121214]"
                style={{ borderColor: `${active.accent}55` }}
              >
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <span className="h-2 w-2 rounded-full" style={{ background: active.accent }} />
                    {active.name}
                  </div>
                  <span className="text-[10px] text-[#8a8a93]">{active.tone}</span>
                </div>
                <div className="min-h-[240px] sm:min-h-[280px]">
                  <AppSurface app={active} active output={active.output} phase={phase} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-white/8 px-4 py-3 text-[11px] text-[#8a8a93] sm:px-5">
            <span>
              {autoPlay ? 'Autoplaying' : 'Paused'} · Voice → {active.name}
            </span>
            <button
              type="button"
              onClick={() => {
                if (autoPlay) {
                  setAutoPlay(false);
                  autoPlayRef.current = false;
                } else {
                  setAutoPlay(true);
                  autoPlayRef.current = true;
                  const idx = WORKSPACE_APPS.findIndex((a) => a.id === activeId);
                  const next = WORKSPACE_APPS[(idx + 1) % WORKSPACE_APPS.length];
                  if (next) runDemo(next.id, { advance: true });
                }
              }}
              className="rounded-full border border-white/12 px-3 py-1 text-white transition hover:border-[rgba(124,92,255,0.5)]"
            >
              {autoPlay ? 'Pause tour' : 'Resume tour'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
