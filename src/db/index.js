const mysql = require('mysql');
const { log, error } = require('../util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'meowmeow',
  database: 'av',
  timezone: 'utc'
});

openDBConnection();

connection.on('error', (err) => {
  error('error on db' + err.stack);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') connect();
});

function openDBConnection() {
  log('in openDBConnection');
  if (connection.state === 'disconnected') {
    connection.connect((err) => {
      if (err) {
        error('db error connecting: ' + err.stack);
        connection.end();
      } else {
        log('connected as id ' + connection.threadId);
      }
    });
  }
}

function query(qs) {
  log('qs:', qs);

  return new Promise((resolve, reject) => {
    connection.query(qs, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function registerPn(pn) {
  try {
    const result = await query(`SELECT * FROM AVS WHERE pn = '${pn}'`);
    if (!result.length) await query(`INSERT INTO AVS (pn) VALUES ('${pn}')`)
  } catch (error) {
    throw error;
  }
}

function savePnMagnetTorrent({ SITE_NAME, SITE_URL, pn, title, torrentURL }) {
  // 우선 해당 사이트 id 가져오기
  query(`INSERT INTO MAGNETS ()`)
  db[pn]
}

function getPn(pn) {
  return query(`SELECT * FROM MAGNETS WHERE pn = '${pn}'`);
}

module.exports = { registerPn, getPn, savePnMagnetTorrent }