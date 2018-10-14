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

      if (!magnets) return undefined;

      const rows = Array.from(document.querySelectorAll('table#magnet-table > tr'));
      return rows.map(row => {
        const a = row.querySelector('a');
        if (!a) return null;

        const magnet = a.getAttribute('href');
        const [title, size, addedDate] = Array.from(row.querySelectorAll('td > a')).map(a => a.innerText.trim());

        return { magnet, title, size, addedDate };
      }).filter(a => a);
    });

    browser.close();

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