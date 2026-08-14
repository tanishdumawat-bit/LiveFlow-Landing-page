import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { FAQ_ITEMS } from '../data/faq';
import { LiveFlowLogo } from './brand/LiveFlowLogo';

const EASE = [0.22, 1, 0.36, 1] as const;

function FaqWave({ pulse: _pulse }: { pulse: boolean }) {
  return <LiveFlowLogo markClassName="h-4 w-auto" />;
}

export function FaqSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const baseId = useId();
  const [activeId, setActiveId] = useState(FAQ_ITEMS[0]!.id);
  const [wavePulse, setWavePulse] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(FAQ_ITEMS[0]!.id);
  const listRef = useRef<HTMLDivElement>(null);

  const active = FAQ_ITEMS.find((q) => q.id === activeId) ?? FAQ_ITEMS[0]!;
  const interacted = useRef(false);

  const selectQuestion = (id: string) => {
    if (id === activeId) return;
    interacted.current = true;
    setActiveId(id);
    setWavePulse(true);
    window.setTimeout(() => setWavePulse(false), 700);
  };

  useEffect(() => {
    if (!inView || reduce) return;
    const onPointer = () => {
      interacted.current = true;
    };
    const node = sectionRef.current;
    node?.addEventListener('pointerdown', onPointer);
    return () => node?.removeEventListener('pointerdown', onPointer);
  }, [inView, reduce]);

  // Gentle auto-advance only after interaction + long idle
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      if (!interacted.current) return;
      setActiveId((current) => {
        const idx = FAQ_ITEMS.findIndex((q) => q.id === current);
        const next = FAQ_ITEMS[(idx + 1) % FAQ_ITEMS.length]!;
        setWavePulse(true);
        window.setTimeout(() => setWavePulse(false), 700);
        return next.id;
      });
    }, 45_000);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby={`${baseId}-heading`}
      className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, color-mix(in srgb, var(--violet) 12%, transparent), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-10 text-center sm:mb-14">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="text-xs font-semibold tracking-[0.2em] text-violet uppercase"
          >
            FAQs
          </motion.p>
          <motion.h2
            id={`${baseId}-heading`}
            initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.08, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Good <em className="italic">questions.</em>
          </motion.h2>
        </div>

        {/* Desktop dual-panel */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden overflow-hidden rounded-[32px] border border-border bg-surface-alt shadow-card-lg lg:grid lg:min-h-[560px] lg:grid-cols-[0.95fr_1.15fr]"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28, duration: 0.55, ease: EASE }}
            className="flex flex-col border-r border-border/80 bg-surface/90"
          >
            <div className="border-b border-border/70 px-7 py-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                Questions
              </p>
            </div>
            <div
              ref={listRef}
              role="tablist"
              aria-label="FAQ questions"
              aria-orientation="vertical"
              className="faq-scroll relative max-h-[480px] flex-1 space-y-1 overflow-y-auto px-3 py-3"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent, black 12px, black calc(100% - 16px), transparent)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent, black 12px, black calc(100% - 16px), transparent)',
              }}
            >
              {FAQ_ITEMS.map((item, index) => {
                const selected = item.id === activeId;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => {
                      selectQuestion(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        const next =
                          FAQ_ITEMS[
                            (index + (e.key === 'ArrowDown' ? 1 : -1) + FAQ_ITEMS.length) %
                              FAQ_ITEMS.length
                          ]!;
                        selectQuestion(next.id);
                        document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
                      }
                    }}
                    whileHover={reduce ? undefined : { x: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] leading-snug transition-colors ${
                      selected
                        ? 'bg-primary/12 font-medium text-ink shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_18%,transparent)]'
                        : 'text-muted hover:bg-white/45 hover:text-ink'
                    }`}
                  >
                    <span
                      className={`absolute top-1/2 left-1.5 h-6 w-[3px] -translate-y-1/2 rounded-full transition ${
                        selected ? 'bg-primary opacity-100' : 'bg-primary opacity-0 group-hover:opacity-30'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="pl-2">{item.question}</span>
                    <motion.span
                      aria-hidden="true"
                      className={`ml-auto text-primary transition ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                      animate={selected && !reduce ? { x: [0, 3, 0] } : { x: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.36, duration: 0.55, ease: EASE }}
            className="flex flex-col bg-background/55 px-8 py-7"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              Answer
            </p>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active.id}`}
              className="mt-5 flex min-h-0 flex-1 flex-col"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, y: 14, filter: 'blur(6px)' }
                  }
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduce ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                  className="flex flex-1 flex-col"
                >
                  <p className="text-sm font-medium text-primary-dark">{active.question}</p>
                  <div className="mt-4 flex-1 rounded-[22px] border border-border bg-white p-6 shadow-card">
                    <p className="text-[17px] leading-relaxed text-ink">{active.answer}</p>
                    {active.detail && (
                      <p className="mt-4 text-[15px] leading-relaxed text-muted">
                        {active.detail}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-5">
                <FaqWave pulse={wavePulse} />
                <span className="text-[11px] text-muted/80">
                  {FAQ_ITEMS.findIndex((q) => q.id === activeId) + 1} / {FAQ_ITEMS.length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile accordion */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.65, ease: EASE }}
          className="space-y-2 lg:hidden"
        >
          {FAQ_ITEMS.map((item) => {
            const open = mobileOpen === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-border bg-white"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${baseId}-m-${item.id}`}
                  onClick={() => {
                    setMobileOpen(open ? null : item.id);
                    if (!open) {
                      setActiveId(item.id);
                      setWavePulse(true);
                      window.setTimeout(() => setWavePulse(false), 700);
                    }
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-[15px] font-medium ${
                    open ? 'bg-primary/8 text-ink' : 'text-ink'
                  }`}
                >
                  {item.question}
                  <span className="text-primary">{open ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`${baseId}-m-${item.id}`}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border bg-background/60 px-4 py-4">
                        <p className="text-[15px] leading-relaxed text-ink">{item.answer}</p>
                        {item.detail && (
                          <p className="mt-3 text-sm leading-relaxed text-muted">
                            {item.detail}
                          </p>
                        )}
                        <div className="mt-4">
                          <FaqWave pulse={wavePulse && open} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
