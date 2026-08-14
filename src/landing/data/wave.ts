import type { TokenKind } from './orbit';

/** Word-level speech for the cleanup wave: speak → punctuate → clean. */

export type WaveWord = {
  id: string;
  spoken: string;
  kind: TokenKind;
  /** `null` drops the word. A string morphs it. Omit to keep `spoken`. */
  clean?: string | null;
  /** Punctuation that pops in after this word. */
  punct?: string;
  cap?: boolean;
};

export type WaveScene = {
  id: string;
  words: WaveWord[];
  clean: string;
};

export const WAVE_SCENES: WaveScene[] = [
  {
    id: 'ship',
    clean: 'Let’s ship this tonight. The voice layer is ready - this is going to be huge.',
    words: [
      { id: 'a1', spoken: 'hey', kind: 'filler', clean: null },
      { id: 'a2', spoken: 'so', kind: 'filler', clean: null },
      { id: 'a3', spoken: 'um', kind: 'filler', clean: null },
      { id: 'a4', spoken: 'wait', kind: 'filler', clean: null },
      { id: 'a5', spoken: 'we', kind: 'correction', clean: "Let's", cap: true },
      { id: 'a6', spoken: 'should', kind: 'filler', clean: null },
      { id: 'a7', spoken: 'like', kind: 'filler', clean: null },
      { id: 'a8', spoken: 'actually', kind: 'filler', clean: null },
      { id: 'a9', spoken: 'ship', kind: 'keep' },
      { id: 'a10', spoken: 'this', kind: 'keep' },
      { id: 'a11', spoken: 'tonight', kind: 'keep', punct: '.' },
      { id: 'a12', spoken: 'I', kind: 'filler', clean: null },
      { id: 'a13', spoken: 'mean', kind: 'filler', clean: null },
      { id: 'a14', spoken: 'the', kind: 'repetition', clean: null },
      { id: 'a15', spoken: 'the', kind: 'repetition', clean: null },
      { id: 'a16', spoken: 'voice', kind: 'keep', cap: true },
      { id: 'a17', spoken: 'layer', kind: 'keep' },
      { id: 'a18', spoken: 'is', kind: 'keep' },
      { id: 'a19', spoken: 'ready', kind: 'keep', punct: ' - ' },
      { id: 'a20', spoken: 'this', kind: 'keep' },
      { id: 'a21', spoken: 'is', kind: 'keep' },
      { id: 'a22', spoken: 'gonna', kind: 'correction', clean: 'going to' },
      { id: 'a23', spoken: 'be', kind: 'keep' },
      { id: 'a24', spoken: 'huge', kind: 'keep', punct: '.' },
    ],
  },
  {
    id: 'every-app',
    clean: 'What if you just speak - and it lands in every app?',
    words: [
      { id: 'b1', spoken: 'uh', kind: 'filler', clean: null },
      { id: 'b2', spoken: 'what', kind: 'keep', cap: true },
      { id: 'b3', spoken: 'if', kind: 'keep' },
      { id: 'b4', spoken: 'you', kind: 'keep' },
      { id: 'b5', spoken: 'just', kind: 'keep' },
      { id: 'b6', spoken: 'speak', kind: 'keep', punct: ' - ' },
      { id: 'b7', spoken: 'and', kind: 'keep' },
      { id: 'b8', spoken: 'it', kind: 'keep' },
      { id: 'b9', spoken: 'like', kind: 'filler', clean: null },
      { id: 'b10', spoken: 'lands', kind: 'keep' },
      { id: 'b11', spoken: 'in', kind: 'keep' },
      { id: 'b12', spoken: 'every', kind: 'keep' },
      { id: 'b13', spoken: 'app', kind: 'keep', punct: '?' },
      { id: 'b14', spoken: 'wait', kind: 'filler', clean: null },
      { id: 'b15', spoken: 'the', kind: 'repetition', clean: null },
      { id: 'b16', spoken: 'the', kind: 'repetition', clean: null },
      { id: 'b17', spoken: 'whole', kind: 'filler', clean: null },
      { id: 'b18', spoken: 'Mac', kind: 'filler', clean: null },
      { id: 'b19', spoken: 'is', kind: 'filler', clean: null },
      { id: 'b20', spoken: 'listening', kind: 'filler', clean: null },
      { id: 'b21', spoken: 'now', kind: 'filler', clean: null },
      { id: 'b22', spoken: 'this', kind: 'filler', clean: null },
      { id: 'b23', spoken: 'is', kind: 'filler', clean: null },
      { id: 'b24', spoken: 'insane', kind: 'filler', clean: null },
    ],
  },
];
