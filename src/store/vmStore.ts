import { create } from 'zustand';
import { BootProfile } from '../types/profiles';
import { PRESET_PROFILES } from '../runtime/profiles';

interface VMState {
  activeProfile: BootProfile;
  setActiveProfile: (profile: BootProfile) => void;
  logs: string[];
  addLog: (log: string) => void;
  stats: string;
  setStats: (stats: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useVMStore = create<VMState>((set) => ({
  activeProfile: PRESET_PROFILES[0],
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  logs: ['[kernel] Virtualization engine initialized.'],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  stats: '',
  setStats: (stats) => set({ stats }),
  activeTab: 'hardware',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
