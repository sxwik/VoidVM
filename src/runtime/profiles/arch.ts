import { BootProfile } from '../../types/profiles';

export const archProfile: BootProfile = { 
  id: 'archlinux', 
  name: 'Arch Linux (9Pfs CDN)', 
  memorySize: 512, 
  vgaMemorySize: 8,
  statePath: 'https://i.copy.sh/arch_state-v3.bin.zst',
  filesystem: {
    baseurl: '/proxy/copy.sh/arch/'
  },
  netDeviceType: 'virtio'
};
