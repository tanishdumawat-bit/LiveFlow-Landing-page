import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  DELIVER_HOLD_MS,
  FLOW_STAGES,
  HERO_APPS,
  LOOP_PAUSE_MS,
  STAGE_DURATION_MS,
  getApp,
  type FlowStage,
  type HeroAppId,
} from '../data/heroShowcase';
import { DOWNLOAD_URL } from '../data/apps';
import { MagneticButton } from '../animations/MagneticButton';
import { AppSelector } from './hero/AppSelector';
import { FlowPipeline } from './hero/FlowPipeline';
import { AppCardsRow } from './hero/AppCards';
import { FlowConnections } from './hero/FlowConnections';
import { FloatingWidget } from './hero/FloatingWidget';
import { LiveTranscript } from './hero/LiveTranscript';

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const loopGen = useRef(0);

  const [activeId, setActiveId] = useState<HeroAppId>('gmail');
  const [stage, setStage] = useState<FlowStage | 'idle'>('idle');
  const [delivered, setDelivered] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const cardsY = useTransform(smooth, [0, 1], [0, reduce ? 0 : -28]);
  const cardsScale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 0.97]);
  const widgetY = useTransform(smooth, [0, 1], [0, reduce ? 0 : 18]);
  const glowOpacity = useTransform(smooth, [0, 0.5], [1, 0.45]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const runLoop = useCallback(
    (appId: HeroAppId) => {
      clearTimers();
      const gen = ++loopGen.current;
      setActiveId(appId);
      setDelivered(false);
      setSeconds(0);
      setStage('idle');

      const schedule = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms));
      };

      if (reduce) {
        setStage('delivering');
        setDelivered(true);
        setSeconds(4);
        return;
      }

      let elapsed = 280;
      FLOW_STAGES.forEach((s, i) => {
        schedule(() => {
          if (gen !== loopGen.current) return;
          setStage(s.id);
          if (s.id === 'delivering') setDelivered(true);
        }, elapsed);
        elapsed += STAGE_DURATION_MS + (i === 0 ? 180 : 0);
      });

      schedule(() => {
        if (gen !== loopGen.current) return;
        setDelivered(false);
        setStage('idle');
        setSeconds(0);
      }, elapsed + DELIVER_HOLD_MS);

      schedule(() => {
        if (gen !== loopGen.current) return;
        runLoop(appId);
      }, elapsed + DELIVER_HOLD_MS + LOOP_PAUSE_MS);
    },
    [clearTimers, reduce],
  );

  useEffect(() => {
    if (reduce) return;
    if (stage !== 'listening' && stage !== 'transcribing') return;
    const id = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [stage, reduce]);

  useEffect(() => {
    const boot = window.setTimeout(() => runLoop('gmail'), reduce ? 0 : 900);
    return () => {
      window.clearTimeout(boot);
      clearTimers();
    };
  }, [runLoop, clearTimers, reduce]);

  const onSelect = (id: HeroAppId) => {
    runLoop(id);
  };

  const accent = getApp(activeId).accent;
  const cardOrder = useMemo(() => HERO_APPS.map((a) => a.id), []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: glowOpacity }}>
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 45% at 50% 12%, rgba(196,80,30,0.10), transparent 55%),
              radial-gradient(ellipse 50% 40% at 50% 70%, ${accent}14, transparent 55%),
              radial-gradient(ellipse 80% 45% at 50% 100%, rgba(242,230,211,0.9), transparent)
            `,
          }}
        />
        <div className="absolute bottom-[8%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 sm:h-[640px] sm:w-[640px]">
          {[0.15, 0.28, 0.42, 0.58].map((op, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: `rgba(42,36,32,${op * 0.12})`,
                transform: `scale(${0.45 + i * 0.18})`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.05, duration: 0.55, ease: easeOut }}
          className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C4501E] uppercase"
        >
          A voice layer for your Mac
        </motion.p>

        <div className="max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="inline-block text-[#2A2420]"
                initial={{ y: '110%', filter: 'blur(10px)', opacity: 0 }}
                animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.85, ease: easeOut }}
              >
                One voice.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block font-serif italic text-[#C4501E]"
                initial={{ y: '110%', filter: 'blur(10px)', opacity: 0 }}
                animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.9, ease: easeOut }}
              >
                Every workflow.
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.42, duration: 0.7, ease: easeOut }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#5C534C] sm:text-lg"
          >
            Live Flow understands your context and puts your words exactly where they need to be.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: easeOut }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            href={DOWNLOAD_URL}
            className="inline-flex items-center rounded-full bg-[#C4501E] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(196,80,30,0.25)] hover:bg-[#8A4A24]"
          >
            Download for Mac
          </MagneticButton>
          <motion.a
            href="#how-it-works"
            whileHover={reduce ? undefined : { y: -1 }}
            className="inline-flex items-center rounded-full border border-[#E9DECB] bg-white/70 px-5 py-3 text-sm font-medium text-[#2A2420] transition hover:border-[#D3B49B] hover:bg-white"
          >
            See how it works
          </motion.a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.55, ease: easeOut }}
          className="mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-[#5C534C] sm:text-[13px]"
        >
          {[
            'Works across your Mac',
            'Bring your own STT/API key',
            'Designed for privacy',
            'Built for macOS',
          ].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#C4501E]/70" aria-hidden="true" />
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.55, ease: easeOut }}
          className="mt-10 w-full"
        >
          <AppSelector activeId={activeId} onSelect={onSelect} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.78, duration: 0.55 }}
          className="mt-8 w-full"
        >
          <FlowPipeline stage={stage} activeAppId={activeId} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.55, ease: easeOut }}
          className="mt-6 w-full"
        >
          <LiveTranscript stage={stage} accent={accent} />
        </motion.div>

        <motion.div
          className="relative mt-8 w-full sm:mt-10"
          style={{ y: cardsY, scale: cardsScale }}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.98, duration: 0.85, ease: easeOut }}
        >
          <FlowConnections accent={accent} />
          <AppCardsRow
            activeId={activeId}
            stage={stage}
            delivered={delivered}
            order={cardOrder}
          />
        </motion.div>

        <motion.div
          className="relative z-20 mt-10 w-full sm:mt-14"
          style={{ y: widgetY }}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.12, duration: 0.8, ease: easeOut }}
        >
          <FloatingWidget
            stage={stage}
            activeAppId={activeId}
            seconds={seconds}
            onMicClick={() => runLoop(activeId)}
          />
        </motion.div>

        <motion.a
          href="#difference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="mt-12 flex flex-col items-center gap-1.5 text-xs tracking-[0.14em] text-[#5C534C] uppercase transition hover:text-[#2A2420]"
        >
          Scroll to explore
          <motion.span
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-base normal-case"
          >
            ↓
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
