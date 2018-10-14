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
  error(err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') connect();
});

function openDBConnection() {
  log('in openDBConnection');
  if (connection.state === 'disconnected') {
    connection.connect((err) => {
      if (err) {
        error(err);
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

async function getPnId(pn) {
  try {
    let id;
    const rows = await query(`SELECT * FROM AVS WHERE pn = '${pn}'`);

    if (rows.length)
      id = rows[0].id;
    else
      id = (await query(`INSERT INTO AVS (pn) VALUES ('${pn}')`)).insertId;

    return id;
  } catch (error) {
    throw error;
  }
}

function savePnMagnetTorrent({ pn, pnId, SITE_NAME, SITE_URL, m }) {
  let siteId;
  if (SITE_NAME === 'javbus') siteId = 1;

  return query(`INSERT INTO MAGNETS (pn, magnet, site, title, size, addedDate) VALUES ${m.map(a => `(${pnId},'${a.magnet}','${siteId}','${a.title}','${a.size}','${a.addedDate}')`).join(',')}`)
}

function getPn(pn) {
  return query(`SELECT * FROM MAGNETS WHERE pn = '${pn}'`);
}

module.exports = { getPnId, getPn, savePnMagnetTorrent }