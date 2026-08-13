import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import {
  SHORTCUT_EXPAND,
  SHORTCUT_TRIGGER,
  STYLE_MODES,
  VOCAB_TERMS,
} from '../data/demos';

export function PersonalizationSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [recognized, setRecognized] = useState(0);
  const [shortcutOpen, setShortcutOpen] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setRecognized(VOCAB_TERMS.length);
      setShortcutOpen(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setRecognized(Math.min(i, VOCAB_TERMS.length));
      if (i >= VOCAB_TERMS.length) {
        clearInterval(id);
        window.setTimeout(() => setShortcutOpen(true), 400);
      }
    }, 320);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <section id="personalization" className="bg-[#F2E6D3] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E] uppercase">
            Context engine
          </p>
          <RevealHeadline
            as="h2"
            lines={['Live Flow learns', 'how you speak.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
          <p className="mt-4 text-base text-[#5C534C] sm:text-lg">
            Your words. Your people. Your products. Your way of writing.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#E9DECB] bg-white p-6"
          >
            <h3 className="text-sm font-semibold tracking-[0.12em] text-[#C4501E] uppercase">
              Your vocabulary
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {VOCAB_TERMS.map((term, i) => {
                const on = i < recognized;
                return (
                  <motion.span
                    key={term}
                    animate={{
                      opacity: on ? 1 : 0.35,
                      scale: on ? 1 : 0.96,
                      borderColor: on ? 'rgba(74,124,111,0.35)' : 'rgba(233,222,203,1)',
                    }}
                    className="rounded-full border bg-[#FAF3E9] px-3 py-1.5 text-sm text-[#2A2420]"
                  >
                    {term}
                  </motion.span>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-[#5C534C]">Names and product terms stay intact.</p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-[#E9DECB] bg-white p-6"
          >
            <h3 className="text-sm font-semibold tracking-[0.12em] text-[#C4501E] uppercase">
              Your style
            </h3>
            <ul className="mt-5 space-y-3">
              {STYLE_MODES.map((mode) => (
                <li
                  key={mode.app}
                  className="flex items-center justify-between rounded-xl border border-[#E9DECB] bg-[#FAF3E9] px-3 py-2.5"
                >
                  <span className="text-sm font-medium text-[#2A2420]">{mode.app}</span>
                  <span className="text-xs text-[#5C534C]">{mode.style}</span>
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="rounded-2xl border border-[#E9DECB] bg-white p-6"
          >
            <h3 className="text-sm font-semibold tracking-[0.12em] text-[#C4501E] uppercase">
              Your shortcuts
            </h3>
            <div className="mt-5">
              <p className="rounded-xl border border-[#E9DECB] bg-[#FAF3E9] px-3 py-2 font-mono text-sm text-[#2A2420]">
                “{SHORTCUT_TRIGGER}”
              </p>
              <p className="my-3 text-center text-xs text-[#C4501E]">→</p>
              <AnimatePresence>
                {shortcutOpen && (
                  <motion.p
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    className="rounded-xl border border-[#4A7C6F]/25 bg-[#4A7C6F]/08 px-3 py-3 text-sm leading-relaxed text-[#2A2420]"
                  >
                    {SHORTCUT_EXPAND}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
