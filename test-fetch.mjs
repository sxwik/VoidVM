import https from 'https';
https.get('https://raw.githubusercontent.com/copy/v86/master/src/browser/main.js', res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body.substring(body.indexOf('new V86') - 200, body.indexOf('new V86') + 500)));
});
