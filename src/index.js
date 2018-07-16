const torrentboza = require('./torrentboza');
const db = require('./db');

async function searchByKeyword(keyword) {
    // db에서 먼저 Search 한다.

    // 결과물은 어레이이며(한 사이트에서 여러개를 발견한 경우) magnet, title, torrent, url을 포함
    return [await torrentboza(keyword)]
}

module.exports = searchByKeyword;