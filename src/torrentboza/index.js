const { httpsRequest, parseHTML } = require('../util');
const testBody = require('./testBody');

const SITE_NAME = 'torrentboza';
const SITE_URL = 'https://torrentboza.com';

async function getAv(title) {
    // 검색부터 해야겠지
    try {
        const searchBody = await searchPage(title);
        const postList = getPostLink(searchBody);
        const pageLinks = await getPages(postList);
        const processedList = await collectData(pageLinks);

        processedList.SITE_NAME = SITE_NAME;
        processedList.SITE_URL = SITE_URL;
        console.log(processedList);
        return { title: processedList };
    } catch (err) {
        throw err;
    }
}

function searchPage(title) {
    return httpsRequest(`https://torrentboza.com/bbs/search.php?stx=${title}`);
    // return Promise.resolve(testBody);
}

function getPostLink(body) {
    const document = parseHTML(body);

    // // 검색한 리스트 찾기
    // const list = document.querySelectorAll('.search-media .media');

    // // 원하는 게시물 찾기
    // let found;
    // for (let i = 0; i < list.length; i++) {
    //     const one = list[i];

    //     const title = one.querySelector('.media-heading > a > b').innerHTML;

    //     if (title.indexOf())
    //         console.log(title);
    // }

    const list = Array.prototype.slice.call(document.querySelectorAll('.search-media .media'), 0);

    // 없으면 에러
    if (!list.length) throw new Error('no result found');

    const refinedList = list.map(one => {
        const path = one.querySelector('.media-heading a').getAttribute('href').slice(2);
        const title = one.querySelector('.media-heading a b').innerHTML.replace(/<[^>]*>/g, '');

        return { title, url: `https://torrentboza.com/bbs/${path}` };
    });

    return refinedList;
}

function getPages(refinedList) {
    const bodiesPromise = refinedList.map((pageObj) => httpsRequest(pageObj.url));
    return new Promise((resolve, reject) => {
        Promise.all(bodiesPromise)
            .then(bodies => {
                bodies.forEach((body, i) => refinedList[i].body = body);
                resolve(refinedList);
            })
            .catch(reject);
    })
}

function collectData(list) {
    // get torrent, magnet
    list.forEach((one) => {
        const document = parseHTML(one.body);

        const torrent = document.querySelector('a.list-group-item');
        if (torrent) one.torrent = torrent.getAttribute('href');
        
        const magnet = document.querySelector('ul.list-group a');
        if (magnet) one.magnet = magnet.getAttribute('href');

        delete one.body;
    });

    return list;
}

module.exports = getAv;