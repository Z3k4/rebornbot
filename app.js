const path = require('path');
const fs = require('fs');


const Discord = require('discord.js');
const token = "NTcyOTIyMjYyMDA1NzQzNjIy.Xh3NfQ.DSZuxt72FC-a1BgSElpyNDRPNo0";
const bot = new Discord.Client();

//const lol = require('./modules/games/leagueoflegends/base');
const helper = require('./modules/discord/helper/base');
const showmsg = require('./modules/discord/showmsg/base');
const gameviewer = require('./modules/discord/gameviewer/base');
const gextension = require('./modules/gextension/base');

//const DiscordHelper = new helper(bot);
//const Message = new showmsg(bot);
const Helper = new helper(bot, __dirname);
const Gameviewer = new gameviewer(bot);
//const test = new gextension(bot);
//const LeagueOfLegends = new lol(bot);

bot.login(token);