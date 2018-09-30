function extractQuery(req) {
  if (req.URL.query) {
    req.query = {};
    req.URL.query
      .split('&')
      .forEach(qs => {
        let splitQuery = qs.split('=');
        req.query[splitQuery[0]] = splitQuery[1];
      });
  }
}

module.exports = extractQuery;
