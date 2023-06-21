
import TelegramBot from 'node-telegram-bot-api';
import {checkAkorda} from './checkAkorda.js';

const token = '6250798032:AAGgelPs4SjqQCUsRlNOL9_zepLhc6ItK30';
const bot = new TelegramBot(token, { polling: true });
 
async function runBot() {

  console.log(' ');

  await checkAkorda(bot);

  setTimeout(runBot, 600000);
}

runBot();