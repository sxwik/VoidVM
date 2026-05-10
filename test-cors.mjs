import https from 'https';
https.request('https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86/alpine-virt-3.20.1-x86.iso', {method: 'HEAD'}, (res) => {
  console.log(res.statusCode, res.headers);
}).end();
