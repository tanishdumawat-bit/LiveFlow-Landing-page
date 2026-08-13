import { DOWNLOAD_URL } from '../data/apps';
import { MagneticButton } from '../animations/MagneticButton';

/** Compact closing CTA — brand, one line, download. */
export function FinalCTA() {
  return (
    <section
      id="download"
      className="border-t border-border bg-background px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="font-serif text-4xl tracking-tight text-ink italic sm:text-5xl">
          Live Flow
        </p>
        <p className="mt-3 max-w-md text-base text-muted sm:text-lg">
          Speak once. The right words land where you need them.
        </p>
        <MagneticButton
          href={DOWNLOAD_URL}
          className="mt-7 inline-flex items-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-cta-lg hover:bg-primary-dark"
        >
          Download for Mac
        </MagneticButton>
        <p className="mt-3 text-sm text-muted">Built for macOS</p>
      </div>
    </section>
  );
}
