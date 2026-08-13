import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RevealHeadline } from '../animations/RevealHeadline';
import { CONTEXT_APPS } from '../data/demos';

const ECOSYSTEM = [
  ...CONTEXT_APPS,
  { id: 'vscode', name: 'VS Code', accent: '#007acc', label: 'Editor', output: '// Note: testing nearly complete — two issues before deploy.' },
  { id: 'meet', name: 'Google Meet', accent: '#00897b', label: 'Meeting', output: 'Capture: testing update for Chinmay — two issues before launch.' },
  { id: 'browser', name: 'Browser', accent: '#5ce1e6', label: 'Web', output: 'Draft a concise testing status note for the team.' },
  { id: 'linear', name: 'Linear', accent: '#5e6ad2', label: 'Issue', output: 'Title: Fix two remaining test issues before deployment' },
];

export function AppEcosystem() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = ECOSYSTEM[active] ?? ECOSYSTEM[0]!;

  return (
    <section id="everywhere" className="bg-[#FFFFFF] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#C4501E] uppercase">
            Everywhere
          </p>
          <RevealHeadline
            as="h2"
            lines={['Built to work across', 'the apps you already use.']}
            className="mt-3 text-4xl font-semibold tracking-tight text-[#2A2420] sm:text-5xl"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {ECOSYSTEM.map((app, i) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                i === active
                  ? 'border-[#C4501E]/35 bg-[#C4501E]/10 text-[#2A2420]'
                  : 'border-[#E9DECB] bg-[#FAF3E9] text-[#5C534C] hover:border-[#D3B49B]'
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: app.accent }}
                aria-hidden="true"
              />
              {app.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="mt-8 min-h-[140px] rounded-2xl border border-[#E9DECB] bg-[#FAF3E9] p-6"
          >
            <p className="text-xs font-medium text-[#5C534C]">
              {current.name}
              {'label' in current && current.label ? ` · ${current.label}` : ''}
            </p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-[#2A2420]">
              {current.output}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
