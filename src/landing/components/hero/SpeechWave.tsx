import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { KIND_META, type TokenKind } from '../../data/orbit';
import { WAVE_SCENES, type WaveWord } from '../../data/wave';
import { VoiceFlow } from '../../animations/VoiceFlow';
import { mix } from '../../../theme/tokens';

export type WavePhase = 'inflow' | 'wave' | 'punctuate' | 'mark' | 'clean' | 'hold';

const PHASE_MS: Record<WavePhase, number> = {
  inflow: 2200,
  wave: 1100,
  punctuate: 1600,
  mark: 2000,
  clean: 1800,
  hold: 2600,
};

const PHASE_ORDER: WavePhase[] = ['inflow', 'wave', 'punctuate', 'mark', 'clean', 'hold'];

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS: Record<WavePhase, string> = {
  inflow: 'Listening',
  wave: 'Listening',
  punctuate: 'Punctuating',
  mark: 'Cleaning up',
  clean: 'Ready to send',
  hold: 'Ready to send',
};

function ampFor(phase: WavePhase) {
  if (phase === 'inflow' || phase === 'wave') return 15;
  if (phase === 'punctuate') return 8;
  if (phase === 'mark') return 5;
  return 0;
}

function displayText(word: WaveWord, phase: WavePhase) {
  const settled = phase === 'clean' || phase === 'hold';
  const raw = settled && word.clean != null && word.clean !== '' ? word.clean : word.spoken;
  if ((phase === 'punctuate' || phase === 'mark' || settled) && word.cap) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return raw;
}

function Word({
  word,
  index,
  phase,
  time,
  revealed,
  reduce,
}: {
  word: WaveWord;
  index: number;
  phase: WavePhase;
  time: number;
  revealed: boolean;
  reduce: boolean;
}) {
  const dropped = word.clean === null;
  const gone = dropped && (phase === 'clean' || phase === 'hold');
  const tagged = phase === 'mark' && word.kind !== 'keep';
  const meta = KIND_META[word.kind];
  const amp = ampFor(phase);
  const y = reduce ? 0 : Math.sin(index * 0.62 + time * 2.35) * amp;
  const showPunct = word.punct && phase !== 'inflow' && phase !== 'wave';
  const text = displayText(word, phase);

  if (!revealed) return null;

  return (
    <motion.span
      layout
      className="relative inline-block overflow-hidden align-baseline"
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{
        opacity: gone ? 0 : 1,
        y: gone ? 18 : y,
        scale: gone ? 0.9 : tagged ? 1.03 : 1,
        filter: gone ? 'blur(6px)' : 'blur(0px)',
        maxWidth: gone ? 0 : 480,
        marginRight: gone ? 0 : '0.28em',
      }}
      transition={{ duration: 0.48, ease: EASE, layout: { duration: 0.45, ease: EASE } }}
      style={{
        color: tagged ? meta.color : 'var(--ink)',
        textDecoration: tagged && dropped ? 'line-through' : 'none',
        background: tagged ? mix(meta.soft, 78) : 'transparent',
        borderRadius: 6,
        padding: tagged ? '0 3px' : 0,
      }}
    >
      {tagged && (
        <motion.span
          initial={{ opacity: 0, y: 8, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-5 left-1/2 hidden -translate-x-1/2 rounded-full px-1.5 py-px text-[8px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase sm:inline"
          style={{
            color: meta.color,
            background: mix(meta.soft, 95),
            boxShadow: `0 0 0 1px ${mix(meta.color, 28)}`,
          }}
        >
          {word.kind}
        </motion.span>
      )}
      <span className={phase === 'clean' || phase === 'hold' ? 'font-medium' : ''}>{text}</span>
      <AnimatePresence>
        {showPunct && (
          <motion.span
            key={word.punct}
            initial={{ opacity: 0, scale: 0.3, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className="font-serif text-primary italic"
          >
            {word.punct}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

/**
 * First-view WhisperFlow beat: speech arrives on a wave, punctuation pops,
 * fillers / corrections / repeats get marked, then the sentence settles clean.
 */
export function SpeechWave() {
  const reduce = !!useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<WavePhase>(reduce ? 'hold' : 'inflow');
  const [time, setTime] = useState(0);
  const [reveal, setReveal] = useState(reduce ? 99 : 0);
  const phaseRef = useRef<WavePhase>(reduce ? 'hold' : 'inflow');
  const sceneRef = useRef(0);
  const startRef = useRef(0);
  const scene = WAVE_SCENES[sceneIndex]!;

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let lastPaint = 0;
    startRef.current = 0;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const current = phaseRef.current;
      const elapsed = now - startRef.current;
      const budget = PHASE_MS[current];
      const words = WAVE_SCENES[sceneRef.current]!.words.length;
      if (now - lastPaint > 32) {
        lastPaint = now;
        setTime(now / 1000);
        if (current === 'inflow') {
          setReveal((elapsed / budget) * words + 0.4);
        } else {
          setReveal(words);
        }
      }
      if (elapsed >= budget) {
        const i = PHASE_ORDER.indexOf(current);
        if (i === PHASE_ORDER.length - 1) {
          sceneRef.current = (sceneRef.current + 1) % WAVE_SCENES.length;
          setSceneIndex(sceneRef.current);
          phaseRef.current = 'inflow';
          setPhase('inflow');
          setReveal(0);
        } else {
          const next = PHASE_ORDER[i + 1]!;
          phaseRef.current = next;
          setPhase(next);
        }
        startRef.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const live = phase === 'inflow' || phase === 'wave';
  const marks = (['filler', 'correction', 'repetition'] as Exclude<TokenKind, 'keep'>[]).map(
    (kind) => ({
      kind,
      on: phase === 'mark' || phase === 'clean',
    }),
  );

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <VoiceFlow
            state={live ? 'listening' : phase === 'hold' ? 'complete' : 'processing'}
            className="h-7 w-28"
            showParticles={false}
          />
          <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
            {STATUS[phase]}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {marks.map((m) => (
            <span
              key={m.kind}
              className="rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase"
              style={{
                color: KIND_META[m.kind].color,
                background: mix(KIND_META[m.kind].soft, 88),
                opacity: m.on ? 1 : 0.35,
              }}
            >
              {KIND_META[m.kind].label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]">
        <p className="text-[1.28rem] leading-[1.7] tracking-[-0.02em] text-ink sm:text-[1.7rem] sm:leading-[1.65] lg:text-[2.05rem] lg:leading-[1.6]">
          {scene.words.map((word, i) => (
            <Word
              key={`${scene.id}-${word.id}`}
              word={word}
              index={i}
              phase={phase}
              time={time}
              revealed={reduce || i < reveal}
              reduce={reduce}
            />
          ))}
          {live && !reduce && (
            <motion.span
              aria-hidden="true"
              className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] bg-primary"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          )}
        </p>
      </div>
    </div>
  );
}
