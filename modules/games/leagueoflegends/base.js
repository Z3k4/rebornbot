const https = require('https');

class LeagueOfLegends {
    constructor(discordClient) {
        this._discordClient = discordClient;
        this._loltoken = ""; //Lol api
        this._loltokenparam = "?api_key=" + this._loltoken;

        this.register(require('./stats'));
        this.register(require('./paintdata'));
        this.register(require('./util'));


        this._discordClient.on('message', (message) => {
           
            if (message.content.indexOf("!lolstats") > -1) {
                let splitData = message.content.indexOf("!lolstats");

                let username = message.content.substring(splitData + 10, message.content.lenght)

                //let splitMessage = message.content.split(' ');
                //let target = splitMessage[1];
                if (username) {
                    this.LoLPaintData.paintStats(username, message.channel);
                }
            }

            if(message.content.indexOf("!downloadLoLicons") >-1) {
                //this.LoLUtility.downloadAllIcons();
                message.reply("Commande désactivé");
            }
            //this.LoLPaintData.paintStats();
        })
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this);
    }

    getSummonerData(name) {
        return new Promise((resolve, reject) => {
            https.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + name + this._loltokenparam, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                })

                resp.on('end', () => {
                    resolve(JSON.parse(data));
                })
            }).on('error', (err) => {
                reject("Error " + err.message);
            })
        })
    }

    
}

module.exports = LeagueOfLegends;