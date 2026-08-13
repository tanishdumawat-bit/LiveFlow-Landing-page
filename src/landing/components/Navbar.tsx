import { motion } from 'motion/react';
import { DOWNLOAD_URL } from '../data/apps';
import { useScrolled } from '../hooks';
import { VoiceFlow } from '../animations/VoiceFlow';

const links = [
  { href: '#difference', label: 'Product' },
  { href: '#note-taker', label: 'Note Taker' },
  { href: '#faq', label: 'FAQs' },
  { href: '#privacy', label: 'Privacy' },
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
        className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 border border-[#E9DECB] bg-[#FFFFFF]/82 shadow-[0_10px_40px_rgba(42,36,32,0.08)] backdrop-blur-xl transition-all duration-300 ${
          scrolled ? 'rounded-2xl px-4 py-2.5' : 'rounded-[22px] px-5 py-3.5'
        }`}
        aria-label="Primary"
      >
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[#2A2420]"
        >
          <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[#E9DECB] bg-[#F2E6D3] transition group-hover:border-[#C4501E]/35">
            <VoiceFlow state="idle" className="h-4 w-6" amplitude={0.45} showParticles={false} />
          </span>
          Live Flow
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm text-[#5C534C] transition-colors hover:text-[#2A2420]"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[#C4501E] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <motion.a
          href={DOWNLOAD_URL}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-full bg-[#C4501E] px-4 py-2 text-sm font-medium text-white shadow-[0_8px_20px_rgba(196,80,30,0.22)] transition hover:bg-[#8A4A24]"
        >
          Download
        </motion.a>
      </nav>
    </motion.header>
  );
}
