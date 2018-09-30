const http = require('http');
const https = require('https');
const { log } = require('./log');
const qs = require('./qs');

/**
 * @param {Object} config hostname, port, path, method, headers, protocol
 * @param {Object} postData Stringified post data
 * @returns {Promise} 
 */
function request(options, postData) {
  return new Promise((resolve, reject) => {
    if (checkProtocol(options.protocol)) reject(new Error('protocol should be String "http" or "https"'));

    const requestObj = options.protocol.toLowerCase() === 'http' ? http : https;

    delete options.protocol;

    const req = requestObj.request(options, (res) => {
      log('statusCode:', res.statusCode, options.path);
      // log('headers:', res.headers);
      if (res.headers['content-encoding'] === 'base64') res.setEncoding('base64');
      else res.setEncoding('utf8');

      const body = [];
      res.on('data', (chunk) => body.push(chunk));
      res.on('end', () => {
        let result = body.join('');
        if (res.headers['content-type'] && ~res.headers['content-type'].indexOf('json')) {
          result = JSON.parse(result);
        }
        resolve(result);
      });
    });

    req.on('error', reject);

    if (postData) {
      req.end(~options.headers['Content-Type'].indexOf('json') ?
        JSON.stringify(postData) : qs.stringify(postData)
      );
    } else {
      req.end();
    }
  });
}

function checkProtocol(protocol) {
  if (!protocol) return true;
  if (typeof protocol !== 'string') return true;

  const lowerCasedProtocol = protocol.toLowerCase();
  if (lowerCasedProtocol === 'http') return false;
  if (lowerCasedProtocol === 'https') return false;

  return true;
}

module.exports = request;
