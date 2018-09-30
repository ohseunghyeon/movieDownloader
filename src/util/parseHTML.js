const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/**
 * html 문서를 cheerio로 파싱하여 리턴한다.
 * @param {*} html
 * @returns cheerio object $
 */
function parseHTML(html) {
  return new JSDOM(html).window.document;
}

module.exports = parseHTML;