const https = require('https');

class LoLStats {
    constructor(LolManager) {
        this._LolManager = LolManager;
    }

    getPlayerAllMastery(encryptedSummonerId) {
        return new Promise((resolve, reject) => {
            let info = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + encryptedSummonerId + this._LolManager._loltokenparam;
            console.log(info);
            https.get(info, (resp) => {
                let data= '';

                resp.on('data', (chunk) => {
                    data += chunk;
                })

                resp.on('end', () => {
                    resolve(JSON.parse(data));
                })
            }).on('error', (err) => {
                reject("Erreur " + err.message);
            })
        })
    }

    getPlayerMatches(encryptedAccountId) {
        return new Promise((resolve, reject) => {
            let info = "https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/" + encryptedAccountId + this._LolManager._loltokenparam;
            console.log(info);
            https.get(info, (resp) => {
                let data= '';

                resp.on('data', (chunk) => {
                    data += chunk;
                })

                resp.on('end', () => {
                    resolve(JSON.parse(data));
                })
            }).on('error', (err) => {
                reject("Erreur " + err.message);
            })
        })
    }

    getPlayerRank(encryptedSummonerId) {
        return new Promise((resolve, reject) => {
            let info = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + encryptedSummonerId + this._LolManager._loltokenparam;
            console.log(info);
            https.get(info, (resp) => {
                let data= '';

                resp.on('data', (chunk) => {
                    data += chunk;
                })

                resp.on('end', () => {
                    resolve(JSON.parse(data));
                })
            }).on('error', (err) => {
                reject("Erreur " + err.message);
            })
        })    
    }

    async handle(username) {
        let account = await this._LolManager.getSummonerData(username);
        let mastery = await this.getPlayerAllMastery(account.id);
        let matches = await this.getPlayerMatches(account.accountId);
        let ranks = await this.getPlayerRank(account.id);

        let accountData = {}
        accountData["basedata"] = account;
        accountData["allmastery"] = mastery;
        accountData["matches"] =  matches.matches;
        accountData["ranks"] = ranks;
        
        //console.log(accountData.matches)
        return accountData;


    }
}

module.exports = LoLStats;