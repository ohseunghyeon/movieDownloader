const request = require('./request');
const qs = require('./qs');
const parseBody = require('./parseBody');
const extractQuery = require('./extractQuery');
const { log, error } = require('./log');
const httpGet = require('./httpGet');
const httpsGet = require('./httpsGet');
const parseHTML = require('./parseHTML');

module.exports = { request, log, error, qs, parseBody, extractQuery, httpGet, httpsGet, parseHTML };