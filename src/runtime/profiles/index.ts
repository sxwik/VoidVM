import { BootProfile } from '../../types/profiles';
import { archProfile } from './arch';
import { dslProfile } from './dsl';

export const customProfile: BootProfile = { 
  id: 'custom', 
  name: 'Custom ISO (Upload)', 
  memorySize: 256, 
  vgaMemorySize: 8, 
  isCustom: true 
};

export const PRESET_PROFILES: BootProfile[] = [
  archProfile,
  dslProfile,
  customProfile
];
