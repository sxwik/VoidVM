const https = require('https');
https.request('https://copy.sh/v86/images/archlinux.iso', {method: 'HEAD'}, (res) => {
  console.log(res.headers);
}).end();
