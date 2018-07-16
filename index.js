const http = require('http');
const url = require('url');
const searchByKeyword = require('./src');

http.createServer((req, res) => {
    if (url.parse(req.url).query) {
        const word = url.parse(req.url).query.substr(6);
        console.log(word);
        searchByKeyword(word)
            .then((results) => {
                res.end(JSON.stringify({ entryName: word, mean: results }))
            })
            .catch(err => res.end(JSON.stringify({ entryName: word, mean: [err.message] })));

    } else {
        console.log('문제 생김');
        console.log(url.parse(req.url).query);
        res.end(JSON.stringify({ entryName: '문제', mean: ["생김"] }));
    }
}).listen(80, () => {
    console.log('server listens 80 port');
})