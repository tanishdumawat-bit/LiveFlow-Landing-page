import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ORBIT_APPS } from '../data/apps';
import { VoiceFlow } from './VoiceFlow';

const SAMPLE: Record<string, string> = {
  slack: 'Quick update — testing looks good.',
  gmail: 'Hi Alex,\n\nSharing a quick testing update.',
  cursor: 'Summarize current testing status.',
  notion: '## Testing update\nProgressing well.',
  meet: 'Shared update: testing is progressing.',
  notes: 'Testing update — progressing well.',
  discord: 'hey — quick testing update',
};

type AppOrbitProps = {
  active?: boolean;
};

export function AppOrbit({ active = true }: AppOrbitProps) {
  const reduce = useReducedMotion();
  const [focus, setFocus] = useState(0);
  const apps = useMemo(() => [...ORBIT_APPS], []);

  useEffect(() => {
    if (!active || reduce) return;
    const id = window.setInterval(() => {
      setFocus((i) => (i + 1) % apps.length);
    }, 2600);
    return () => clearInterval(id);
  }, [active, reduce, apps.length]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" style={{ perspective: 900 }}>
      <div className="absolute inset-[18%] rounded-full border border-white/5" />
      <div className="absolute inset-[32%] rounded-full border border-white/[0.07]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-[rgba(124,92,255,0.35)] bg-[#121214] glow-violet">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b87ff]">Live Flow</span>
          <div className="mt-2 h-10 w-16">
            <VoiceFlow state={reduce ? 'idle' : 'listening'} className="h-full w-full" amplitude={0.7} />
          </div>
        </div>
      </div>

      <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        {apps.map((app, i) => {
          const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
          const x2 = 50 + Math.cos(angle) * 34;
          const y2 = 50 + Math.sin(angle) * 34;
          const isActive = i === focus;
          return (
            <g key={`line-${app.id}`}>
              <line
                x1={50}
                y1={50}
                x2={x2}
                y2={y2}
                stroke={app.color}
                strokeOpacity={isActive ? 0.55 : 0.12}
                strokeWidth={isActive ? 0.55 : 0.25}
              />
              {!reduce && isActive && (
                <motion.circle
                  key={`particle-${app.id}-${focus}`}
                  r="1"
                  fill="#9b87ff"
                  initial={{ opacity: 0, offsetDistance: '0%' }}
                  animate={{ opacity: [0, 1, 0], offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    offsetPath: `path("M50 50 L${x2} ${y2}")`,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {apps.map((app, i) => {
        const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
        const r = 42;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        const isActive = i === focus;
        return (
          <motion.div
            key={app.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%`, transformStyle: 'preserve-3d' }}
            animate={
              reduce
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: isActive ? 1 : 0.42,
                    scale: isActive ? 1 : 0.88,
                    filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                    z: isActive ? 40 : 0,
                    rotateY: isActive ? 0 : -8,
                  }
            }
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <button
              type="button"
              onClick={() => setFocus(i)}
              className="min-w-[84px] rounded-xl border border-white/10 bg-[#121214]/95 px-3 py-2 text-left text-xs font-medium text-[#f5f5f7] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <span className="flex items-center">
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ background: app.color }}
                  aria-hidden="true"
                />
                {app.name}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 block whitespace-pre-wrap text-[10px] leading-snug text-[#a8a8b4]"
                  >
                    {SAMPLE[app.id] ?? 'Voice → action'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
