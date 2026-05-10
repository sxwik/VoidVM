import React from 'react';
import { Terminal, Cpu, HardDrive, Monitor, Github, Code, ArrowRight, ArrowDown } from 'lucide-react';

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

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 pt-10">
          <div className="text-[12px] font-bold text-[#1a73e8] tracking-[0.1em] uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse"></span>
            Browser-Native x86 Environment
          </div>
          <h2 className="text-[48px] md:text-[56px] font-normal tracking-tight text-[#202124] mb-6 leading-[1.1]">
            A lightweight virtualization tool for experimentation.
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#5f6368] mb-8 leading-relaxed font-light max-w-2xl">
            VoidVM gives anyone access to Linux and dev environments directly in the browser. Designed for accessibility—no expensive hardware, no installation complexity, and runs on low-end systems constraints.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <span className="px-2.5 py-1 bg-[#e8f0fe] text-[#164bba] text-[12px] font-medium rounded-full">Optimized for low-end hardware</span>
            <span className="px-2.5 py-1 bg-[#e8f0fe] text-[#164bba] text-[12px] font-medium rounded-full">Zero Installation</span>
            <span className="px-2.5 py-1 bg-[#e8f0fe] text-[#164bba] text-[12px] font-medium rounded-full">WASM Execution</span>
            <span className="px-2.5 py-1 bg-[#e8f0fe] text-[#164bba] text-[12px] font-medium rounded-full">Installs locally via PWA</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={onEnter}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-3 rounded text-[15px] font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              Open Workspace <ArrowRight size={18} />
            </button>
            <a 
              href="https://github.com/sxwik" 
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-[#f1f3f4] text-[#1a73e8] border border-[#dadce0] px-6 py-3 rounded text-[15px] font-medium transition-colors flex items-center gap-2"
            >
              <Github size={18} /> GitHub
            </a>
          </div>

          {/* Compatibility row */}
          <div className="mt-14 pt-8 border-t border-[#dadce0] w-full flex flex-col items-center">
            <div className="text-[11px] text-[#5f6368] font-bold tracking-wider uppercase mb-3">Supported Architectures</div>
            <div className="flex flex-wrap justify-center items-center gap-3 text-[13px] text-[#3c4043] font-mono">
              <span>Arch Linux</span>
              <span className="text-[#dadce0]">•</span>
              <span>TinyCore</span>
              <span className="text-[#dadce0]">•</span>
              <span>Alpine</span>
              <span className="text-[#dadce0]">•</span>
              <span>ReactOS</span>
              <span className="text-[#dadce0]">•</span>
              <span>Tiny11 <span className="text-[#888] text-[11px] font-sans ml-1">(Exp)</span></span>
            </div>
          </div>
        </div>

        {/* Technical Details Grid */}
        <div className="grid md:grid-cols-3 gap-8 border-t border-[#dadce0] pt-16">
          
          <div>
            <div className="mb-4 text-[#1a73e8]"><Terminal size={24} strokeWidth={1.5} /></div>
            <h3 className="text-[16px] font-medium text-[#202124] mb-2">WebAssembly Architecture</h3>
            <p className="text-[#5f6368] text-[14px] leading-relaxed">
              Leverages WebAssembly for near-native instruction translation. Processing hardware interrupts, rendering, and CPU cycles directly within the isolated browser sandbox.
            </p>
          </div>

          <div>
            <div className="mb-4 text-[#1a73e8]"><HardDrive size={24} strokeWidth={1.5} /></div>
            <h3 className="text-[16px] font-medium text-[#202124] mb-2">Stateless & Secure</h3>
            <p className="text-[#5f6368] text-[14px] leading-relaxed">
              100% of execution occurs on the client. Disk images are loaded into browser memory via standard Blob instances. Machine states persist securely via IndexedDB.
            </p>
          </div>

          <div>
            <div className="mb-4 text-[#1a73e8]"><Code size={24} strokeWidth={1.5} /></div>
            <h3 className="text-[16px] font-medium text-[#202124] mb-2">Sandbox For Learning</h3>
            <p className="text-[#5f6368] text-[14px] leading-relaxed">
              Perfect for schools, public computers, or learning Linux basics. Practice terminals and run experiments safely without risking your real system.
            </p>
          </div>

        </div>

        {/* Architecture Section */}
        <div className="mt-28 mb-16 max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <h3 className="text-[28px] font-normal tracking-tight text-[#202124] mb-4">System Architecture</h3>
            <p className="text-[#5f6368] text-[16px] max-w-2xl mx-auto font-light leading-relaxed">
              A layered execution pipeline running completely isolated within the browser sandbox, driven by WebAssembly instruction translation.
            </p>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Connecting Line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-[#e8f0fe] via-[#1a73e8] to-[#dadce0] -translate-x-1/2 z-0 hidden md:block"></div>
            
            {/* Layer 1 */}
            <div className="relative z-10 w-full max-w-lg mb-6">
              <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e8eaed]">
                  <Monitor size={20} className="text-[#5f6368]" />
                </div>
                <h4 className="text-[16px] font-medium text-[#202124] mb-2">Browser Environment</h4>
                <p className="text-[14px] text-[#5f6368] leading-relaxed px-4">
                  React frontend orchestrating UI inputs, state, and rendering VGA output via standard Canvas APIs.
                </p>
              </div>
            </div>

            <div className="w-px h-6 bg-[#1a73e8] md:hidden"></div>

            {/* Layer 2 */}
            <div className="relative z-10 w-full max-w-lg mb-6">
              <div className="bg-white border-[1.5px] border-[#1a73e8] rounded-xl p-6 shadow-[0_8px_24px_rgba(26,115,232,0.12)] text-center relative overflow-hidden">
                <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cpu size={20} className="text-[#1a73e8]" />
                </div>
                <h4 className="text-[16px] font-medium text-[#202124] mb-2">WebAssembly Runtime</h4>
                <p className="text-[14px] text-[#5f6368] leading-relaxed px-4">
                  JIT execution mapping x86 instructions to WASM. Handles flat memory management seamlessly.
                </p>
              </div>
            </div>

            <div className="w-px h-6 bg-[#1a73e8] md:hidden"></div>

            {/* Layer 3 */}
            <div className="relative z-10 w-full max-w-lg mb-6">
              <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e8eaed]">
                  <Terminal size={20} className="text-[#5f6368]" />
                </div>
                <h4 className="text-[16px] font-medium text-[#202124] mb-2">v86 Emulator Core</h4>
                <p className="text-[14px] text-[#5f6368] leading-relaxed px-4">
                  Low-level hardware abstraction mimicking x86 CPUs, SeaBIOS, VGA, and local APIC.
                </p>
              </div>
            </div>

            <div className="w-px h-6 bg-[#dadce0] md:hidden"></div>

            {/* Layer 4 */}
            <div className="relative z-10 w-full max-w-lg mb-10">
              <div className="bg-[#f8f9fa] border border-[#e8eaed] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#dadce0]">
                  <HardDrive size={20} className="text-[#5f6368]" />
                </div>
                <h4 className="text-[16px] font-medium text-[#202124] mb-2">Guest Operating System</h4>
                <p className="text-[14px] text-[#5f6368] leading-relaxed px-4">
                  Linux, BSD, or DOS kernels executing exactly as they would on physical silicon hardware.
                </p>
              </div>
            </div>

            {/* Features Row */}
            <div className="relative z-10 bg-white border border-[#dadce0] rounded-full px-8 py-4 shadow-sm flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#3c4043]">
                <div className="w-2 h-2 rounded-full bg-[#1e8e3e]"></div> 100% Client-side
              </div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#3c4043]">
                <div className="w-2 h-2 rounded-full bg-[#1e8e3e]"></div> Browser Sandbox Protection
              </div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#3c4043]">
                <div className="w-2 h-2 rounded-full bg-[#1e8e3e]"></div> IndexedDB Persistence
              </div>
            </div>
          </div>
        </div>

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
