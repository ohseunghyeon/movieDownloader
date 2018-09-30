const db = require('../db');
const fs = require('fs');

const dir = 'module';
const modules = fs.readdirSync(__dirname + '\\' + dir).map(m => require(`./${dir}/${m}`));

const { log } = require('../util');

/**
 * 1. 사이트 리스트는 다 뒤져봐야지.
 * 2. 안 찾을 사이트도 구상해봐야지.
 */
async function crawl(pn) {
  log('in crawl');

  try {
    // 크롤링을 했으면 fetched date를 업데이트 해야 해.
    const magnets = await Promise.all(modules.map(m => m(pn)));

    console.log(magnets);
    // db에 저장
    // await Promise.all(agnets.map(m => db.savePnMagnetTorrent(m)));

    return magnets;

  } catch (error) {
    throw error;
  }
}

module.exports = { crawl };