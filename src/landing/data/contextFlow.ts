/** Content for the flagship Context Flow storytelling section. */

export const CONTEXT_FLOW_SPEECH = "I'll send Chinmay an update about the testing.";

export const CONTEXT_FLOW_WORDS = [
  "I'll",
  'send',
  'Chinmay',
  'an',
  'update',
  'about',
  'the',
  'testing.',
] as const;

export type FlowPhase = 'speak' | 'understand' | 'transform' | 'deliver';

export const FLOW_PHASES: { id: FlowPhase; n: string; title: string; body: string }[] = [
  {
    id: 'speak',
    n: '01',
    title: 'Speak',
    body: 'Talk the way you already think.',
  },
  {
    id: 'understand',
    n: '02',
    title: 'Understand',
    body: 'Context, vocabulary, tone and destination shape what your words become.',
  },
  {
    id: 'transform',
    n: '03',
    title: 'Transform',
    body: 'Raw speech becomes useful output.',
  },
  {
    id: 'deliver',
    n: '04',
    title: 'Deliver',
    body: 'Words appear where you need them.',
  },
];

export type FlowDestinationId = 'gmail' | 'slack' | 'cursor' | 'notion' | 'chatgpt';

export type FlowDestination = {
  id: FlowDestinationId;
  name: string;
  accent: string;
  tone: string;
  windowTitle: string;
  output: string;
};

export const FLOW_DESTINATIONS: FlowDestination[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ea4335',
    tone: 'Professional · warm',
    windowTitle: 'Compose',
    output:
      'Subject: Testing update\n\nHi Chinmay,\n\nJust wanted to share a quick update on testing — nearly complete, with two issues to fix before we deploy.\n\nBest,\nTanish',
  },
  {
    id: 'slack',
    name: 'Slack',
    accent: '#611f69',
    tone: 'Casual · concise',
    windowTitle: '#product-team',
    output:
      'Hey Chinmay — quick testing update.\nAlmost done. Found two issues we’re fixing before deployment.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    accent: '#7c5cff',
    tone: 'Technical · precise',
    windowTitle: 'editor · comments',
    output: '// Testing is nearly complete.\n// Two issues remain before deployment.',
  },
  {
    id: 'notion',
    name: 'Notion',
    accent: '#37352f',
    tone: 'Structured · clear',
    windowTitle: 'Testing Status',
    output: 'Testing Status\n\n• Testing: 90% complete\n• Issues: 2\n• Next step: Fix before deployment',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    accent: '#10a37f',
    tone: 'Prompt · concise',
    windowTitle: 'New chat',
    output: 'Help me draft a concise update for the team about the testing status.',
  },
];

export const CONTEXT_SIGNALS = [
  { label: 'Destination', value: 'Gmail', from: "I'll send…" },
  { label: 'Person', value: 'Chinmay', from: 'Chinmay' },
  { label: 'Vocabulary', value: 'testing', from: 'testing' },
  { label: 'Tone', value: 'Professional · Warm', from: 'intent' },
  { label: 'Style', value: 'Your usual writing', from: 'you' },
] as const;

export const VOCAB_CHIPS = [
  'Chinmay',
  'myPOS',
  'Live Flow',
  'Agent Studio',
  'Supabase',
  'OpenAI',
  'ElevenLabs',
] as const;

export const STYLE_CHIPS = [
  { app: 'Slack', style: 'Casual · concise' },
  { app: 'Gmail', style: 'Professional · warm' },
  { app: 'Cursor', style: 'Technical · precise' },
] as const;

export const SHORTCUT_CHIP = {
  trigger: 'my intro',
  expand: "Hi Chinmay, hope you're doing well…",
} as const;

export function getDestination(id: FlowDestinationId): FlowDestination {
  return FLOW_DESTINATIONS.find((d) => d.id === id) ?? FLOW_DESTINATIONS[0]!;
}

/** Map scroll progress 0–1 → phase */
export function phaseFromProgress(p: number): FlowPhase {
  if (p < 0.2) return 'speak';
  if (p < 0.45) return 'understand';
  if (p < 0.7) return 'transform';
  return 'deliver';
}

export function phaseIndex(phase: FlowPhase): number {
  return FLOW_PHASES.findIndex((f) => f.id === phase);
}
