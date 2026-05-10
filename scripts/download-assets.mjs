import fs from 'fs';
import https from 'https';

const assets = [
  { url: 'https://i.copy.sh/arch_state-v3.bin.zst', dest: 'public/arch_state-v3.bin.zst' },
  { url: 'https://i.copy.sh/linux3.iso', dest: 'public/images/linux3.iso' }
];

fs.mkdirSync('public', { recursive: true });
fs.mkdirSync('public/images', { recursive: true });
fs.rmSync('public/arch_state-v3.bin.zst', { force: true });
fs.rmSync('public/images/linux3.iso', { force: true });

async function download() {
  for (const asset of assets) {
    if (fs.existsSync(asset.dest)) continue;
    console.log('Downloading', asset.url);
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(asset.dest);
      https.get(asset.url, { headers: { 'User-Agent': 'curl/7.68.0' } }, (response) => {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', (err) => { fs.unlink(asset.dest, ()=>{}); reject(err); });
    });
  }
}
download();
