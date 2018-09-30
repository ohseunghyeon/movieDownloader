function parseBody(listener, cb) {
  let body = '';
  listener.on('data', chunk => body += chunk);
  listener.on('end', () => {
    if (body) {
      try {
        listener.body = body;
        body = JSON.parse(body);
      } catch (e) {
        console.log('parse fail:', e.message);
      }
      if (cb) cb(body);
    } else {
      if (cb) cb();
    }
  });
}

module.exports = parseBody;
