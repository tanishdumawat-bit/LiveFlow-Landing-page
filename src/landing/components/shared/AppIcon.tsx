import type { IconType } from 'react-icons';
import { SiGmail, SiNotion } from 'react-icons/si';
import { FaSlack } from 'react-icons/fa6';
import { RiOpenaiFill } from 'react-icons/ri';
import { HiOutlineCommandLine, HiOutlineGlobeAlt } from 'react-icons/hi2';

/**
 * Real brand marks for apps we truly integrate with (Gmail, Slack, Notion,
 * ChatGPT/OpenAI). Generic icons for "Cursor" and "Browser" since those refer
 * to a category (a code editor, any browser) rather than one specific brand.
 */
const ICON_BY_NAME: Record<string, IconType> = {
  gmail: SiGmail,
  slack: FaSlack,
  notion: SiNotion,
  chatgpt: RiOpenaiFill,
  cursor: HiOutlineCommandLine,
  browser: HiOutlineGlobeAlt,
};

export function getAppIcon(name: string): IconType {
  return ICON_BY_NAME[name.toLowerCase()] ?? HiOutlineGlobeAlt;
}

type AppIconProps = {
  name: string;
  className?: string;
};

export function AppIcon({ name, className }: AppIconProps) {
  const Icon = getAppIcon(name);
  return <Icon className={className} aria-hidden="true" />;
}

type AppIconBadgeProps = {
  name: string;
  accent: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
};

const BADGE_SIZE: Record<NonNullable<AppIconBadgeProps['size']>, { box: string; icon: string }> = {
  xs: { box: 'h-4 w-4', icon: 'h-2.5 w-2.5' },
  sm: { box: 'h-5 w-5', icon: 'h-3 w-3' },
  md: { box: 'h-7 w-7', icon: 'h-4 w-4' },
};

/** Colored rounded badge with the app's icon in white — the standard "app chip". */
export function AppIconBadge({ name, accent, size = 'sm', className = '' }: AppIconBadgeProps) {
  const { box, icon } = BADGE_SIZE[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-white ${box} ${className}`}
      style={{ background: accent }}
    >
      <AppIcon name={name} className={icon} />
    </span>
  );
}
