import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HERO_APPS, type HeroAppId } from '../data/heroShowcase';
import { AppSelector } from './hero/AppSelector';
import { ImmersiveWorkspace } from './hero/ImmersiveWorkspace';

/**
 * Spatial “use it anywhere” stage — the old hero workspace, now a filled
 * section of its own so the page never drops into empty white.
 */
export function AnywhereSection() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<HeroAppId>('gmail');
  const [contextFlash, setContextFlash] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActiveId((current) => {
        const i = HERO_APPS.findIndex((a) => a.id === current);
        return HERO_APPS[(i + 1) % HERO_APPS.length]!.id;
      });
      setContextFlash(true);
      window.setTimeout(() => setContextFlash(false), 420);
    }, 3800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section id="anywhere" className="relative overflow-hidden bg-surface-alt px-4 py-20 sm:px-6 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 20% 20%, color-mix(in srgb, var(--sky) 14%, transparent), transparent 60%), radial-gradient(ellipse 40% 50% at 90% 80%, color-mix(in srgb, var(--gold) 16%, transparent), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-sky uppercase">Use it anywhere</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            One voice.
            <span className="block font-serif text-violet italic">Every workflow.</span>
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Tap an app. Watch the same thought reshape itself — email, message, note, prompt.
          </p>
        </div>

        <div className="mt-8">
          <AppSelector activeId={activeId} onSelect={setActiveId} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative mt-8 overflow-hidden rounded-[32px] border border-border bg-white/80 p-4 shadow-stage sm:p-6"
        >
          <ImmersiveWorkspace
            activeId={activeId}
            stage="complete"
            mode="focus"
            contextFlash={contextFlash}
            onSelect={setActiveId}
          />
        </motion.div>
      </div>
    </section>
  );
}
