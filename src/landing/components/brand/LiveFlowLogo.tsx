import { useId } from 'react';

type Tone = 'light' | 'dark';

type MarkProps = {
  className?: string;
  title?: string;
};

type LogoProps = {
  className?: string;
  tone?: Tone;
  markClassName?: string;
  wordmark?: boolean;
};

/**
 * Live Flow mark — listening orb + current of speech, molten coral → violet.
 */
export function LiveFlowMark({ className = 'h-8 w-8', title }: MarkProps) {
  const uid = useId().replace(/:/g, '');
  const g = `${uid}-g`;
  const sheen = `${uid}-sheen`;
  const glow = `${uid}-glow`;
  const wave = `${uid}-wave`;

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={g} x1="4" y1="2" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8A6A" />
          <stop offset="0.42" stopColor="#FF5A32" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
        <linearGradient id={wave} x1="18" y1="14" x2="36" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.72" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F4B942" />
        </linearGradient>
        <radialGradient id={sheen} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 10) rotate(55) scale(28 22)">
          <stop stopColor="#FFFFFF" stopOpacity="0.42" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="40" height="40" rx="12" fill={`url(#${g})`} />
      <rect width="40" height="40" rx="12" fill={`url(#${sheen})`} />
      <rect
        x="0.6"
        y="0.6"
        width="38.8"
        height="38.8"
        rx="11.4"
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />

      {/* Live — listening orb */}
      <circle cx="13.2" cy="20" r="5.35" fill="white" filter={`url(#${glow})`} />
      <circle cx="11.7" cy="18.4" r="1.7" fill="white" fillOpacity="0.55" />
      <rect x="12.05" y="17.15" width="2.3" height="5.7" rx="1.15" fill={`url(#${g})`} />

      {/* Flow — current of speech */}
      <path
        d="M18.4 20 C21.6 12.4 25 12.6 27.05 19.4 C28.85 25.4 32.1 26.2 35.6 19.2"
        stroke={`url(#${wave})`}
        strokeWidth="2.7"
        strokeLinecap="round"
        filter={`url(#${glow})`}
      />
      <path
        d="M18.8 20 C21.7 15.2 24.8 15.4 26.7 19.8"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <circle cx="35.55" cy="19.2" r="1.85" fill="#F4B942" />
      <circle cx="35.15" cy="18.7" r="0.55" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

export function LiveFlowWordmark({ tone = 'light' }: { tone?: Tone }) {
  const live = tone === 'dark' ? 'text-cream' : 'text-ink';
  const flow =
    tone === 'dark' ? 'text-gold' : 'text-headline-gradient';

  return (
    <span className="flex items-baseline leading-none">
      <span className={`text-[15px] font-extrabold tracking-[-0.045em] ${live}`}>Live</span>
      <span className={`ml-[0.18em] font-serif text-[18px] italic tracking-[-0.02em] ${flow}`}>
        Flow
      </span>
    </span>
  );
}

export function LiveFlowLogo({
  className = '',
  tone = 'light',
  markClassName = 'h-8 w-8',
  wordmark = true,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LiveFlowMark className={`lf-mark shrink-0 ${markClassName}`} />
      {wordmark ? <LiveFlowWordmark tone={tone} /> : null}
    </span>
  );
}
