import React from 'react';
import { ArrowRight, Github } from 'lucide-react';

export const Hero: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
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
  );
};
