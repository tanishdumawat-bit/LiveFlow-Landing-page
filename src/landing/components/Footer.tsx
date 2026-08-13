import { DOWNLOAD_URL } from '../data/apps';

const links = [
  { href: '#difference', label: 'Product' },
  { href: '#note-taker', label: 'Note Taker' },
  { href: '#faq', label: 'FAQs' },
  { href: '#privacy', label: 'Privacy' },
  { href: 'https://github.com', label: 'GitHub', external: true },
  { href: 'mailto:hello@liveflow.app', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-ink">Live Flow</p>
          <p className="mt-1 text-sm text-muted">Voice, in flow.</p>
          <a
            href={DOWNLOAD_URL}
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark"
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
              className="text-sm text-muted transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted">Made for macOS</p>
    </footer>
  );
}
