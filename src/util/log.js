const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(format.simple()),
  transports: [new transports.Console()]
});

module.exports = {
  log: (...message) => { if (process.env.NODE_ENV !== 'prod') logger.log('info', message.map(m => typeof m === 'string' ? m : JSON.stringify(m)).join(' ')); },
  error: (message) => { if (process.env.NODE_ENV !== 'prod') logger.error(message.stack); }
};
