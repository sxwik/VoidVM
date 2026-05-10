import { useState, useRef, useCallback, useEffect } from 'react';
import { get } from 'idb-keyval';
import { BootProfile } from '../types/profiles';
import { PRESET_PROFILES } from '../runtime/profiles';
import { emulator } from '../runtime/emulator/v86';

export function useV86() {
  const [activeProfile, setActiveProfile] = useState<BootProfile>(PRESET_PROFILES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSaveState, setHasSaveState] = useState(false);
  
  const [uptime, setUptime] = useState(0);
  const uptimeIntervalRef = useRef<number | null>(null);

  const screenRef = useRef<HTMLDivElement | null>(null);

  const [downloadProgress, setDownloadProgress] = useState<{
    file_index: number;
    file_count: number;
    file_name: string;
    lengthComputable: boolean;
    total: number;
    loaded: number;
  } | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Subscribe to emulator events
  useEffect(() => {
    const unsubscribe = emulator.subscribe(
      () => {
        setIsRunning(emulator.isRunning);
      },
      (e: any) => {
        setDownloadProgress(e);
        if (e.loaded >= e.total && e.file_index === e.file_count - 1) {
          setTimeout(() => setDownloadProgress(null), 1000);
        }
      },
      (errorName: string) => {
        setDownloadError(errorName);
        setDownloadProgress(null);
      }
    );
    return unsubscribe;
  }, []);

  // Track uptime
  useEffect(() => {
    if (isRunning) {
      uptimeIntervalRef.current = window.setInterval(() => setUptime(u => u + 1), 1000);
    } else {
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
    }
    return () => {
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
    };
  }, [isRunning]);

  // Check if save state exists on mount
  useEffect(() => {
    get('v86-save-state').then(val => {
      if (val) setHasSaveState(true);
    });
  }, []);

  const startEmulator = useCallback(async (loadFromSave = false) => {
    if (!screenRef.current) return;
    
    setUptime(0);
    setDownloadError(null);
    try {
      await emulator.start(activeProfile, screenRef.current, loadFromSave);
    } catch (e: any) {
      console.error("Failed to start emulator:", e);
      alert("Failed to start emulator: " + e.message);
    }
  }, [activeProfile]);

  const stopEmulator = useCallback(() => {
    emulator.stop();
  }, []);

  const restartEmulator = useCallback(() => {
    setUptime(0);
    emulator.restart();
  }, []);

  const goFullscreen = useCallback(() => {
    if (screenRef.current) {
      const el = screenRef.current;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
  }, []);

  const saveState = useCallback(async () => {
    const success = await emulator.saveState();
    if (success) {
      setHasSaveState(true);
      alert('State saved successfully to IndexedDB!');
    }
  }, []);

  const destroyEmulator = useCallback(() => {
    emulator.destroy();
    setUptime(0);
  }, []);

  useEffect(() => {
    return () => {
      destroyEmulator();
    };
  }, [destroyEmulator]);

  // We can provide a getter for instruction stats 
  // without re-rendering the whole hook every second
  const getEmulatorStats = useCallback(() => {
    return emulator.getInstructionStats();
  }, []);

  return {
    screenRef,
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
    setActiveProfile,
    getEmulatorStats
  };
}
