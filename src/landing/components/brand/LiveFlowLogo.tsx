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
 * Relay mark — speech pulse that lands. Matches the coral waveform lockup.
 */
export function RelayMark({ className = 'h-5 w-auto', title }: MarkProps) {
  const uid = useId().replace(/:/g, '');
  const g = `${uid}-g`;

  return (
    <svg
      viewBox="0 0 52 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={g} x1="3" y1="20" x2="50" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A78" />
          <stop offset="0.45" stopColor="#FF5A32" />
          <stop offset="1" stopColor="#E8431F" />
        </linearGradient>
      </defs>
      <path
        d="M3.5 21 C6.5 21 7 11.5 10 11.5 S13.5 21 15 21 C18 21 18.5 5 22 5 S26 21 27.5 21 C30.5 21 31 11.5 34 11.5 S37.5 21 39 21 L45 21"
        stroke={`url(#${g})`}
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="21" r="3.8" fill={`url(#${g})`} />
    </svg>
  );
}

export function RelayWordmark({ tone = 'light' }: { tone?: Tone }) {
  const color = tone === 'dark' ? 'text-cream' : 'text-ink';
  return (
    <span className={`text-[15px] font-extrabold tracking-[-0.04em] ${color}`}>Relay</span>
  );
}

export function RelayLogo({
  className = '',
  tone = 'light',
  markClassName = 'h-5 w-auto',
  wordmark = true,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <RelayMark className={`lf-mark shrink-0 ${markClassName}`} />
      {wordmark ? <RelayWordmark tone={tone} /> : null}
    </span>
  );
}

/** @deprecated Use RelayMark */
export const LiveFlowMark = RelayMark;
/** @deprecated Use RelayLogo */
export const LiveFlowLogo = RelayLogo;
