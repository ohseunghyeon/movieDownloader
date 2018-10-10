const http = require('http');
const url = require('url');
const { log, error } = require('./src/util');
const searchByProductNumber = require('./src/searchByProductNumber');

http.createServer((req, res) => {
  const queryString = url.parse(req.url).query;

  if (queryString) {
    const pn = queryString.substr(6);
    log(pn);

    searchByProductNumber(pn)
      .then(results => res.end(JSON.stringify({ entryName: pn, mean: results })))
      .catch(err => {
        error(err);
        res.end(JSON.stringify({ entryName: pn, mean: [err.message] }))
      });

  } else {
    log('문제 생김');
    log(queryString);
    res.end(JSON.stringify({ entryName: '문제', mean: ["생김"] }));
  }
}).listen(80, () => {
  log('server listens 80 port');
});