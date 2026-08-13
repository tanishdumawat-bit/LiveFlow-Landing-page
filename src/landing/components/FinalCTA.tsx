import { DOWNLOAD_URL } from '../data/apps';
import { MagneticButton } from '../animations/MagneticButton';

/** Compact closing CTA — brand, one line, download. */
export function FinalCTA() {
  return (
    <section
      id="download"
      className="border-t border-[#E6E8EC] bg-[#FFFFFF] px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="font-serif text-4xl tracking-tight text-[#2A2420] italic sm:text-5xl">
          Live Flow
        </p>
        <p className="mt-3 max-w-md text-base text-[#5C5F66] sm:text-lg">
          Speak once. The right words land where you need them.
        </p>
        <MagneticButton
          href={DOWNLOAD_URL}
          className="mt-7 inline-flex items-center rounded-full bg-[#C4501E] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(196,80,30,0.28)] hover:bg-[#8A4A24]"
        >
          Download for Mac
        </MagneticButton>
        <p className="mt-3 text-sm text-[#5C5F66]">Built for macOS</p>
      </div>
    </section>
  );
}
