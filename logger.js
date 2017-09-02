/* eslint-disable no-undef, prefer-template, no-multi-spaces */
const fs = require('fs');
const winston = require('winston');
const geoip = require('geoip-lite');
const countrynames = require('countrynames');

// ==================== DOCUMENTATION ==========================

// Example:
//   timestamp        action         <agent>?          message
//
// 8/15 1:35:50 PM [    Start   ]
// 8/15 1:35:50 PM [   Connect  ] <98.10.18.140> Milwaukee, WI, UNITED STATES
// 8/15 1:35:50 PM [    Bind    ] <98.10.18.140> = Person 1
// 8/15 1:35:50 PM - Person 1: Anybody here?
// 8/15 1:35:50 PM [   Connect  ] <66.249.65.124> Mountain View, CA, UNITED STATES
// 8/15 1:35:50 PM [    Bind    ] <66.249.65.124> = Person 2
// 8/15 1:35:50 PM - Person 2: Sup
// 8/15 1:35:50 PM - Person 1: Finally, someone joined!
// 8/15 1:35:50 PM [ Disconnect ] < Person 1 >

// ==================== HELPERS ==========================

// File Naming
let buildNumber = 'Unknown';
try { buildNumber = fs.readFileSync('current_build.txt', 'utf8').toString().replace(/\D/g, ''); } catch (err) {}

// Timestamp
const timestamp = () => {
  const datetime = new Date();
  return `${datetime.getMonth() + 1}/${datetime.getDate()} ${datetime.toLocaleTimeString()} `;
};

// Retrieves origin of an IP
const lookup = (ip) => {
  const result = geoip.lookup(ip);
  return result ?
    `${result.city ? `${result.city}, ` : ''}${
      result.region ? `${result.region}, ` : ''}${
      countrynames.getName(result.country)}`
    : 'Unknown';
};

// Formats the log event
const format = (transport, level, meta, body) => {
  const ts = timestamp();
  let result = ts;
  switch (meta.action) {
    case 'bind':       result += `[    Bind    ] <${meta.agent}> = ${body}`; break;
    case 'connect':    result += `[   Connect  ] <${meta.agent}> ${lookup(meta.agent)}`; break;
    case 'disconnect': result += `[ Disconnect ] <${meta.agent}>`; break;
    case 'error':      result += `<<< ERROR >>>  <${meta.agent || 'Unknown'}> ${body}`; break;
    case 'reconnect':  result += `[  Reconnect ] <${meta.agent}> ${body || ''}`; break;
    case 'start':      result += '[    Start   ]'; break;
    default:           result += `- ${body}`;
  }
  return transport === 'console' ? winston.config.colorize(level, result) : result;
};


// ==================== LOGGER ==========================

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      json: false,
      showLevel: false,
      colorize: true,
      level: 'debug',
      formatter: options => format('console', options.level, options.meta, options.message),
    }),
    new (winston.transports.File)({
      filename: `logs/Build-${buildNumber}.log`,
      json: false,
      showLevel: false,
      level: 'server',
      formatter: options => format('file', options.level, options.meta, options.message),
    }),
  ],
  levels: { error: 0, game: 1, chat: 1, server: 2, debug: 3 },
  colors: { error: 'red', game: 'green', chat: 'white',  server: 'cyan', debug: 'grey' },
});

// ==================== EXPORT LOGGER ==========================

module.exports = (args) => {
  // Restricted logging for tests
  if (args.includes('test')) {
    // Remove file logging
    logger.remove(winston.transports.File);
    if (fs.existsSync('logs/Build-Unknown.log')) { fs.unlink('logs/Build-Unknown.log'); }
    if (args.includes('quiet')) {
      // Remove console logging
      logger.remove(winston.transports.Console);
    }
  }
  // Otherwise ensure Log directory exists
  else if (!fs.existsSync('logs')) { fs.mkdirSync('logs'); }
  return logger;
};
