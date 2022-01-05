import Typegram = require('node-telegram-bot-api');
import { token, prefix, osutoken, DEFAULT_ERROR } from './data/config';
import malScraper = require('mal-scraper');
import osu = require('node-osu');
const osuApi = new osu.Api(osutoken, {
    notFoundAsError: false,
    completeScores: false,
    parseNumeric: false
});

const client = new Typegram(token, {polling: true})

client.onText(/\/start/, (message) => {
    const chatId = message.chat.id;
    client.sendMessage(chatId, 'Hello ' + message.from?.first_name);
});

client.on('message', async message => {

    const args = message.text?.slice(prefix.length).trim().split(/ +/);
    const command = args?.shift()?.toLowerCase();

    if (command === 'help') {
        const resp = 'Help Command' + '\n\n' + 'uptime, anime, osu';
        client.sendMessage(message.chat.id, resp);
        console.log(command + ': ' + 'Sended');
    }

    if (command === 'uptime') {
        const uptime = process.uptime();
        await client.sendMessage(message.chat.id, `${uptime}`);
        console.log(command + ': ' + 'Sended');
    }

    if (command === 'osu') {
        if (!args?.join(' ')) return client.sendMessage(message.chat.id, DEFAULT_ERROR);
        const data = await osuApi.getUser({
            u: args[0], m: 3
        });
        if (!data) return client.sendMessage(message.chat.id, DEFAULT_ERROR);
        if (!data.pp.rank || !data.accuracy === null) return client.sendMessage(message.chat.id, DEFAULT_ERROR);
        const resp = `https://s.ppy.sh/a/${data.id}`;
        const resp2 = 'Name: ' + data.name + '\n\n' + 'Rank: ' + data.pp.rank + '\n\n' + 'Level: ' + data.level + '\n\n' + 'Accuracy: ' + data.accuracy + '\n\n' + 'Joined: ' + data.raw_joinDate + '\n\n' + 'Performance Point: ' + data.pp.raw + '\n\n' + 'URL: ' + `https://osu.ppy.sh/users/${data.id}`;
        await client.sendPhoto(message.chat.id, resp);
        await client.sendMessage(message.chat.id, resp2);
        console.log(command + ': ' + 'Sended');
    }

    if (command === 'anime') {
        if (!args?.join(' ')) return client.sendMessage(message.chat.id, DEFAULT_ERROR);
        const animevalue = args?.join(' ') || '';
        const animescraper = await malScraper.getInfoFromName(animevalue);
        if (!animescraper) return client.sendMessage(message.chat.id, DEFAULT_ERROR);
        const resp = 'Synopsis: ' + animescraper.synopsis;
        const resp2 = 'Title: ' + animescraper.title + '\n\n' + 'Type: ' + animescraper.type + '\n\n' + 'Episode: ' + animescraper.episodes + '\n\n' + 'Duration: ' + animescraper.duration + '\n\n' + 'Genres: ' + animescraper.genres?.join(', ') + '\n\n' + 'Status: ' + animescraper.status + '\n\n' + 'Score: ' + animescraper.score;
        await client.sendPhoto(message.chat.id, animescraper.picture || '');
        await client.sendMessage(message.chat.id, resp)
        await client.sendMessage(message.chat.id, resp2);
        console.log(command + ': ' + 'Sended');
    }

});
