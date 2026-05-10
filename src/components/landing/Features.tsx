import React from 'react';
import { Terminal, HardDrive, Code } from 'lucide-react';

export const Features: React.FC = () => {
  return (
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
  );
};
