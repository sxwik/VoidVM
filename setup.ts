import fs from 'fs/promises';
import path from 'path';

async function download(url: string, dest: string) {
    console.log(`Downloading ${url} to ${dest}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buffer);
    console.log(`Saved ${dest}`);
}

async function main() {
    await download('https://copy.sh/v86/bios/seabios.bin', 'public/bios/seabios.bin');
    await download('https://copy.sh/v86/bios/vgabios.bin', 'public/bios/vgabios.bin');
    await download('https://copy.sh/v86/images/linux3.iso', 'public/images/linux3.iso');
    
    // Copy the WASM inside public/ so the client has an easy time fetching it
    await fs.copyFile('node_modules/v86/build/v86.wasm', 'public/v86.wasm');
}

main().catch(console.error);
