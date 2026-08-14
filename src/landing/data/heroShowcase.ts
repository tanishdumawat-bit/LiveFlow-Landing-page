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
  | 'delivering'
  | 'complete';

export type WorkspaceMode = 'focus' | 'ecosystem';

export const FLOW_STAGES: { id: Exclude<FlowStage, 'complete'>; label: string }[] = [
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
  /** Spatial layout in % of workspace (0-100). */
  x: number;
  y: number;
  /** Depth bias: higher = further back when inactive. */
  depth: number;
};

export const HERO_APPS: HeroApp[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ff4b4b',
    accentSoft: 'rgba(255,75,75,0.35)',
    x: 50,
    y: 22,
    depth: 0.2,
  },
  {
    id: 'slack',
    name: 'Slack',
    accent: '#a855f7',
    accentSoft: 'rgba(168,85,247,0.35)',
    x: 14,
    y: 30,
    depth: 0.35,
  },
  {
    id: 'notion',
    name: 'Notion',
    accent: '#37352f',
    accentSoft: 'rgba(55,53,47,0.25)',
    x: 86,
    y: 30,
    depth: 0.35,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    accent: '#10b981',
    accentSoft: 'rgba(16,185,129,0.35)',
    x: 18,
    y: 70,
    depth: 0.4,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    accent: '#3b82f6',
    accentSoft: 'rgba(59,130,246,0.35)',
    x: 82,
    y: 70,
    depth: 0.4,
  },
  {
    id: 'browser',
    name: 'Browser',
    accent: '#22d3ee',
    accentSoft: 'rgba(34,211,238,0.35)',
    x: 50,
    y: 84,
    depth: 0.25,
  },
];

/** Shared spoken thought - constant across destinations. */
export const HERO_SPEECH = 'I wanted to share a quick update on the project.';

export const HERO_RAW_WORDS = [
  'um',
  'I',
  'wanted',
  'to',
  'share',
  'a',
  'quick',
  'update',
  'on',
  'the',
  'project.',
] as const;

export const HERO_FILLER = new Set(['um', 'a', 'the', 'to', 'on']);

export const HERO_KEY_WORDS = ['project', 'update'] as const;

/** Intermediate clean phrase before destination-shaped output. */
export const HERO_CLEAN_TEXT = 'Project update';

export type AppOutput = {
  title: string;
  lines: string[];
};

export const HERO_OUTPUTS: Record<HeroAppId, AppOutput> = {
  gmail: {
    title: 'Compose',
    lines: [
      'Subject: Project update',
      '',
      'Hi Sarah,',
      '',
      'Just wanted to share a quick update on the project. We’re making good progress - I’ll follow up with details shortly.',
      '',
      'Best,',
      'Chinmay',
    ],
  },
  slack: {
    title: '#product-team',
    lines: [
      'Quick project update - we’re making good progress and I’ll share the next update shortly.',
    ],
  },
  notion: {
    title: 'PROJECT UPDATE',
    lines: ['Status', 'In progress', '', 'Next update', 'Pending'],
  },
  chatgpt: {
    title: 'New chat',
    lines: ['Help me turn this project update into a concise status report.'],
  },
  cursor: {
    title: 'editor',
    lines: [
      '// Technical instruction',
      'Draft a status helper that formats a concise project update for the team.',
    ],
  },
  browser: {
    title: 'Search',
    lines: ['project status update best practices concise report'],
  },
};

/** Per-stage dwell inside one app focus cycle (ms). */
export const STAGE_MS: Record<FlowStage, number> = {
  listening: 700,
  transcribing: 800,
  understanding: 700,
  transforming: 700,
  delivering: 900,
  complete: 1400,
};

export const CONTEXT_FLASH_MS = 400;
export const ECOSYSTEM_HOLD_MS = 4500;
export const MANUAL_RESUME_MS = 7000;
export const CAMERA_EASE = [0.22, 1, 0.36, 1] as const;

export function getApp(id: HeroAppId): HeroApp {
  return HERO_APPS.find((a) => a.id === id) ?? HERO_APPS[0]!;
}

export function nextAppId(current: HeroAppId): HeroAppId {
  const idx = HERO_APPS.findIndex((a) => a.id === current);
  return HERO_APPS[(idx + 1) % HERO_APPS.length]!.id;
}

export function stageIndex(stage: FlowStage | 'idle'): number {
  if (stage === 'idle' || stage === 'complete') return stage === 'complete' ? 4 : -1;
  return FLOW_STAGES.findIndex((s) => s.id === stage);
}
