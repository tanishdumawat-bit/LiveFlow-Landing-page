import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  CONTEXT_FLASH_MS,
  ECOSYSTEM_HOLD_MS,
  FLOW_STAGES,
  MANUAL_RESUME_MS,
  STAGE_MS,
  getApp,
  nextAppId,
  type FlowStage,
  type HeroAppId,
  type WorkspaceMode,
} from '../data/heroShowcase';
import { DOWNLOAD_URL } from '../data/apps';
import { MagneticButton } from '../animations/MagneticButton';
import { AppSelector } from './hero/AppSelector';
import { FlowPipeline } from './hero/FlowPipeline';
import { ImmersiveWorkspace } from './hero/ImmersiveWorkspace';
import { FloatingWidget } from './hero/FloatingWidget';
import { LiveTranscript } from './hero/LiveTranscript';

const easeOut = [0.16, 1, 0.3, 1] as const;
const STAGE_ORDER: FlowStage[] = [
  'listening',
  'transcribing',
  'understanding',
  'transforming',
  'delivering',
  'complete',
];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

function StageGlow({ accent, live }: { accent: string; live: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute bottom-[-40%] left-1/2 h-56 w-[72%] -translate-x-1/2 rounded-[100%]"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}40 0%, ${accent}12 35%, transparent 70%)`,
        }}
        animate={
          reduce
            ? undefined
            : {
                opacity: live ? [0.45, 0.8, 0.45] : [0.25, 0.4, 0.25],
                scale: live ? [1, 1.05, 1] : [1, 1.02, 1],
              }
        }
        transition={{ duration: live ? 1.8 : 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export function Hero() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const loopGen = useRef(0);
  const manualUntil = useRef(0);
  const autoPaused = useRef(false);

  const [activeId, setActiveId] = useState<HeroAppId>('gmail');
  const [stage, setStage] = useState<FlowStage | 'idle'>('idle');
  const [mode, setMode] = useState<WorkspaceMode>('focus');
  const [contextFlash, setContextFlash] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const stageY = useTransform(smooth, [0, 1], [0, reduce ? 0 : -12]);
  const bgY = useTransform(smooth, [0, 1], reduce ? ['0%', '0%'] : ['0%', '8%']);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const runFocusRef = useRef<(appId: HeroAppId, gen: number) => void>(() => {});

  const runEcosystem = useCallback(
    (gen: number) => {
      setMode('ecosystem');
      setStage('complete');
      setContextFlash(false);
      schedule(() => {
        if (gen !== loopGen.current) return;
        const wait = autoPaused.current
          ? Math.max(0, manualUntil.current - Date.now())
          : 0;
        schedule(() => {
          if (gen !== loopGen.current) return;
          autoPaused.current = false;
          setMode('focus');
          runFocusRef.current('gmail', gen);
        }, wait);
      }, ECOSYSTEM_HOLD_MS);
    },
    [schedule],
  );

  const runFocus = useCallback(
    (appId: HeroAppId, gen: number) => {
      setActiveId(appId);
      setMode('focus');
      setStage('idle');
      setContextFlash(false);
      setSeconds(0);

      if (reduce) {
        setStage('complete');
        return;
      }

      let elapsed = 280;
      STAGE_ORDER.forEach((s) => {
        schedule(() => {
          if (gen !== loopGen.current) return;
          setStage(s);
          if (s === 'understanding') {
            setContextFlash(true);
            schedule(() => {
              if (gen !== loopGen.current) return;
              setContextFlash(false);
            }, CONTEXT_FLASH_MS);
          }
        }, elapsed);
        elapsed += STAGE_MS[s];
      });

      schedule(() => {
        if (gen !== loopGen.current) return;
        const wait =
          autoPaused.current && Date.now() < manualUntil.current
            ? Math.max(200, manualUntil.current - Date.now())
            : 0;

        schedule(() => {
          if (gen !== loopGen.current) return;
          autoPaused.current = false;
          if (appId === 'browser') runEcosystem(gen);
          else runFocusRef.current(nextAppId(appId), gen);
        }, wait);
      }, elapsed);
    },
    [reduce, schedule, runEcosystem],
  );

  runFocusRef.current = runFocus;

  const startLoop = useCallback(
    (appId: HeroAppId) => {
      clearTimers();
      const gen = ++loopGen.current;
      runFocus(appId, gen);
    },
    [clearTimers, runFocus],
  );

  useEffect(() => {
    const boot = window.setTimeout(() => startLoop('gmail'), reduce ? 0 : 600);
    return () => {
      window.clearTimeout(boot);
      clearTimers();
    };
  }, [startLoop, clearTimers, reduce]);

  useEffect(() => {
    if (reduce) return;
    if (stage !== 'listening' && stage !== 'transcribing') return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [stage, reduce]);

  const onSelect = (id: HeroAppId) => {
    autoPaused.current = true;
    manualUntil.current = Date.now() + MANUAL_RESUME_MS;
    startLoop(id);
  };

  const accent = getApp(activeId).accent;
  const stageLabel =
    mode === 'ecosystem'
      ? 'Ecosystem'
      : FLOW_STAGES.find((s) => s.id === stage)?.label ?? 'Ready';
  const live = stage === 'listening' || stage === 'transcribing';

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:pb-14 lg:pt-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute inset-0 scale-[1.06] bg-cover bg-[center_35%]"
          style={{
            y: bgY,
            backgroundImage: 'url(/assets/hero-desk.png)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg,
                rgba(255,255,255,0.55) 0%,
                rgba(255,255,255,0.28) 18%,
                rgba(255,255,255,0.18) 40%,
                rgba(255,255,255,0.35) 62%,
                rgba(255,255,255,0.82) 100%
              ),
              radial-gradient(ellipse 70% 45% at 50% 22%, rgba(255,255,255,0.55), transparent 68%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.55, ease: easeOut }}
            className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#C4501E] uppercase"
          >
            A voice layer for your Mac
          </motion.p>

          <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.65rem]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="inline-block text-[#2A2420]"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.85, ease: easeOut }}
              >
                One voice.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block font-serif italic text-[#C4501E]"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.9, ease: easeOut }}
              >
                Every workflow.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.7, ease: easeOut }}
            className="mt-4 max-w-lg text-base leading-relaxed text-[#3F434A] sm:text-lg"
          >
            Live Flow understands your context and puts your words exactly where they need to be.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.55, ease: easeOut }}
            className="mt-7 flex flex-row flex-wrap items-center justify-center gap-3"
          >
            <MagneticButton
              href={DOWNLOAD_URL}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#C4501E] px-6 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(196,80,30,0.28)] hover:bg-[#8A4A24]"
            >
              <DownloadIcon />
              Download for Mac
            </MagneticButton>
            <motion.a
              href="#context"
              whileHover={reduce ? undefined : { y: -1 }}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-5 text-sm font-medium text-[#2A2420] shadow-[0_6px_20px_rgba(42,36,32,0.06)] backdrop-blur-md transition hover:bg-white"
            >
              <PlayIcon />
              See how it works
            </motion.a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-5 flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[#3F434A]"
          >
            {[
              'Works across your Mac',
              'Bring your own STT/API key',
              'Designed for privacy',
              'Built for macOS',
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#C4501E]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="relative mt-10 w-full"
          style={{ y: stageY }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.85, ease: easeOut }}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 px-3 py-7 shadow-[0_30px_90px_rgba(42,36,32,0.12)] backdrop-blur-xl sm:rounded-[32px] sm:px-6 sm:py-9">
            <StageGlow accent={accent} live={live} />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
              <div className="flex w-full flex-col items-center gap-3">
                <AppSelector activeId={activeId} onSelect={onSelect} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeId + stage + mode}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E6E8EC]/90 bg-white/90 px-3 text-[11px] font-medium text-[#2A2420]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                    />
                    {mode === 'ecosystem' ? 'All apps' : getApp(activeId).name}
                    <span className="text-[#C8CCD4]">·</span>
                    {stageLabel}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="mt-5 w-full max-w-xl">
                <FlowPipeline stage={stage === 'complete' ? 'delivering' : stage} activeAppId={activeId} />
              </div>

              <div className="mt-5 w-full">
                <LiveTranscript
                  stage={stage}
                  accent={accent}
                  appName={getApp(activeId).name}
                  contextFlash={contextFlash}
                />
              </div>

              <div className="relative mt-6 w-full">
                <ImmersiveWorkspace
                  activeId={activeId}
                  stage={stage}
                  mode={mode}
                  contextFlash={contextFlash}
                  onSelect={onSelect}
                />
              </div>

              <div className="relative z-20 -mt-6 w-full max-w-lg sm:-mt-8">
                <FloatingWidget
                  stage={stage === 'complete' ? 'delivering' : stage}
                  activeAppId={activeId}
                  seconds={seconds}
                  onMicClick={() => onSelect(activeId)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
