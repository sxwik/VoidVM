import { create } from 'zustand';

interface SettingsState {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeMenu: null,
  setActiveMenu: (menu) => set({ activeMenu: menu }),
}));
