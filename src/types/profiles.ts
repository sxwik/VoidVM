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
