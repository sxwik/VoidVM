import React from 'react';
import { Monitor, Cpu, Terminal, HardDrive } from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
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
  );
};
