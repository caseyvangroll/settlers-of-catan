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
// 8/15 1:35:50 PM - Person 1: Oh look, someone joined!
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

const consoleTransports = new (winston.transports.Console)({
  json: false,
  showLevel: false,
  colorize: true,
  level: 'server',
  name: 'console',
  formatter: options => format('console', options.level, options.meta, options.message),
});

const fileTransports = [
  new (winston.transports.File)({
    filename: `logs/Build-${buildNumber}/game.log`,
    json: false,
    showLevel: false,
    level: 'game',
    name: 'file.game',
    formatter: options => format('file', options.level, options.meta, options.message),
  }),
  new (winston.transports.File)({
    filename: `logs/Build-${buildNumber}/master.log`,
    json: false,
    showLevel: false,
    level: 'server',
    name: 'file.master',
    formatter: options => format('file', options.level, options.meta, options.message),
  }),
];

// ==================== EXPORT LOGGER ==========================

module.exports = (args) => {
  const transports = [];
  if (!args.includes('quiet')) { transports.push(consoleTransports); }
  if (!args.includes('test')) {

    // Ensure Log directory exists
    if (!fs.existsSync('logs')) { fs.mkdirSync('logs'); }

    // Create directory for this build's logs
    if (!fs.existsSync(`logs/Build-${buildNumber}`)) {
      fs.mkdirSync(`logs/Build-${buildNumber}`);
    }
    fileTransports.forEach(transport => transports.push(transport));
  }

  return new (winston.Logger)({
    transports,
    levels: { error: 0, game: 1, chat: 2, server: 2 },
    colors: { error: 'red', game: 'green', chat: 'white', server: 'cyan' },
  });
};
