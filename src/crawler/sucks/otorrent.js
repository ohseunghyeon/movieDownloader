const { httpsGet, parseHTML, log } = require('../../util');

const SITE_NAME = 'otorrent';
const SITE_URL = 'https://otorrent11.com';

async function crawl(pn) {
  log('in crawler/otorrent');

  try {
    const searchDocument = parseHTML(await httpsGet(`${SITE_URL}/i/board.php?bo_table=agav1&sca=&sfl=wr_subject&sop=and&stx=${pn}&x=0&y=10`));

    const list = Array.from(searchDocument.querySelectorAll('.list_body0 table tbody tr td'));

    // 없으면 에러
    if (list[0].innerHTML === "게시물이 없습니다.") {
      error(SITE_NAME + ' no result found');
      return {};
    }

    const title = searchDocument.querySelectorAll('.list_body0 table tbody tr td a span')[0].innerHTML;
    const path = SITE_URL + searchDocument.querySelectorAll('.list_body0 table tbody tr td a')[0].getAttribute('href').slice(2);

    const postBody = parseHTML(await httpsGet(path));

    const fileList = Array.from(postBody.querySelectorAll('#file_sector_0'));

    const torrentURL = SITE_URL + fileList[fileList.length - 1].querySelector('a').getAttribute('href').slice(1);

    return { SITE_NAME, SITE_URL, pn, title, torrentURL };
    
  } catch (error) {
    throw error;
  }
}

module.exports = crawl;