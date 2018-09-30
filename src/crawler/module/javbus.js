const { httpsGet, parseHTML, log } = require('../../util');

const SITE_NAME = 'javbus';
const SITE_URL = 'https://www.javbus.com/';

const phantom = require('phantom');

async function get(pn) {
  log('in crawler/javbus');
  const result = [];

  try {

    const instance = await 

    c.queue('')
    const postBody = parseHTML(await httpsGet(SITE_URL + pn));

    const magnets = postBody.querySelector('#magnet-table');

    if (!magnets) {
      error(SITE_NAME + ' no result found');
      return result;
    }



  } catch (error) {
    throw error;
  }
}

module.exports = get;