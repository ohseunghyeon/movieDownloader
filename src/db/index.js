const fs = require('fs');
const db = fs.readFileSync(__dirname + '/db.json');

function create({ title }) {

    db[title]

    
}

function get(title) {
    return db[title];
}
// title torrnturl magnet siteNAme

module.exports = { get, create }