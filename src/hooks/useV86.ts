import { useState, useRef, useCallback, useEffect } from 'react';
import { V86, V86Options } from 'v86';
import { set, get, del } from 'idb-keyval';

export interface BootProfile {
  id: string;
  name: string;
  memorySize: number;
  vgaMemorySize: number;
  cdromPath?: string;
  cdromFile?: File;
  fdaPath?: string;
  bzimagePath?: string;
  isCustom?: boolean;
  statePath?: string;
  filesystem?: {
    baseurl: string;
    basefsUrl?: string;
  };
  netDeviceType?: string;
  cmdline?: string[];
}

export const PRESET_PROFILES: BootProfile[] = [
  { 
    id: 'archlinux', 
    name: 'Arch Linux (9Pfs CDN)', 
    memorySize: 512, 
    vgaMemorySize: 8,
    statePath: '/arch_state-v3.bin.zst',
    filesystem: {
      baseurl: '/proxy/copy.sh/arch/'
    },
    netDeviceType: 'virtio'
  },
  { id: 'linux3', name: 'Damn Small Linux', memorySize: 64, vgaMemorySize: 8, cdromPath: '/images/linux3.iso' },
  { id: 'custom', name: 'Custom ISO (Upload)', memorySize: 256, vgaMemorySize: 8, isCustom: true },
];

export function useV86() {
  const [activeProfile, setActiveProfile] = useState<BootProfile>(PRESET_PROFILES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSaveState, setHasSaveState] = useState(false);
  
  // Telemetry stats
  const [uptime, setUptime] = useState(0);

  const emulatorRef = useRef<V86 | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const uptimeIntervalRef = useRef<number | null>(null);

  const [downloadProgress, setDownloadProgress] = useState<{
    file_index: number;
    file_count: number;
    file_name: string;
    lengthComputable: boolean;
    total: number;
    loaded: number;
  } | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Check if save state exists on mount
  useEffect(() => {
    get('v86-save-state').then(val => {
      if (val) setHasSaveState(true);
    });
  }, []);

  const createOptions = (profile: BootProfile): V86Options => {
    const opts: V86Options & Record<string, any> = {
        wasm_path: '/v86.wasm',
        memory_size: profile.memorySize * 1024 * 1024,
        vga_memory_size: profile.vgaMemorySize * 1024 * 1024,
        screen_container: screenRef.current!,
        bios: { url: '/bios/seabios.bin' },
        vga_bios: { url: '/bios/vgabios.bin' },
        autostart: true,
        disable_speaker: true
    };

    if (profile.cdromFile) {
        opts.cdrom = { buffer: profile.cdromFile as any, async: true } as any;
    } else if (profile.cdromPath) {
        opts.cdrom = { url: profile.cdromPath };
    } else if (profile.statePath) {
        opts.cdrom = { buffer: new ArrayBuffer(0) as any };
    }

    if (profile.statePath) {
        opts.initial_state = { url: profile.statePath };
    }

    if (profile.filesystem) {
        opts.filesystem = { baseurl: profile.filesystem.baseurl };
        if (profile.filesystem.basefsUrl) {
            opts.filesystem.basefs = { url: profile.filesystem.basefsUrl };
            opts.bzimage_initrd_from_filesystem = true;
        }
    }

    if (profile.cmdline) {
        opts.cmdline = profile.cmdline.join(' ');
    }

    if (profile.bzimagePath) {
        // v86 accepts bzimage as an option, but we need to structure it 
        opts.bzimage = { url: profile.bzimagePath };
    }

    if (profile.netDeviceType) {
        opts.net_device = { type: profile.netDeviceType as any };
    }

    return opts;
  };

  const startEmulator = useCallback(async (loadFromSave = false) => {
    if (emulatorRef.current) {
      emulatorRef.current.run();
      setIsRunning(true);
      return;
    }

    if (!screenRef.current) return;

    const options = createOptions(activeProfile);

    if (loadFromSave) {
      const savedState = await get('v86-save-state');
      if (savedState) {
        options.initial_state = { buffer: savedState } as any;
      }
    }

    try {
        emulatorRef.current = new V86(options);
        
        setUptime(0);

        emulatorRef.current.add_listener('emulator-started', () => {
        setIsRunning(true);
        if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
        uptimeIntervalRef.current = window.setInterval(() => setUptime(u => u + 1), 1000);
        });

        emulatorRef.current.add_listener('emulator-stopped', () => {
        setIsRunning(false);
        if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
        });

        emulatorRef.current.add_listener('download-progress', (e: any) => {
        setDownloadProgress(e);
        if (e.loaded >= e.total && e.file_index === e.file_count - 1) {
            setTimeout(() => setDownloadProgress(null), 1000);
        }
        });

        emulatorRef.current.add_listener('download-error', (e: any) => {
            console.error('Download error', e);
            setDownloadError(e.file_name);
            setDownloadProgress(null);
            setIsRunning(false);
        });

        setIsRunning(true);
        setDownloadError(null);
    } catch (e: any) {
        console.error("Failed to start emulator:", e);
        alert("Failed to start emulator: " + e.message);
        setIsRunning(false);
    }
  }, [activeProfile]);

  const stopEmulator = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.stop();
      setIsRunning(false);
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
    }
  }, []);

  const restartEmulator = useCallback(() => {
    if (emulatorRef.current) {
      setUptime(0);
      emulatorRef.current.restart();
    }
  }, []);

  const goFullscreen = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.screen_go_fullscreen();
    }
  }, []);

  const saveState = useCallback(async () => {
    if (emulatorRef.current) {
      const state = await emulatorRef.current.save_state();
      await set('v86-save-state', state);
      setHasSaveState(true);
      alert('State saved successfully to IndexedDB!');
    }
  }, []);

  const destroyEmulator = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.destroy();
      emulatorRef.current = null;
    }
    setIsRunning(false);
    setUptime(0);
    if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyEmulator();
    };
  }, [destroyEmulator]);

  return {
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
  };
}
