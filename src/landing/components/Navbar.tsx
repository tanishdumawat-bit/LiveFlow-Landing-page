import { motion } from 'motion/react';
import { DOWNLOAD_URL } from '../data/apps';
import { useScrolled } from '../hooks';
import { LiveFlowLogo } from './brand/LiveFlowLogo';

const links = [
  { href: '#anywhere', label: 'Anywhere' },
  { href: '#how', label: 'Product' },
  { href: '#cleanup', label: 'Cleanup' },
  { href: '#note-taker', label: 'Note Taker' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#faq', label: 'FAQs' },
];

export function Navbar() {
  const scrolled = useScrolled(40);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <nav
        className={`pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 border border-white/70 bg-white/75 shadow-nav backdrop-blur-2xl transition-all duration-300 ${
          scrolled ? 'rounded-2xl px-4 py-2.5' : 'rounded-full px-5 py-3'
        }`}
        aria-label="Primary"
      >
        <a href="#top" className="group" aria-label="Live Flow home">
          <LiveFlowLogo markClassName="h-8 w-8" />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-violet transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <motion.a
          href={DOWNLOAD_URL}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-cta transition hover:bg-primary-dark"
        >
          Download
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </nav>
    </motion.header>
  );
}
