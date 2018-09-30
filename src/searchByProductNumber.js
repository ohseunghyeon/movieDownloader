const crawler = require('./crawler');
const db = require('./db');
const { log, error } = require('./util');

async function searchByProductNumber(pn) {
  log('in searchByProductNumber');

  try {
    // 품번을 db에서 확인, fetched time을 확인해봐야 하나 .. 
    /**
     * 없는 경우는 fetched_time 참조해서 마지막 검색에서 24시간 지난 경우 재 검색
     * 근데 없는 사이트엔 아마 영영 없지 않을까? count를 둬서 일정 횟수 초과 시 그만 찾게 하고 싶다.
     */

    // 1. 해당 pn이 등록되어 있는지 확인하고 없으면 생성
    await db.registerPn(pn);

    // 그리고 마그넷, 토렌트주소가 있는지 확인해야지. 
    const result = await db.getPn(pn);
    log('search result', result);

    // 결과물은 어레이이며 title, magnet, torrent, url을 포함
    if (result.length) return result;
    else return await crawler.crawl(pn);

  } catch (e) {
    throw e;
  }

}

module.exports = searchByProductNumber;