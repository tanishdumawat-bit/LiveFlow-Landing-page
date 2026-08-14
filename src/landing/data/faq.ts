export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  detail?: string;
};

/**
 * FAQ copy grounded in existing Relay product story.
 * Avoid unverified claims (full offline STT, zero retention, etc.).
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is',
    question: 'What is Relay?',
    answer:
      'Relay is a voice layer for your Mac - speak naturally and get polished text where you’re already working.',
    detail:
      'It turns speech into context-aware writing so your words land in the right place, in the right form.',
  },
  {
    id: 'across-apps',
    question: 'Does Relay work across apps?',
    answer:
      'Relay is built to work across the applications you already use on your Mac.',
    detail:
      'Wherever you can type, the goal is the same: speak once, and Relay helps your words appear there.',
  },
  {
    id: 'vs-voice-typing',
    question: 'How is Relay different from normal voice typing?',
    answer:
      'Built-in voice typing usually writes what you said, word for word - including fillers and false starts.',
    detail:
      'Relay is built to polish what you meant, then place it into your workflow.',
  },
  {
    id: 'app-context',
    question: 'Can Relay understand the app I’m using?',
    answer:
      'Yes - context is a core part of Relay. The same speech can become a Slack message, email, note, or prompt.',
    detail: 'That’s the idea behind “one voice, the right words.”',
  },
  {
    id: 'apps-list',
    question: 'Does Relay work with Slack, Gmail, Notion and Cursor?',
    answer:
      'Those are exactly the kinds of destinations Relay is built for - messaging, email, docs, and coding tools.',
    detail:
      'Demos on this site show how one spoken update can adapt across common Mac workflows.',
  },
  {
    id: 'customize',
    question: 'Can I customize how Relay writes?',
    answer:
      'Yes. App modes and preferences live in Settings so Relay can match how you write in different places.',
    detail:
      'Tone and destination shape what your words become - from a quick Slack note to a clearer email.',
  },
  {
    id: 'vocabulary',
    question: 'Can Relay learn my vocabulary?',
    answer:
      'Relay is designed around your vocabulary, people, and products - so names and terms stay intact.',
    detail:
      'Shortcuts and style preferences help it write more like you over time.',
  },
  {
    id: 'voice-data',
    question: 'Is my voice data stored?',
    answer:
      'Relay only listens when you explicitly start a dictation. Your voice is processed to create your output, while temporary audio and session data are discarded after processing.',
    detail:
      'Your Recent Dictations are kept so you can review previous outputs, copy or paste them again, and fix transcription or wording issues when needed.',
  },
  {
    id: 'offline',
    question: 'Does Relay work offline?',
    answer:
      'Relay is a Mac app. Core UI works locally; speech needs a network connection for transcription.',
    detail:
      'Relay does not keep a permanent voice archive. Sessions start only when you ask.'
  },
  {
    id: 'permissions',
    question: 'What permissions does Relay require?',
    answer:
      'On macOS, Relay needs microphone access to hear you, and Accessibility so it can type into the active app.',
    detail:
      'You can review these anytime in System Settings - Relay only acts when you start a session.',
  },
  {
    id: 'macos',
    question: 'Is Relay available for macOS?',
    answer:
      'Yes. Relay is built for macOS - download it and use Option + Space to start flowing.',
    detail: 'Made for the Mac menu bar, floating widget, and the apps you already live in.',
  },
];
