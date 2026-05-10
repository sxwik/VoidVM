import { V86 } from 'v86';
import fs from 'fs';

const run = async () => {
  try {
    const stateBuf = fs.readFileSync('arch_state.bin.zst');
    console.log("State buffer size:", stateBuf.byteLength);

    // Mock bios buffer to prevent files from missing
    const dummyBuf = new Uint8Array(1024);

    const emulator = new V86({
      wasm_path: 'node_modules/v86/build/v86.wasm',
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
      bios: { buffer: dummyBuf },
      vga_bios: { buffer: dummyBuf },
      initial_state: { buffer: stateBuf }
    });
    console.log("Instantiated successfully");
  } catch (e) {
    console.error("Error during instantiation:", e.message);
  }
};
run();
