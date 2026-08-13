/** Short raw → clean sentence pairs for the "thought wave" correction bridge. */

export type CorrectionExample = {
  id: string;
  /** Compact raw fragment, short enough to sit inside a small cloud. */
  shortBefore: string;
  /** Exact substring inside `shortBefore` to strike through (case-insensitive). */
  flaw: string;
  /** Compact polished fragment. */
  shortAfter: string;
};

export const CORRECTIONS: CorrectionExample[] = [
  {
    id: 'filler',
    shortBefore: "so, um... testing's done",
    flaw: 'um',
    shortAfter: 'Testing is almost done.',
  },
  {
    id: 'uncertainty',
    shortBefore: 'maybe... still waiting?',
    flaw: 'maybe',
    shortAfter: 'Notes were sent out.',
  },
  {
    id: 'structure',
    shortBefore: 'like, something feels off',
    flaw: 'like',
    shortAfter: 'Numbers need verifying.',
  },
];
