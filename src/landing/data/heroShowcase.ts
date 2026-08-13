export type HeroAppId =
  | 'gmail'
  | 'slack'
  | 'notion'
  | 'chatgpt'
  | 'cursor'
  | 'browser';

export type FlowStage =
  | 'listening'
  | 'transcribing'
  | 'understanding'
  | 'transforming'
  | 'delivering';

export const FLOW_STAGES: { id: FlowStage; label: string }[] = [
  { id: 'listening', label: 'Listening' },
  { id: 'transcribing', label: 'Transcribing' },
  { id: 'understanding', label: 'Understanding' },
  { id: 'transforming', label: 'Transforming' },
  { id: 'delivering', label: 'Delivering' },
];

export type HeroApp = {
  id: HeroAppId;
  name: string;
  accent: string;
  accentSoft: string;
};

export const HERO_APPS: HeroApp[] = [
  { id: 'gmail', name: 'Gmail', accent: '#ff4b4b', accentSoft: 'rgba(255,75,75,0.35)' },
  { id: 'slack', name: 'Slack', accent: '#a855f7', accentSoft: 'rgba(168,85,247,0.35)' },
  { id: 'notion', name: 'Notion', accent: '#e8e8ed', accentSoft: 'rgba(232,232,237,0.25)' },
  { id: 'chatgpt', name: 'ChatGPT', accent: '#10b981', accentSoft: 'rgba(16,185,129,0.35)' },
  { id: 'cursor', name: 'Cursor', accent: '#3b82f6', accentSoft: 'rgba(59,130,246,0.35)' },
  { id: 'browser', name: 'Browser', accent: '#22d3ee', accentSoft: 'rgba(34,211,238,0.35)' },
];

export const STAGE_DURATION_MS = 1100;
export const DELIVER_HOLD_MS = 2600;
export const LOOP_PAUSE_MS = 1400;

/** Shared spoken phrase → polished line for the hero transcript strip. */
export const HERO_RAW_WORDS = ['um', 'I', 'wanted', 'to', 'share', 'a', 'quick', 'update…'];
export const HERO_CLEAN_TEXT = "I'll share a quick update.";

export function getApp(id: HeroAppId): HeroApp {
  return HERO_APPS.find((a) => a.id === id) ?? HERO_APPS[0]!;
}
