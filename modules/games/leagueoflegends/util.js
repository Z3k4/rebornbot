const https = require('https');
const fs = require('fs');

class LoLUtility {
    getRankName(rankInfo) {
        if(!rankInfo) {
            return ["Non classé", ""]
        }
        else {
            return [rankInfo.tier, rankInfo.rank];
        }
    }
    
    downloadFile(uri, filename, ishttps) {
        return new Promise((resolve, reject) => {
            if (!ishttps) {
                request.head(uri, function(err, res,body) {
                    if (res.statusCode < 200 || res.statusCode > 299) { 
                        console.log("Erreur lors du chargement de la page, code : " + res.statusCode + " icon : " + filename);
                    } else {
                        var res = request(uri).pipe(fs.createWriteStream(filename))

                        res.on('close', () => {
                            resolve("Terminé");
                        })
                        res.on('error', () => {
                            console.log("Erreur lors du chargement de la page, code : " + res.statusCode);
                        })
                    }
                })
            }
            else {
                var file = fs.createWriteStream(filename);
                var res = https.get(uri, function(resp) {
                    resp.pipe(file);

                    resp.on('close', () => {
                        resolve("Terminé");
                    })
                    resp.on('error', () => {
                        console.log("Erreur lors du chargement de la page, code : " + res.statusCode);
                    })
                 })
            }
        })
    }

    async downloadAllIcons() {
        for(var i = 4097; i < 5000; i++) {
            let getFile = "https://opgg-static.akamaized.net/images/profile_icons/profileIcon" + i + ".jpg"
            let saveTo = "data/static/leagueoflegends/summonerIcon/128x128/" + i + ".jpg"
            await this.downloadFile(getFile, saveTo, true);
        }
    }

    async getAmountLastChampions(matchs, amountChamps) {
        let championPlayed = []

        function searchOrUpdateChampion(champ) { //Cette fonction permet de mettre à jour le nombre de fois qu'un champion a été joué
            if(championPlayed.length > 1) {
                for(var i = 0; i < championPlayed.length; i++) {
                    if (championPlayed[i][0] == champ) { // 0 est l'id du champion, 1 est le nombre de fois qu'il a été joué
                        championPlayed[i][1] += 1;
                        console.log("ok");
                        return;
                    } else {
                       continue;
                    }
                }
                championPlayed.push([champ, 1]);
            } else {
                championPlayed.push([champ, 1]);
                return;
            }
        }

        function getNumberOfChamps() {
            //let amount = 5;
            let mostPlayedChamps = [];
            let copyChampionPlayed = championPlayed;
            
            while(mostPlayedChamps.length != amountChamps) {
                let selectedChamp = [copyChampionPlayed[0], 0]; //[copyChampionPlayed[0] = Champion selectionné, 0 = + c'est bas, + ça a été joué récemment]
                //console.log(copyChampionPlayed[0]);
                for(var i = 1; i < copyChampionPlayed.length; i++) {
                    if(copyChampionPlayed[i][1] > selectedChamp[0][1]) {
                        selectedChamp = [copyChampionPlayed[i], i];
                        
                    }
                    else {
                        if(copyChampionPlayed[i][1] == selectedChamp[0][1]) {
                            if(i < selectedChamp[1]) {
                                selectedChamp = [copyChampionPlayed[i], i];
                            }
                            else {
                                continue;
                            }
                        }
                    }
                }

                //console.log("Je vais supprimer " + selectedChamp[1]);
                copyChampionPlayed.splice(selectedChamp[1], 1)
                //console.log(copyChampionPlayed);
                mostPlayedChamps.push(selectedChamp[0])
            }

            //console.log(mostPlayedChamps);
            //console.log(copyChampionPlayed);
                
            return mostPlayedChamps;
            
        }
        

        for(var i = 0; i < matchs.length; i++) {
            let champion = matchs[i].champion;
            searchOrUpdateChampion(champion);
        }
        //console.log(championPlayed.length);

        let mostChamp = getNumberOfChamps();

        return mostChamp;
    }
}

module.exports = LoLUtility;