/** Orbital correction scenes - messy speech in, polished writing out. */

export type TokenKind = 'keep' | 'filler' | 'correction' | 'repetition';

export type OrbitToken = {
  id: string;
  text: string;
  kind: TokenKind;
  replacement?: string;
};

export type OrbitScene = {
  id: string;
  rawLine: string;
  clean: string;
  tokens: OrbitToken[];
};

export const KIND_META: Record<
  TokenKind,
  { label: string; color: `var(--${string})`; soft: `var(--${string})` }
> = {
  keep: { label: '', color: 'var(--ink)', soft: 'var(--surface-alt)' },
  filler: { label: 'Filler identified', color: 'var(--primary)', soft: 'var(--primary-soft)' },
  correction: { label: 'Correction identified', color: 'var(--violet)', soft: 'var(--violet-soft)' },
  repetition: { label: 'Repetition identified', color: 'var(--gold)', soft: 'var(--accent-soft)' },
};

export const ORBIT_SCENES: OrbitScene[] = [
  {
    id: 'ship',
    rawLine:
      'hey so um wait we should like actually ship this tonight I mean the the voice layer is ready this is gonna be huge',
    clean: 'Let’s ship this tonight. The voice layer is ready - this is going to be huge.',
    tokens: [
      { id: 's1', text: 'hey so um wait', kind: 'filler' },
      { id: 's2', text: 'we should', kind: 'keep' },
      { id: 's3', text: 'like actually', kind: 'filler' },
      { id: 's4', text: 'ship this tonight', kind: 'keep' },
      { id: 's5', text: 'I mean', kind: 'filler' },
      { id: 's6', text: 'the the', kind: 'repetition', replacement: 'the' },
      { id: 's7', text: 'voice layer is ready', kind: 'keep' },
      { id: 's8', text: 'gonna', kind: 'correction', replacement: 'going to' },
      { id: 's9', text: 'be huge', kind: 'keep' },
    ],
  },
  {
    id: 'every-app',
    rawLine:
      'uh what if you just speak and it like lands in every app wait the the whole Mac is listening now this is insane',
    clean: 'What if you just speak - and it lands in every app?',
    tokens: [
      { id: 'e1', text: 'uh', kind: 'filler' },
      { id: 'e2', text: 'what if you just speak', kind: 'keep' },
      { id: 'e3', text: 'like', kind: 'filler' },
      { id: 'e4', text: 'lands in every app', kind: 'keep' },
      { id: 'e5', text: 'wait', kind: 'filler' },
      { id: 'e6', text: 'the the', kind: 'repetition', replacement: 'the' },
      { id: 'e7', text: 'whole Mac is listening', kind: 'keep' },
      { id: 'e8', text: 'this is insane', kind: 'correction', replacement: 'every app' },
    ],
  },
  {
    id: 'live',
    rawLine:
      'so like tell everyone we’re going live I mean we’re shipping voice in every workflow um this is gonna change everything',
    clean: 'Tell everyone: we’re going live. Voice in every workflow.',
    tokens: [
      { id: 'v1', text: 'so like', kind: 'filler' },
      { id: 'v2', text: 'tell everyone', kind: 'keep' },
      { id: 'v3', text: 'we’re going live', kind: 'keep' },
      { id: 'v4', text: 'I mean', kind: 'filler' },
      { id: 'v5', text: 'shipping voice', kind: 'keep' },
      { id: 'v6', text: 'in every workflow', kind: 'keep' },
      { id: 'v7', text: 'um', kind: 'filler' },
      { id: 'v8', text: 'gonna change everything', kind: 'correction', replacement: 'going live' },
    ],
  },
];

export const COMPOSER_SCENE = ORBIT_SCENES[0]!;
