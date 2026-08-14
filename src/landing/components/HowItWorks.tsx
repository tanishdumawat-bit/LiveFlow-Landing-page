import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { COMPOSER_SCENE, KIND_META, type TokenKind } from '../data/orbit';
import { mix } from '../../theme/tokens';
import { MetricStrip } from './shared/MetricStrip';

const EASE = [0.16, 1, 0.3, 1] as const;

type ComposerPhase = 'raw' | 'tag' | 'clean';

const PILLARS = [
  {
    id: 'speak',
    kicker: '01',
    title: 'Speak naturally',
    copy: 'Ramble, pause, change your mind mid-sentence. Relay hears what you meant - not a transcript of the mess.',
    tint: 'var(--primary-soft)',
    accent: 'var(--primary)',
  },
  {
    id: 'edit',
    kicker: '02',
    title: 'It edits as you speak',
    copy: 'Fillers drop. Corrections land. Repetitions collapse. The sentence that appears is the one you would have typed.',
    tint: 'var(--violet-soft)',
    accent: 'var(--violet)',
  },
  {
    id: 'anywhere',
    kicker: '03',
    title: 'Then it lands in the right app',
    copy: 'Same voice. Email in Gmail, a Slack ping, a Notion note, a Cursor instruction. Context decides the form.',
    tint: 'var(--teal-soft)',
    accent: 'var(--teal)',
  },
] as const;

function ComposerDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<ComposerPhase>(reduce ? 'clean' : 'raw');

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: number[] = [];
    const run = () => {
      if (cancelled) return;
      setPhase('raw');
      timers.push(window.setTimeout(() => !cancelled && setPhase('tag'), 1600));
      timers.push(window.setTimeout(() => !cancelled && setPhase('clean'), 3800));
      timers.push(window.setTimeout(() => !cancelled && run(), 7200));
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  const status =
    phase === 'raw' ? 'Listening…' : phase === 'tag' ? 'Cleaning up…' : 'Ready to send';

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-border bg-white shadow-stage">
      <div
        className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full blur-3xl"
        style={{ background: mix('var(--violet)', 18) }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-8 h-44 w-44 rounded-full blur-3xl"
        style={{ background: mix('var(--primary)', 16) }}
      />

      <div className="relative flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-traffic-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-traffic-yellow" />
          <span className="h-2.5 w-2.5 rounded-full bg-traffic-green" />
          <span className="ml-2 text-[12px] font-medium text-muted">Message</span>
        </div>
        <span className="text-[11px] font-semibold tracking-[0.14em] text-violet uppercase">
          {status}
        </span>
      </div>

      <div className="relative min-h-[200px] px-5 py-6 sm:min-h-[220px] sm:px-7 sm:py-8">
        <AnimatePresence mode="wait">
          {phase !== 'clean' ? (
            <motion.p
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(6px)' }}
              className="text-[16px] leading-relaxed text-ink sm:text-[18px]"
            >
              {COMPOSER_SCENE.tokens.map((token) => {
                const hot = phase === 'tag' && token.kind !== 'keep';
                const meta = KIND_META[token.kind];
                return (
                  <motion.span
                    key={token.id}
                    className="relative mr-[0.35em] inline-block"
                    animate={
                      hot
                        ? { y: -1, color: meta.color }
                        : { y: 0 }
                    }
                    transition={{ duration: 0.35 }}
                    style={{
                      textDecoration: hot ? 'line-through' : 'none',
                      background: hot ? mix(meta.soft, 80) : 'transparent',
                      borderRadius: 6,
                      padding: hot ? '0 4px' : 0,
                    }}
                  >
                    {token.text}
                    {hot && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[8px] font-semibold tracking-wide whitespace-nowrap uppercase"
                        style={{
                          color: meta.color,
                          background: mix(meta.soft, 95),
                          boxShadow: `0 0 0 1px ${mix(meta.color, 25)}`,
                        }}
                      >
                        {token.kind}
                      </motion.span>
                    )}
                  </motion.span>
                );
              })}
            </motion.p>
          ) : (
            <motion.p
              key="clean"
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="font-serif text-[20px] leading-snug text-ink italic sm:text-[22px]"
            >
              {COMPOSER_SCENE.clean}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex flex-wrap gap-2 border-t border-border px-5 py-3.5 sm:px-6">
        {(Object.keys(KIND_META) as TokenKind[])
          .filter((k) => k !== 'keep')
          .map((kind) => (
            <span
              key={kind}
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
              style={{
                color: KIND_META[kind].color,
                background: mix(KIND_META[kind].soft, 90),
                opacity: phase === 'tag' ? 1 : 0.4,
              }}
            >
              {KIND_META[kind].label}
            </span>
          ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 0%, color-mix(in srgb, var(--violet) 14%, transparent), transparent 60%), radial-gradient(ellipse 50% 40% at 0% 80%, color-mix(in srgb, var(--teal) 12%, transparent), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet uppercase">How it works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Speak at the speed you think.
            <span className="mt-1 block font-serif text-primary italic">In every app.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Ramble. Correct yourself. Change the day. Relay catches fillers, mid-sentence
            rewrites, and repeats - then writes the thing you meant.
          </p>
          <MetricStrip
            className="mt-10 max-w-xl"
            items={[
              { to: 3, suffix: '×', label: 'Faster than typing' },
              { to: 3, label: 'Cleanup layers' },
              { to: 1, label: 'Shortcut' },
            ]}
          />
        </div>

        <div className="mt-12">
          <ComposerDemo />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
              className="rounded-[24px] border border-border p-6 shadow-card"
              style={{ background: `linear-gradient(180deg, ${p.tint} 0%, var(--card) 48%)` }}
            >
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: p.accent }}>
                {p.kicker}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
