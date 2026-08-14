import { DOWNLOAD_FILENAME, DOWNLOAD_URL } from '../data/apps';
import { LiveFlowLogo } from './brand/LiveFlowLogo';

const links = [
  { href: '#anywhere', label: 'Anywhere' },
  { href: '#how', label: 'Product' },
  { href: '#faq', label: 'FAQs' },
  { href: '#privacy', label: 'Privacy' },
  { href: 'https://github.com', label: 'GitHub', external: true },
  { href: 'mailto:hello@relay.app', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <a href="#top" className="group inline-flex" aria-label="Relay home">
            <LiveFlowLogo tone="dark" markClassName="h-5 w-auto" />
          </a>
          <p className="mt-3 text-sm text-[#9a8b82]">Voice, in flow.</p>
          <a
            href={DOWNLOAD_URL}
            download={DOWNLOAD_FILENAME}
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-gold"
          >
            Download for Mac
          </a>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-sm text-[#9a8b82] transition hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-[#6f635c]">Made for macOS</p>
    </footer>
  );
}
