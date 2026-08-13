import type { WorkspaceApp } from '../data/workspace';

type AppSurfaceProps = {
  app: WorkspaceApp;
  active: boolean;
  output: string;
  phase: 'idle' | 'listening' | 'raw' | 'processing' | 'output';
};

export function AppSurface({ app, active, output, phase }: AppSurfaceProps) {
  const showOutput = phase === 'output' || (active && phase === 'idle');

  if (app.id === 'gmail') {
    return (
      <div className="flex h-full flex-col text-left">
        <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2 text-[10px] text-[#8a8a93]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: app.accent }} />
          Compose · To: Sarah
        </div>
        <div className="space-y-2 p-3 text-[11px] leading-relaxed text-[#c8c8d0]">
          <p>
            <span className="text-[#8a8a93]">Subject:</span> Project update
          </p>
          <div className="min-h-[72px] whitespace-pre-wrap text-[#f5f5f7]">
            {showOutput ? output : phase === 'raw' || phase === 'processing' ? '…' : 'Start typing or speak with Live Flow'}
          </div>
        </div>
      </div>
    );
  }

  if (app.id === 'slack') {
    return (
      <div className="flex h-full flex-col text-left">
        <div className="border-b border-white/8 px-3 py-2 text-[10px] text-[#8a8a93]"># product-team</div>
        <div className="flex-1 space-y-2 p-3 text-[11px]">
          <p className="text-[#8a8a93]">Georgie: Any update?</p>
          <div className="rounded-lg bg-[rgba(97,31,105,0.25)] px-2.5 py-2 text-[#f5f5f7]">
            <span className="mb-1 block text-[10px] text-[#c9a0d0]">Tanish</span>
            {showOutput ? output : 'Message…'}
          </div>
        </div>
      </div>
    );
  }

  if (app.id === 'notion') {
    return (
      <div className="flex h-full flex-col text-left">
        <div className="border-b border-white/8 px-3 py-2 text-[10px] text-[#8a8a93]">Meeting Notes</div>
        <div className="space-y-2 p-3 text-[11px] leading-relaxed text-[#d4d4dc]">
          {showOutput ? (
            <pre className="whitespace-pre-wrap font-sans text-[#f5f5f7]">{output}</pre>
          ) : (
            <>
              <p className="text-[#8a8a93]">Decisions</p>
              <p className="text-[#8a8a93]">Action Items</p>
              <p className="text-[#8a8a93]">Next Steps</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (app.id === 'cursor') {
    return (
      <div className="flex h-full flex-col text-left font-mono">
        <div className="border-b border-white/8 px-3 py-2 text-[10px] text-[#8a8a93]">Agent</div>
        <div className="p-3 text-[11px] leading-relaxed text-[#c8c8d0]">
          <p className="mb-2 text-[#8a8a93]">// instruction</p>
          <p className="text-[#f5f5f7]">{showOutput ? output : 'Waiting for Live Flow…'}</p>
        </div>
      </div>
    );
  }

  if (app.id === 'chatgpt') {
    return (
      <div className="flex h-full flex-col text-left">
        <div className="border-b border-white/8 px-3 py-2 text-[10px] text-[#8a8a93]">ChatGPT</div>
        <div className="space-y-2 p-3 text-[11px]">
          <p className="text-[#8a8a93]">User</p>
          <div className="rounded-lg border border-white/8 bg-[#121214] px-2.5 py-2 text-[#f5f5f7]">
            {showOutput ? output : 'Help me…'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col text-left">
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2 text-[10px] text-[#8a8a93]">
        <span className="rounded bg-white/10 px-1.5 py-0.5">liveflow.app</span>
        Research
      </div>
      <div className="p-3 text-[11px] leading-relaxed text-[#d4d4dc]">
        {showOutput ? output : 'Capture notes from your voice…'}
      </div>
    </div>
  );
}
