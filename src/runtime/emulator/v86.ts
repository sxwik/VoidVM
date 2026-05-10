/// <reference types="vite/client" />
import { V86, V86Options } from 'v86';
import { get, set } from 'idb-keyval';
import { BootProfile } from '../../types/profiles';
import v86WasmUrl from "v86/build/v86.wasm?url";

export class EmulatorRuntime {
  public instance: V86 | null = null;
  public isRunning = false;
  
  private onStateChangeHooks: (() => void)[] = [];
  private onDownloadProgressHooks: ((progress: any) => void)[] = [];
  private onDownloadErrorHooks: ((error: string) => void)[] = [];

  constructor() {
    this.handleRejection = this.handleRejection.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  private handleRejection(e: PromiseRejectionEvent) {
    if (e.reason && e.reason.message && e.reason.message.includes('lock() must be called from a primary')) {
      e.preventDefault();
    }
  }

  private handleError(e: ErrorEvent) {
    console.error('EMULATOR GLOBAL ERROR:', e.error?.stack || e.error);
  }

  public subscribe(
    onStateChange: () => void,
    onProgress: (p: any) => void,
    onError: (e: string) => void
  ) {
    this.onStateChangeHooks.push(onStateChange);
    this.onDownloadProgressHooks.push(onProgress);
    this.onDownloadErrorHooks.push(onError);

    return () => {
      this.onStateChangeHooks = this.onStateChangeHooks.filter(h => h !== onStateChange);
      this.onDownloadProgressHooks = this.onDownloadProgressHooks.filter(h => h !== onProgress);
      this.onDownloadErrorHooks = this.onDownloadErrorHooks.filter(h => h !== onError);
    };
  }

  private notifyStateChange() {
    this.onStateChangeHooks.forEach(h => h());
  }

  public async start(profile: BootProfile, screenContainer: HTMLElement, loadFromSave = false) {
    if (this.instance) {
      this.instance.run();
      this.isRunning = true;
      this.notifyStateChange();
      return;
    }

    const options = this.buildOptions(profile, screenContainer);

    if (loadFromSave) {
      const savedState = await get('v86-save-state');
      if (savedState) {
        options.initial_state = { buffer: savedState } as any;
      }
    }

    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleRejection);

    this.instance = new V86(options);
    (window as any).emulator = this.instance;
    this.instance.keyboard_set_enabled(true);

    this.instance.add_listener('emulator-started', () => {
      this.isRunning = true;
      this.notifyStateChange();
    });

    this.instance.add_listener('emulator-stopped', () => {
      this.isRunning = false;
      this.notifyStateChange();
    });

    this.instance.add_listener('download-progress', (e: any) => {
      this.onDownloadProgressHooks.forEach(h => h(e));
    });

    this.instance.add_listener('download-error', (e: any) => {
      this.isRunning = false;
      this.onDownloadErrorHooks.forEach(h => h(e.file_name));
      this.notifyStateChange();
    });

    this.isRunning = true;
    this.notifyStateChange();
  }

  public stop() {
    if (this.instance) {
      this.instance.stop();
      this.isRunning = false;
      this.notifyStateChange();
    }
  }

  public restart() {
    if (this.instance) {
      this.instance.restart();
    }
  }

  public async saveState() {
    if (this.instance) {
      const state = await this.instance.save_state();
      await set('v86-save-state', state);
      return true;
    }
    return false;
  }

  public destroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
    this.isRunning = false;
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleRejection);
    this.notifyStateChange();
  }

  public getInstructionStats() {
    try {
      return this.instance?.get_instruction_stats() || '';
    } catch {
      return '';
    }
  }

  private buildOptions(profile: BootProfile, screenContainer: HTMLElement): V86Options {
    const bust = "?t=" + Date.now();
    const opts: V86Options & Record<string, any> = {
      wasm_path: v86WasmUrl,
      memory_size: profile.memorySize * 1024 * 1024,
      vga_memory_size: profile.vgaMemorySize * 1024 * 1024,
      screen_container: screenContainer,
      autostart: true,
      disable_speaker: true
    };

    if (!profile.statePath) {
      opts.bios = { url: 'https://raw.githubusercontent.com/copy/v86/master/bios/seabios.bin' };
      opts.vga_bios = { url: 'https://raw.githubusercontent.com/copy/v86/master/bios/vgabios.bin' };
    }

    const withBust = (url: string) => url.startsWith('http') ? url : url + bust;

    if (profile.cdromFile) {
      opts.cdrom = { buffer: profile.cdromFile as any, async: true } as any;
    } else if (profile.cdromPath) {
      opts.cdrom = { url: withBust(profile.cdromPath) };
    }

    if (profile.statePath) {
      opts.initial_state = { url: withBust(profile.statePath) } as any;
    }

    if (profile.filesystem) {
      opts.filesystem = { baseurl: profile.filesystem.baseurl };
      if (profile.filesystem.basefsUrl) {
        opts.filesystem.basefs = { url: withBust(profile.filesystem.basefsUrl) } as any;
        opts.bzimage_initrd_from_filesystem = true;
      }
    }

    if (profile.cmdline) {
      opts.cmdline = profile.cmdline.join(' ');
    }

    if (profile.bzimagePath) {
      opts.bzimage = { url: withBust(profile.bzimagePath) };
    }

    if (profile.netDeviceType) {
      opts.net_device = { type: profile.netDeviceType as any };
    }

    return opts;
  }
}

export const emulator = new EmulatorRuntime();
