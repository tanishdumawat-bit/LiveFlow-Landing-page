import { useState } from 'react';
import { DOWNLOAD_URL } from '../data/apps';
import { MagneticButton } from '../animations/MagneticButton';
import { RevealHeadline } from '../animations/RevealHeadline';
import { VoiceFlow } from '../animations/VoiceFlow';
import { VoiceParticles } from '../animations/VoiceParticles';

export function FinalCTA() {
  const [hover, setHover] = useState(false);

  return (
    <section className="relative px-4 py-28 sm:px-6 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center">
          <VoiceParticles active={hover} count={10} />
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border bg-[#121214] transition duration-300 ${
              hover
                ? 'border-[rgba(255,59,48,0.45)] glow-record'
                : 'border-[rgba(124,92,255,0.35)] glow-violet'
            }`}
          >
            <span className={`h-3 w-3 rounded-full ${hover ? 'bg-[#ff3b30]' : 'bg-[#9b87ff]'}`} />
          </div>
        </div>

        <RevealHeadline
          as="h2"
          lines={['Talk to your computer.', 'Not at it.']}
          className="text-4xl font-semibold tracking-tight text-white sm:text-6xl"
        />
        <p className="mx-auto mt-5 max-w-md text-base text-[#8a8a93] sm:text-lg">
          Live Flow brings your voice into every workflow.
        </p>

        <div className="mt-4 h-10">
          <VoiceFlow state={hover ? 'listening' : 'idle'} amplitude={hover ? 1 : 0.3} className="mx-auto h-10 w-56" />
        </div>

        <div
          className="mt-8 inline-block"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <MagneticButton
            href={DOWNLOAD_URL}
            strength={22}
            className={`inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black ${
              hover ? 'glow-violet' : ''
            }`}
          >
            Download Live Flow for Mac
          </MagneticButton>
        </div>
        <p className="mt-4 text-sm text-[#8a8a93]">Built for macOS.</p>
      </div>
    </section>
  );
}
