const puppeteer = require('puppeteer');
const { httpsGet, parseHTML, log } = require('../../util');

const SITE_NAME = 'javbus';
const SITE_URL = 'https://www.javbus.com/';

async function get(pn) {
  log('in crawler/javbus');

  try {
    // 브라우저 객체와 페이지 객체를 만들고
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`${SITE_URL}${pn}`, { waitUntil: 'networkidle2' });

    let links = await page.evaluate(() => {
      const magnets = document.querySelector('#magnet-table');

      if (!magnets) {
        return 'javbus no results';
      }

      const anchors = Array.from(document.querySelectorAll('table#magnet-table tr'));
      return anchors.map(anchor => {
        const a = anchor.querySelector('a');
        if (!a) return null;
        return a.getAttribute('href');
      }).filter(a => a);
    });

    browser.close();

    if (!Array.isArray(links)) links = undefined;

    return {
      SITE_NAME,
      SITE_URL,
      m: links
    };

  } catch (error) {
    throw error;
  }
}

module.exports = get;