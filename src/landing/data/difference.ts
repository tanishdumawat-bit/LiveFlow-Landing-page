/** Compact content for the Difference section. */

export const DIFF_YOU_SPEAK =
  'Hey, can you tell Chinmay that testing is almost done but we found two issues and should fix them before deployment.';

export const DIFF_TRADITIONAL =
  'Hey so um can you tell Chinmay that testing is almost done but we found two issues and I think we should fix them before we deploy.';

export const DIFF_AI_CLEAN =
  'Hey Chinmay, testing is almost complete, but we found two issues that we should fix before deployment.';

export type DiffAppId = 'gmail' | 'slack' | 'notion' | 'chatgpt' | 'cursor';

export type DiffApp = {
  id: DiffAppId;
  name: string;
  accent: string;
  contextLine: string;
  format: string;
  output: string;
};

export const DIFF_APPS: DiffApp[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ea4335',
    contextLine: "You're writing an email.",
    format: 'Email',
    output:
      "Hi Chinmay,\n\nJust wanted to share a quick update on testing — we're nearly complete, but we've identified two issues that we'd like to resolve before deployment.\n\nBest,",
  },
  {
    id: 'slack',
    name: 'Slack',
    accent: '#611f69',
    contextLine: "You're messaging your team.",
    format: 'Message',
    output:
      "Quick testing update — we're nearly done, but found two issues we'll fix before deployment.",
  },
  {
    id: 'notion',
    name: 'Notion',
    accent: '#37352f',
    contextLine: "You're capturing structured notes.",
    format: 'Note',
    output:
      'Testing Update\n\nStatus: Nearly complete\nIssues: 2\nNext: Fix before deployment',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    accent: '#10a37f',
    contextLine: "You're drafting a prompt.",
    format: 'Prompt',
    output:
      'Help me draft an update to Chinmay explaining that testing is nearly complete and two issues remain before deployment.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    accent: '#7c5cff',
    contextLine: "You're working in code.",
    format: 'Instruction',
    output: 'Review the two remaining testing issues and fix them before deployment.',
  },
];

export function getDiffApp(id: DiffAppId): DiffApp {
  return DIFF_APPS.find((a) => a.id === id) ?? DIFF_APPS[0]!;
}
