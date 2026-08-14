/** Demo content for product storytelling. Illustrative - not measured product metrics. */

export const DIFFERENCE_RAW =
  "Hey so um can you tell Chinmay that testing is almost done but we found two issues and I think we should fix them before we deploy.";

export const DIFFERENCE_POLISHED =
  'Hey Chinmay - quick update: testing is almost complete. We found two issues that we should fix before deployment.';

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
      'Hey Chinmay - quick update: testing is almost done. Found two issues we’re fixing before deployment.',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ea4335',
    label: 'Email',
    output:
      'Subject: Testing update\n\nHi Chinmay,\n\nJust wanted to share a quick update on testing - nearly complete, with two issues to fix before we deploy.\n\nBest,',
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
  'Relay',
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
