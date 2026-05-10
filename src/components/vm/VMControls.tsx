import React from 'react';
import { Play, Power, RotateCcw, Download, Upload, Maximize } from 'lucide-react';
import { useV86 } from '../../hooks/useV86';

const ToolbarButton = ({ icon: Icon, label, disabled, onClick }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="flex flex-col items-center justify-center gap-1 w-12 h-12 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent border border-transparent hover:border-slate-600 rounded-sm transition-none"
    title={label}
  >
    <Icon size={18} className={disabled ? "text-slate-500" : "text-slate-200"} />
  </button>
);

export const VMControls: React.FC<{ v86Info: ReturnType<typeof useV86> }> = ({ v86Info }) => {
  const { isRunning, startEmulator, stopEmulator, destroyEmulator, restartEmulator, saveState, hasSaveState, goFullscreen } = v86Info;

  return (
    <div className="bg-[#2d2d30] flex items-center px-2 py-1 border-b border-[#1e1e1e] shadow-sm gap-1">
      {!isRunning ? (
        <ToolbarButton icon={Play} label="Power On" onClick={() => startEmulator(false)} />
      ) : (
        <ToolbarButton icon={Power} label="Shut Down" onClick={() => { stopEmulator(); destroyEmulator(); }} />
      )}
      <ToolbarButton icon={RotateCcw} label="Restart" disabled={!isRunning} onClick={restartEmulator} />
      
      <div className="w-px h-8 bg-[#3e3e42] mx-2"></div>
      
      <ToolbarButton icon={Download} label="Take Snapshot" disabled={!isRunning} onClick={saveState} />
      <ToolbarButton icon={Upload} label="Restore Snapshot" disabled={isRunning || !hasSaveState} onClick={() => startEmulator(true)} />
      
      <div className="w-px h-8 bg-[#3e3e42] mx-2"></div>
      
      <ToolbarButton icon={Maximize} label="Fullscreen" onClick={goFullscreen} />
    </div>
  );
};
