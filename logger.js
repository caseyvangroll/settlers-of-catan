/* eslint-disable no-undef, prefer-template */
const fs = require('fs');
const winston = require('winston');

const timeStamp = () => {
  const datetime = new Date();
  return `${datetime.getMonth() + 1}/${datetime.getDate()} ${datetime.toLocaleTimeString()}`;
};
let buildNumber = 'Unknown';
try { buildNumber = fs.readFileSync('current_build.txt', 'utf8').toString().replace(/\D/g, ''); } catch (err) {}

// Example:
//   timestamp     action      agent           message
// 8/15 1:35:50 PM [Start   localhost:3000]    extra info


const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: timeStamp,
      json: false,
      showLevel: false,
      colorize: true,
      level: 'debug',
      formatter: (options) => {
        const ts = options.timestamp();
        const action = options.meta.action ? `${options.meta.action} ` : '';
        const agent = options.meta.agent ? options.meta.agent : '';
        const meta = (action || agent) ? `[${action}${agent}]` : '';
        const message = options.message ? options.message : '';
        return `${ts} ${winston.config.colorize(options.level, `${meta} ${message}`)}`; },
    }),
    new (winston.transports.File)({
      filename: `logs/Build-${buildNumber}.log`,
      timestamp: timeStamp,
      json: false,
      showLevel: false,
      level: 'server',
      formatter: (options) => {
        const ts = options.timestamp();
        const action = options.meta.action ? `${options.meta.action} ` : '';
        const agent = options.meta.agent ? options.meta.agent : '';
        const meta = (action || agent) ? `[${action}${agent}]` : '';
        const message = options.message ? options.message : '';
        return `${ts} ${meta} ${message}`; },
    }),
  ],
  levels: { error: 0, game: 1, chat: 1, socket: 2, server: 2, debug: 3 },
  colors: { error: 'red', game: 'magenta', chat: 'white', socket: 'cyan', server: 'green', debug: 'grey' },
});

module.exports = logger;
