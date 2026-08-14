export type WorkspaceAppId =
  | 'gmail'
  | 'slack'
  | 'notion'
  | 'chatgpt'
  | 'cursor'
  | 'browser';

export type WorkspaceApp = {
  id: WorkspaceAppId;
  name: string;
  accent: string;
  tone: string;
  speech: string;
  output: string;
};

export const SHARED_SPEECH = 'I wanted to give you an update on the project.';

export const WORKSPACE_APPS: WorkspaceApp[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    accent: '#ea4335',
    tone: 'Professional email',
    speech: SHARED_SPEECH,
    output:
      'Hi Alex,\n\nI wanted to give you an update on the project. Progress is looking good - happy to share details tomorrow morning.\n\nBest,',
  },
  {
    id: 'slack',
    name: 'Slack',
    accent: '#611f69',
    tone: 'Team message',
    speech: SHARED_SPEECH,
    output: 'Quick update - project is progressing well. Will share more tomorrow.',
  },
  {
    id: 'notion',
    name: 'Notion',
    accent: '#e8e8ed',
    tone: 'Structured notes',
    speech: SHARED_SPEECH,
    output: '## Project update\n\n- Progress: on track\n- Next: share details tomorrow\n- Owner: Tanish',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    accent: '#10a37f',
    tone: 'Prompt',
    speech: SHARED_SPEECH,
    output:
      'Summarize the current project status and draft a concise update I can send to stakeholders.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    accent: '#7c5cff',
    tone: 'Dev instruction',
    speech: SHARED_SPEECH,
    output: 'Write a status-update helper that formats a project progress message for stakeholders.',
  },
  {
    id: 'browser',
    name: 'Browser',
    accent: '#5ce1e6',
    tone: 'Research note',
    speech: SHARED_SPEECH,
    output: 'Project update - capture key findings and next actions for tomorrow’s share-out.',
  },
];
