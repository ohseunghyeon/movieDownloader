const https = require('https');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, function (res) {
      let body = [];
      res.setEncoding('utf8');
      res.on('data', (chunk) => body.push(chunk));
      res.on('end', () => resolve(body.join('')))
    }).on('error', (e) => reject(e.message));
  });
}

module.exports = httpsGet;
