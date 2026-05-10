import React from 'react';
import { Cpu, Github } from 'lucide-react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Architecture } from './Architecture';

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#dadce0] bg-white flex items-center justify-between z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#1a73e8] rounded-sm flex items-center justify-center">
            <Cpu size={14} className="text-white" />
          </div>
          <h1 className="text-[18px] font-medium tracking-tight text-[#3c4043]">VoidVM Workspace</h1>
        </div>
        <div className="flex items-center gap-6 text-[14px] font-medium text-[#5f6368]">
          <a href="#" className="hover:text-[#202124] transition-colors">Documentation</a>
          <a href="#" className="hover:text-[#202124] transition-colors">Architecture</a>
          <a href="https://github.com/sxwik" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#202124] transition-colors bg-[#f1f3f4] px-3 py-1.5 rounded-full">
            <Github size={16} /> @sxwik
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col">
        <Hero onEnter={onEnter} />
        <Features />
        <Architecture />
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#dadce0] px-6 py-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-6 md:flex-row text-[13px] text-[#5f6368]">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Github size={16} />
            <span>Built by</span>
            <a href="https://github.com/sxwik" target="_blank" rel="noreferrer" className="text-[#1a73e8] font-medium hover:underline">@sxwik</a>
          </div>
          
          <div className="text-center text-[12px] max-w-lg leading-relaxed px-4">
            Available under the <strong className="text-[#202124]">MIT License</strong>. Use it, study it, edit it—but don't steal.<br/>
            VoidVM 2026. Data resides entirely within your local browser sandbox.
          </div>

          <div className="font-mono text-[12px] flex-shrink-0 bg-[#f1f3f4] px-3 py-1.5 rounded text-[#3c4043]">React 18 / v86 / WASM</div>
        </div>
      </footer>
    </div>
  );
}
