const http = require('http');
const https = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function httpRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, function (res) {
            let body = [];
            res.setEncoding('utf8');
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => resolve(body.join('')))
        }).on('error', (e) => reject(e.message));  
    });
}

function httpsRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, function (res) {
            let body = [];
            res.setEncoding('utf8');
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => resolve(body.join('')))
        }).on('error', (e) => reject(e.message));  
    });
}

/**
 * html 문서를 cheerio로 파싱하여 리턴한다.
 * @param {*} html
 * @returns cheerio object $
 */
function parseHTML(html) {
    return new JSDOM(html).window.document;
}

module.exports = { httpRequest, httpsRequest, parseHTML };