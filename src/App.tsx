import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RotateCcw, HardDrive, Download, Upload, Cpu, Monitor, Maximize, Disc, Settings, Network, Link, Power, CheckSquare, Terminal } from 'lucide-react';
import { useV86, PRESET_PROFILES } from './hooks/useV86';
import { V86Screen } from './components/V86Screen';
import { LandingPage } from './components/LandingPage';

function formatUptime(seconds: number) {

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const MenuBarItem = ({ label, items, activeMenu, setActiveMenu, id }: { label: string, items: {label: string, action?: () => void, disabled?: boolean, separator?: boolean}[], activeMenu: string | null, setActiveMenu: (id: string | null) => void, id: string }) => {
  const isOpen = activeMenu === id;
  
  return (
    <div className="relative">
      <div 
        className={`px-2 py-0.5 cursor-pointer text-xs ${isOpen ? 'bg-[#3e3e42] text-white' : 'text-slate-300 hover:bg-slate-700'}`}
        onClick={() => setActiveMenu(isOpen ? null : id)}
      >
        {label}
      </div>
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-0 bg-[#2d2d30] border border-[#3e3e42] shadow-lg min-w-[200px] py-1 z-50 flex flex-col"
        >
          {items.map((item, i) => item.separator ? (
            <div key={i} className="h-px bg-[#3e3e42] my-1 w-full shrink-0"></div>
          ) : (
            <div 
              key={i} 
              className={`px-6 py-1 text-xs ${item.disabled ? 'text-slate-500 cursor-default' : 'text-slate-300 hover:bg-[#007acc] hover:text-white cursor-pointer'}`}
              onClick={() => {
                if (!item.disabled && item.action) {
                  item.action();
                  setActiveMenu(null);
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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

export default function App() {
  const [showVM, setShowVM] = useState(false);

  const {
    screenRef,
    emulatorRef,
    startEmulator,
    stopEmulator,
    restartEmulator,
    goFullscreen,
    saveState,
    destroyEmulator,
    isRunning,
    hasSaveState,
    uptime,
    downloadProgress,
    downloadError,
    activeProfile,
    setActiveProfile
  } = useV86();

  const [logs, setLogs] = useState<string[]>(['[kernel] Virtualization engine initialized.']);
  const [stats, setStats] = useState<string>('');
  const [activeTab, setActiveTab] = useState('hardware');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const logsConsoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.relative')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (logsConsoleRef.current) {
      logsConsoleRef.current.scrollTop = logsConsoleRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      setLogs(prev => [...prev, '[v86] Powering on virtual machine...']);
      interval = window.setInterval(() => {
        if (emulatorRef.current) {
          try {
            const instrStats = emulatorRef.current.get_instruction_stats();
            setStats(instrStats || '');
          } catch (e) {
            // ignore
          }
        }
      }, 1000);
    } else if (uptime > 0) {
      setLogs(prev => [...prev, '[v86] Virtual machine powered off.']);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, emulatorRef, uptime]);

  useEffect(() => {
    if (downloadProgress) {
        const name = downloadProgress.file_name.split('/').pop() || downloadProgress.file_name;
        // Check if we already logged this file to avoid spamming the console
        setLogs(prev => {
            const lastLog = prev[prev.length - 1];
            if (!lastLog || !lastLog.includes(`Downloading ${name}`)) {
                return [...prev, `[api] Downloading ${name}...`];
            }
            return prev;
        });
    }
  }, [downloadProgress?.file_name]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileId = e.target.value;
    const profile = PRESET_PROFILES.find(p => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
      setLogs(prev => [...prev, `[api] Image changed: ${profile.name}`]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveProfile({
        id: 'custom',
        name: file.name,
        cdromFile: file,
        memorySize: activeProfile.memorySize,
        vgaMemorySize: activeProfile.vgaMemorySize,
      });
      setLogs(prev => [...prev, `[api] Hosted ISO attached: ${file.name}`]);
    }
  };

  const handleStart = () => startEmulator(false);
  const handleRestore = () => {
    setLogs(prev => [...prev, '[vmshell] Restoring snapshot from volume...']);
    startEmulator(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!showVM ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-screen w-full"
        >
          <LandingPage onEnter={() => setShowVM(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="vm"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-screen bg-[#1e1e1e] text-[#cccccc] flex flex-col font-sans overflow-hidden select-none"
        >
          
          {/* Menu Bar */}
      <div className="bg-[#2d2d30] flex items-center px-1 py-0.5 border-b border-[#3e3e42]">
        <MenuBarItem 
          id="file" 
          label="File" 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          items={[
            { label: 'Preferences...', disabled: true },
            { separator: true },
            { label: 'Export Appliance...', disabled: true },
            { label: 'Import Appliance...', disabled: true },
            { separator: true },
            { label: 'Exit', action: () => { stopEmulator(); destroyEmulator(); } }
          ]} 
        />
        <MenuBarItem 
          id="machine" 
          label="Machine" 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          items={[
            { label: 'Settings...', disabled: true },
            { separator: true },
            { label: 'Take Snapshot...', action: saveState, disabled: !isRunning },
            { label: 'Restore Snapshot...', action: handleRestore, disabled: isRunning || !hasSaveState },
            { separator: true },
            { label: 'Pause', action: stopEmulator, disabled: !isRunning },
            { label: 'Reset', action: restartEmulator, disabled: !isRunning },
            { label: 'ACPI Shutdown', action: () => { stopEmulator(); destroyEmulator(); }, disabled: !isRunning }
          ]} 
        />
        <MenuBarItem 
          id="view" 
          label="View" 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          items={[
            { label: 'Fullscreen Mode', action: goFullscreen, disabled: !isRunning },
            { label: 'Scaled Mode', disabled: true },
            { separator: true },
            { label: 'Adjust Window Size', disabled: true }
          ]} 
        />
        <MenuBarItem 
          id="input" 
          label="Input" 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          items={[
            { label: 'Keyboard', disabled: true },
            { label: 'Mouse Integration', disabled: true }
          ]} 
        />
        <MenuBarItem 
          id="devices" 
          label="Devices" 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          items={[
            { label: 'Optical Drives', disabled: true },
            { label: 'Audio', disabled: true },
            { label: 'Network', disabled: true },
            { label: 'USB', disabled: true }
          ]} 
        />
        <MenuBarItem 
          id="help" 
          label="Help" 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          items={[
            { label: 'Contents', disabled: true },
            { label: 'VirtualBox Web Site', disabled: true },
            { separator: true },
            { label: 'About VirtualBox', disabled: true }
          ]} 
        />
      </div>

      {/* Main Toolbar */}
      <div className="bg-[#2d2d30] flex items-center px-2 py-1 border-b border-[#1e1e1e] shadow-sm gap-1">
        {!isRunning ? (
          <ToolbarButton icon={Play} label="Power On" onClick={handleStart} />
        ) : (
          <ToolbarButton icon={Power} label="Shut Down" onClick={() => { stopEmulator(); destroyEmulator(); }} />
        )}
        <ToolbarButton icon={RotateCcw} label="Restart" disabled={!isRunning} onClick={restartEmulator} />
        
        <div className="w-px h-8 bg-[#3e3e42] mx-2"></div>
        
        <ToolbarButton icon={Download} label="Take Snapshot" disabled={!isRunning} onClick={saveState} />
        <ToolbarButton icon={Upload} label="Restore Snapshot" disabled={isRunning || !hasSaveState} onClick={handleRestore} />
        
        <div className="w-px h-8 bg-[#3e3e42] mx-2"></div>
        
        <ToolbarButton icon={Maximize} label="Fullscreen" onClick={goFullscreen} />
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Hardware/Details Pane */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col flex-shrink-0">
          
          <div className="flex border-b border-[#3e3e42] bg-[#2d2d30]">
            <button 
              className={`flex-1 py-1 text-xs px-2 ${activeTab === 'hardware' ? 'bg-[#1e1e1e] border-t-2 border-t-blue-500' : 'text-[#999]'}`}
              onClick={() => setActiveTab('hardware')}
            >
              Hardware
            </button>
            <button 
              className={`flex-1 py-1 text-xs px-2 ${activeTab === 'details' ? 'bg-[#1e1e1e] border-t-2 border-t-blue-500' : 'text-[#999]'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 text-[11px] font-sans">
            {activeTab === 'hardware' && (
              <div className="space-y-4">
                
                {/* Configuration Block */}
                <div>
                  <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">VM Configuration</div>
                  <div className="grid grid-cols-[80px_1fr] gap-y-2 items-center mb-2">
                    <label className="text-slate-400">Profile</label>
                    <select
                      value={activeProfile.id}
                      onChange={handleProfileChange}
                      disabled={isRunning}
                      className="bg-[#333333] border border-[#454545] text-slate-200 outline-none p-0.5 rounded-sm disabled:opacity-50"
                    >
                      {PRESET_PROFILES.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    <label className="text-slate-400 text-[10px] leading-tight">ISO Image</label>
                    {activeProfile.id === 'custom' ? (
                      <input 
                        type="file" 
                        accept=".iso,.img,.img.zip"
                        onChange={handleFileUpload}
                        disabled={isRunning}
                        className="bg-[#333333] border border-[#454545] text-slate-200 p-0.5 rounded-sm w-full file:hidden text-[10px]"
                      />
                    ) : (
                      <div className="text-slate-300 truncate" title={activeProfile.name}>{activeProfile.name}</div>
                    )}
                  </div>
                </div>

                {/* Device List */}
                <div>
                  <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">Virtual Devices</div>
                  <ul className="space-y-2">
                    
                    <li className="flex items-start gap-2 group">
                      <Cpu size={14} className="mt-0.5 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-slate-300">Memory</div>
                        <select
                          value={activeProfile.memorySize}
                          onChange={(e) => setActiveProfile({...activeProfile, memorySize: Number(e.target.value)})}
                          disabled={isRunning}
                          className="bg-[#333333] border border-[#3e3e42] text-slate-300 p-0.5 w-full outline-none mt-1 group-hover:border-[#555] rounded-sm disabled:opacity-50"
                        >
                          <option value={32}>32 MB</option>
                          <option value={64}>64 MB</option>
                          <option value={128}>128 MB</option>
                          <option value={256}>256 MB</option>
                          <option value={512}>512 MB</option>
                        </select>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <Monitor size={14} className="mt-0.5 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-slate-300">Display</div>
                        <div className="text-slate-500 font-mono text-[10px] mt-0.5">Bochs VBE</div>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <Disc size={14} className="mt-0.5 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-slate-300">CD/DVD (IDE)</div>
                        <div className="text-slate-500 font-mono text-[10px] mt-0.5 truncate max-w-[180px]">{activeProfile.name}</div>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <Network size={14} className="mt-0.5 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-slate-300">Network Adapter</div>
                        <div className="text-slate-500 font-mono text-[10px] mt-0.5">NAT (virtio)</div>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">Real-term Status</div>
                  <table className="w-full text-slate-400 font-mono text-[10px]">
                    <tbody>
                      <tr>
                        <td className="py-1">State</td>
                        <td className={`py-1 ${isRunning ? 'text-green-400' : 'text-slate-500'}`}>{isRunning ? 'Running' : 'Powered Off'}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Uptime</td>
                        <td className="py-1 text-slate-300">{formatUptime(uptime)}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Save State</td>
                        <td className="py-1 text-slate-300">{hasSaveState ? 'Present' : 'None'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {stats && (
                  <div>
                    <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">Instruction Telemetry</div>
                    <div className="bg-[#1e1e1e] border border-[#3e3e42] p-2 text-slate-500 font-mono text-[9px] max-h-48 overflow-y-auto whitespace-pre-wrap rounded-sm break-all">
                      {stats}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Split View (VM Screen + Console) */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          
          {/* Main VM Screen (Upper) */}
          <div className="flex-1 relative overflow-auto flex shadow-inner shadow-black/50 bg-[#161616]">
            <div className="w-full h-full flex items-center justify-center p-4">
              
              <div className="bg-[#0c0c0c] border border-[#3e3e42] shadow-xl relative inline-block rounded-sm overflow-hidden min-w-[720px] min-h-[400px]">
                
                {/* Vintage scanline/crt effect overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10"></div>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] z-10"></div>

                 {!isRunning && !downloadProgress && !downloadError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0c] z-20">
                    <Monitor size={32} className="text-[#333] mb-4" />
                    <div className="text-[#666] font-mono text-sm uppercase">Guest is not running</div>
                  </div>
                )}
                
                {downloadError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0c] z-20">
                    <div className="text-red-500 font-mono text-sm uppercase mb-2">Download Error</div>
                    <div className="text-[#888] font-mono text-xs max-w-[400px] text-center break-all">
                      Failed to fetch '{downloadError}'. The resource might be unavailable or blocked by CORS.
                    </div>
                  </div>
                )}
                
                {downloadProgress && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0c] z-20">
                    <div className="w-64 max-w-full">
                      <div className="flex justify-between text-[#888] font-mono text-xs mb-2">
                        <span>Loading {downloadProgress.file_name.split('/').pop()}</span>
                        <span>
                          {downloadProgress.lengthComputable 
                            ? `${Math.round(downloadProgress.loaded / 1024 / 1024)}MB / ${Math.round(downloadProgress.total / 1024 / 1024)}MB` 
                            : `${Math.round(downloadProgress.loaded / 1024 / 1024)}MB`}
                        </span>
                      </div>
                      <div className="h-1 bg-[#222] rounded-full overflow-hidden w-full">
                        <div 
                          className="h-full bg-[#007acc] transition-all duration-300"
                          style={{ width: `${downloadProgress.lengthComputable ? (downloadProgress.loaded / downloadProgress.total) * 100 : 100}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2 text-[#555] font-mono text-[10px]">
                        File {downloadProgress.file_index + 1} of {downloadProgress.file_count}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* The actual v86 screen container */}
                <V86Screen screenRef={screenRef} />
              </div>

            </div>
          </div>

          {/* Draggable Resizer (Visual Only for now) */}
          <div className="h-1 bg-[#252526] border-y border-[#3e3e42] cursor-row-resize flex items-center justify-center">
            <div className="w-8 h-0.5 bg-[#454545] rounded-full"></div>
          </div>

          {/* Console / Event Log (Lower) */}
          <div className="h-48 bg-[#1e1e1e] flex flex-col flex-shrink-0">
            <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-2 py-1 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal size={12} /> Console Output
            </div>
            <div ref={logsConsoleRef} className="flex-1 overflow-y-auto p-2 font-mono text-[11px] text-[#cccccc] bg-[#1e1e1e]">
              {logs.map((log, i) => (
                <div key={i} className="mb-0.5 hover:bg-[#2a2d2e] px-1 -mx-1">{log}</div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Status Bar */}
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

        </motion.div>
      )}
    </AnimatePresence>
  );
}

