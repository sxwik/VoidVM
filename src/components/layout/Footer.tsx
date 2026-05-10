import React from 'react';
import { useV86 } from '../../hooks/useV86';
import { CheckSquare } from 'lucide-react';

export const Footer: React.FC<{ v86Info: ReturnType<typeof useV86> }> = ({ v86Info }) => {
  const { isRunning, activeProfile } = v86Info;

  return (
    <div className="bg-[#007acc] text-white flex items-center justify-between px-2 py-0.5 text-[11px]">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1"><CheckSquare size={10} /> Ready</span>
        <span className="opacity-80">v86.wasm loaded</span>
      </div>
      <div className="flex items-center gap-4 opacity-80 font-mono">
        <span>Mem: {activeProfile.memorySize}MB</span>
        <span>{isRunning ? 'Running' : 'Stopped'}</span>
      </div>
    </div>
  );
};
