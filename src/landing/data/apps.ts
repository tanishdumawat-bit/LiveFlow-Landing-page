export const DOWNLOAD_URL = '/downloads/Live%20Flow_0.1.2.dmg';

export type AppProfile = {
  id: string;
  name: string;
  accent: string;
  tone: string;
  input: string;
  output: string;
  windowTitle: string;
};

export const APP_PROFILES: AppProfile[] = [
  {
    id: 'slack',
    name: 'Slack',
    accent: '#611f69',
    tone: 'Casual & concise',
    input: 'I wanted to give you an update on the testing.',
    output: 'Quick update — testing is progressing well.',
    windowTitle: '#product-updates',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ea4335',
    tone: 'Professional email',
    input: 'I wanted to give you an update on the testing.',
    output: 'Hi Alex,\n\nI wanted to give you an update on the latest testing.',
    windowTitle: 'Compose',
  },
  {
    id: 'meet',
    name: 'Meet',
    accent: '#00897b',
    tone: 'Meeting notes',
    input: 'I wanted to give you an update on the testing.',
    output: 'Update shared: testing is progressing; follow-ups to be assigned after the call.',
    windowTitle: 'Live Flow Sync',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    accent: '#7c5cff',
    tone: 'Dev / prompt',
    input: 'I wanted to give you an update on the testing.',
    output: 'Provide an update on the current testing status.',
    windowTitle: 'Agent',
  },
  {
    id: 'notion',
    name: 'Notion',
    accent: '#ffffff',
    tone: 'Structured notes',
    input: 'I wanted to give you an update on the testing.',
    output: '## Testing update\nProgressing well. Next: complete remaining scenarios.',
    windowTitle: 'Sprint notes',
  },
];

export const ORBIT_APPS = [
  { id: 'slack', name: 'Slack', color: '#611f69' },
  { id: 'gmail', name: 'Gmail', color: '#ea4335' },
  { id: 'cursor', name: 'Cursor', color: '#7c5cff' },
  { id: 'notion', name: 'Notion', color: '#f5f5f7' },
  { id: 'meet', name: 'Meet', color: '#00897b' },
  { id: 'notes', name: 'Notes', color: '#f4c430' },
  { id: 'discord', name: 'Discord', color: '#5865f2' },
] as const;

export const MEETING_SNIPPETS = [
  'We should launch next Friday.',
  'I think we still have three scenarios to test.',
  "Okay, let's hold the release until those are resolved.",
  'Tanish can finish the remaining cases by Wednesday.',
  'Georgie will review the recordings tomorrow.',
];

export const MEETING_REPORT = {
  summary:
    'The team reviewed the launch timeline and agreed that remaining test scenarios must be completed before release.',
  decisions: ['Delay launch until testing is complete.'],
  actionItems: [
    { owner: 'Tanish', task: 'Complete remaining test scenarios' },
    { owner: 'Georgie', task: 'Review meeting recordings' },
  ],
  openQuestions: ['Should the pre-sales flow transfer directly to sales?'],
  nextSteps: ['Complete testing', 'Review recordings', 'Revisit launch date'],
};
