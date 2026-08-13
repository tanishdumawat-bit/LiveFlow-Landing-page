export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  detail?: string;
};

/**
 * FAQ copy grounded in existing Live Flow product story.
 * Avoid unverified claims (full offline STT, zero retention, etc.).
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is',
    question: 'What is Live Flow?',
    answer:
      'Live Flow is a voice layer for your Mac — speak naturally and get polished text where you’re already working.',
    detail:
      'It turns speech into context-aware writing so your words land in the right place, in the right form.',
  },
  {
    id: 'across-apps',
    question: 'Does Live Flow work across apps?',
    answer:
      'Live Flow is built to work across the applications you already use on your Mac.',
    detail:
      'Wherever you can type, the goal is the same: speak once, and Live Flow helps your words appear there.',
  },
  {
    id: 'vs-voice-typing',
    question: 'How is Live Flow different from normal voice typing?',
    answer:
      'Built-in voice typing usually writes what you said, word for word — including fillers and false starts.',
    detail:
      'Live Flow is built to polish what you meant, then place it into your workflow.',
  },
  {
    id: 'app-context',
    question: 'Can Live Flow understand the app I’m using?',
    answer:
      'Yes — context is a core part of Live Flow. The same speech can become a Slack message, email, note, or prompt.',
    detail: 'That’s the idea behind “one voice, every workflow.”',
  },
  {
    id: 'apps-list',
    question: 'Does Live Flow work with Slack, Gmail, Notion and Cursor?',
    answer:
      'Those are exactly the kinds of destinations Live Flow is built for — messaging, email, docs, and coding tools.',
    detail:
      'Demos on this site show how one spoken update can adapt across common Mac workflows.',
  },
  {
    id: 'customize',
    question: 'Can I customize how Live Flow writes?',
    answer:
      'Yes. App modes and preferences live in Settings so Live Flow can match how you write in different places.',
    detail:
      'Tone and destination shape what your words become — from a quick Slack note to a clearer email.',
  },
  {
    id: 'vocabulary',
    question: 'Can Live Flow learn my vocabulary?',
    answer:
      'Live Flow is designed around your vocabulary, people, and products — so names and terms stay intact.',
    detail:
      'Shortcuts and style preferences help it write more like you over time.',
  },
  {
    id: 'api-key',
    question: 'Can I use my own STT/API key?',
    answer:
      'Speech service keys are configured in Settings — you bring your own credentials.',
    detail:
      'That keeps audio processing under the speech service you choose.',
  },
  {
    id: 'voice-data',
    question: 'Is my voice data stored?',
    answer:
      'Live Flow is designed with privacy in mind. Audio is processed only when you explicitly start a session.',
    detail:
      'Temporary meeting recordings are not meant to become a permanent archive — the result stays; the waveform fades.',
  },
  {
    id: 'note-taker',
    question: 'What is Note Taker?',
    answer:
      'Note Taker is Live Flow’s meeting companion — capturing conversation and turning it into structured notes.',
    detail:
      'Think summaries, decisions, and action items extracted from what was said — not just a raw transcript dump.',
  },
  {
    id: 'action-items',
    question: 'Can Note Taker extract action items?',
    answer:
      'Yes — Note Taker is built to surface decisions, owners, and next steps from the conversation.',
    detail:
      'The goal is momentum after the meeting, not another unread transcript.',
  },
  {
    id: 'offline',
    question: 'Does Live Flow work offline?',
    answer:
      'Live Flow is a Mac app that relies on your configured speech service for transcription.',
    detail:
      'Core UI works locally; speech features need the speech service you’ve enabled in Settings.',
  },
  {
    id: 'permissions',
    question: 'What permissions does Live Flow require?',
    answer:
      'On macOS, Live Flow needs microphone access to hear you, and Accessibility so it can type into the active app.',
    detail:
      'You can review these anytime in System Settings — Live Flow only acts when you start a session.',
  },
  {
    id: 'macos',
    question: 'Is Live Flow available for macOS?',
    answer:
      'Yes. Live Flow is built for macOS — download it and use Option + Space to start flowing.',
    detail: 'Made for the Mac menu bar, floating widget, and the apps you already live in.',
  },
];
