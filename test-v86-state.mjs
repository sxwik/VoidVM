import { V86 } from 'v86';

const run = async () => {
  try {
    const emulator = new V86({
      wasm_path: 'node_modules/v86/build/v86.wasm',
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
      bios: { url: 'bios.bin' },
      vga_bios: { url: 'vgabios.bin' },
      initial_state: { url: 'https://i.copy.sh/arch_state-v3.bin.zst' }
    });
    console.log("Instantiated successfully");
  } catch (e) {
    console.error("Error during instantiation:", e.message);
  }
};
run();
