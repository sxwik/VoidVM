import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Terminal } from 'lucide-react';
import { useV86 } from './hooks/useV86';
import { useVMStore } from './store/vmStore';
import { VMScreen } from './components/vm/VMScreen';
import { VMControls } from './components/vm/VMControls';
import { LandingPage } from './components/landing/LandingPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

export default function App() {
  const [showVM, setShowVM] = useState(false);
  const v86Info = useV86();
  const { isRunning, downloadProgress, downloadError, getEmulatorStats, screenRef } = v86Info;

  const { logs, addLog, stats, setStats } = useVMStore();
  const logsConsoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsConsoleRef.current) {
      logsConsoleRef.current.scrollTop = logsConsoleRef.current.scrollHeight;
    }
  }, [logs]);

  const prevIsRunning = useRef(isRunning);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      if (!prevIsRunning.current) {
        addLog('[v86] Powering on virtual machine...');
      }
      interval = window.setInterval(() => {
        try {
          const instrStats = getEmulatorStats();
          setStats(instrStats || '');
        } catch (e) {
          // ignore
        }
      }, 1000);
    } else {
      if (prevIsRunning.current) {
        addLog('[v86] Virtual machine powered off.');
      }
    }
    
    prevIsRunning.current = isRunning;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, getEmulatorStats, addLog, setStats]);

  useEffect(() => {
    if (downloadProgress) {
        const name = downloadProgress.file_name.split('/').pop() || downloadProgress.file_name;
        const logMsg = `[api] Downloading ${name}...`;
        if (logs[logs.length - 1] !== logMsg) {
          addLog(logMsg);
        }
    }
  }, [downloadProgress, addLog, logs]);

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
          
          <Header v86Info={v86Info} />
          <VMControls v86Info={v86Info} />

          <div className="flex-1 flex overflow-hidden">
            <Sidebar v86Info={v86Info} stats={stats} />

            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
              <div className="flex-1 relative overflow-auto flex shadow-inner shadow-black/50 bg-[#161616]">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="bg-[#0c0c0c] border border-[#3e3e42] shadow-xl relative inline-block rounded-sm overflow-hidden min-w-[720px] min-h-[400px]">
                    
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
                    
                    <VMScreen screenRef={screenRef} />
                  </div>
                </div>
              </div>

              <div className="h-1 bg-[#252526] border-y border-[#3e3e42] cursor-row-resize flex items-center justify-center">
                <div className="w-8 h-0.5 bg-[#454545] rounded-full"></div>
              </div>

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

          <Footer v86Info={v86Info} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

