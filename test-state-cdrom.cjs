const {V86} = require('v86');
try {
  new V86({
    wasm_path: 'node_modules/v86/build/v86.wasm',
    memory_size: 512*1024*1024,
    vga_memory_size: 8*1024*1024,
    bios: { buffer: new ArrayBuffer(0) },
    vga_bios: { buffer: new ArrayBuffer(0) },
    initial_state: { url: 'https://i.copy.sh/arch_state-v3.bin.zst' },
    filesystem: { baseurl: 'https://i.copy.sh/arch/' },
    net_device: { type: 'virtio' }
  });
} catch(e) { console.error('ERROR WITHOUT CDROM:', e.message); }

try {
  new V86({
    wasm_path: 'node_modules/v86/build/v86.wasm',
    memory_size: 512*1024*1024,
    vga_memory_size: 8*1024*1024,
    bios: { buffer: new ArrayBuffer(0) },
    vga_bios: { buffer: new ArrayBuffer(0) },
    initial_state: { url: 'https://i.copy.sh/arch_state-v3.bin.zst' },
    filesystem: { baseurl: 'https://i.copy.sh/arch/' },
    net_device: { type: 'virtio' },
    cdrom: { url: 'nonexistent.iso' } // <--- Adding CDROM
  });
} catch(e) { console.error('ERROR WITH CDROM:', e.message); }
