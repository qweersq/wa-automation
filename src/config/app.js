require('dotenv').config();

const config = {
  port: process.env.WA_AUTOMATION_PORT || 3001,
  debug: process.env.DEBUG === 'true',
  chromePath: process.env.CHROME_PATH,
  puppeteerArgs: process.env.PUPPETEER_ARGS ? 
    process.env.PUPPETEER_ARGS.split(',') : 
    [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
};

module.exports = config;
