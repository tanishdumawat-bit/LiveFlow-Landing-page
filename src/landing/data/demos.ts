/** Demo content for product storytelling. Illustrative — not measured product metrics. */

export const DIFFERENCE_RAW =
  "Hey so um can you tell Chinmay that testing is almost done but we found two issues and I think we should fix them before we deploy.";

export const DIFFERENCE_POLISHED =
  'Hey Chinmay — quick update: testing is almost complete. We found two issues that we should fix before deployment.';

export const CONTEXT_SPEECH = "I'll send Chinmay an update about the testing.";

export type ContextApp = {
  id: string;
  name: string;
  accent: string;
  label: string;
  output: string;
};

export const CONTEXT_APPS: ContextApp[] = [
  {
    id: 'slack',
    name: 'Slack',
    accent: '#611f69',
    label: 'Team message',
    output:
      'Hey Chinmay — quick update: testing is almost done. Found two issues we’re fixing before deployment.',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ea4335',
    label: 'Email',
    output:
      'Subject: Testing update\n\nHi Chinmay,\n\nJust wanted to share a quick update on testing — nearly complete, with two issues to fix before we deploy.\n\nBest,',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    accent: '#7c5cff',
    label: 'Code comment',
    output: '// Testing is almost complete.\n// Two issues remain before deployment.',
  },
  {
    id: 'notion',
    name: 'Notion',
    accent: '#37352f',
    label: 'Structured notes',
    output: 'Testing Status\n\n• Testing: 90% complete\n• Issues: 2\n• Next step: Fix before deployment',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    accent: '#10a37f',
    label: 'Prompt',
    output: 'Help me draft a concise update for the team about the testing status.',
  },
];

export const VOCAB_TERMS = [
  'Chinmay',
  'myPOS',
  'Live Flow',
  'Agent Studio',
  'Supabase',
  'OpenAI',
  'ElevenLabs',
];

export const STYLE_MODES = [
  { app: 'Slack', style: 'Casual · concise' },
  { app: 'Gmail', style: 'Professional · warm' },
  { app: 'Cursor', style: 'Technical · precise' },
];

export const SHORTCUT_TRIGGER = 'my intro';
export const SHORTCUT_EXPAND =
  "Hi Chinmay, hope you're doing well. Just wanted to share a quick update…";

export const CORRECTION_STEPS = [
  { label: 'You say', text: "Let's meet at 2 PM…" },
  { label: 'You correct', text: 'Actually, make that 3 PM.' },
  { label: 'Live Flow writes', text: "Let's meet at 3 PM." },
  { label: 'You edit', text: 'Remove the last sentence.' },
  { label: 'Result', text: "Let's meet at 3 PM." },
] as const;

export const DEV_SPEECH =
  'Create a function called get user profile that takes a user ID and returns the user from the database.';

export const DEV_CODE = `async function getUserProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId }
  });
}`;

export const DEV_LABELS = ['TypeScript', 'React', 'API', 'Function', 'Database', 'Cursor'] as const;

export const NOTE_MEETING_LINES = [
  "Let's launch this on Friday.",
  'Tanish will handle final QA.',
  'Sarah will send the customer communication.',
];

export const NOTE_EXTRACTION = {
  decision: 'Launch Friday.',
  actions: [
    { owner: 'Tanish', task: 'Final QA' },
    { owner: 'Sarah', task: 'Customer communication' },
  ],
  next: 'Complete QA before Friday.',
  followUp: 'Draft customer communication.',
};

/** Example UI numbers for Meeting Intelligence — not measured product metrics. */
export const MEETING_INTEL_EXAMPLE = {
  durationMin: 45,
  transcriptLines: 312,
  decisions: 3,
  actionItems: 5,
  openQuestions: 2,
  followUps: 1,
};

/**
 * Real measured metrics — leave empty / null to hide the "What we measure" section.
 * Populate only with verified numbers.
 */
export type MeasuredMetric = {
  id: string;
  label: string;
  value: string | number | null;
};

export const MEASURED_METRICS: MeasuredMetric[] = [
  { id: 'words', label: 'Words dictated', value: null },
  { id: 'minutes', label: 'Minutes saved', value: null },
  { id: 'apps', label: 'Apps tested', value: null },
  { id: 'meetings', label: 'Meetings captured', value: null },
  { id: 'stt', label: 'Transcription accuracy', value: null },
  { id: 'context', label: 'Context accuracy', value: null },
];

export const HAS_MEASURED_METRICS = MEASURED_METRICS.some((m) => m.value != null && m.value !== '');
