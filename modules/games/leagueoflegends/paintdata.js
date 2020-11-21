const gm = require('gm');

class LoLPaintData {
    constructor(LoLManager) {
        this._LoLManager = LoLManager;
    }

    createNewImage() {
        return new Promise((resolve, reject) => {
            //this._LoLManager.LoLStats.handle().then(account => {
                var img = gm(1920, 1080, "#424242")
                img.fill("#000000")
                img.write("data/games/leagueoflegends/1.png", function(err) {
                    resolve("data/games/leagueoflegends/1.png");
                })
            //})
        })
    }

    async addPlayerRanks(imageURL, rankData) {
        console.log(rankData)
        
        
            
        function createData(name, width, height, posX, posY, space) {
            return new Promise((resolve, reject) => {
                let edit = gm(imageURL);
                edit.fill("#272727")
                edit.drawRectangle(20, posX + space, width, posX + posY)
                //edit.drawRectangle(20, 10, 150, 30);
                edit.fill("#ffffff")

                edit.region(width, 65, 20, posX)
                edit.gravity('Center')
                edit.font("ZenKaiUni", 30)
                edit.drawText(0, 2, name)

                edit.write(imageURL, function(err) {
                    if(err) {
                        console.log(err.message);
                    }
                    resolve("ok");
                })
            })
        }
        
        console.log(rankData);
        for(var i = 0; i < 3; i++) {

            let width = 350;
            let height = 60
            let spaceY = 10
            let posX = 560 + (i * height)
            //let height = 60
            let space = 10;
            console.log(posX)


            let rankname = this._LoLManager.LoLUtility.getRankName(rankData[i]);

            let result = await createData(rankname[0] + " " + rankname[1], width, height, posX, height, space)
            console.log("Je crois que c'est fait " + result);
        }

        return;

        /*edit.write(imageURL, function(err) {
            resolve("ok");
        })*/
    }

    addChampIcon(imageURL, champID) {
        let edit = gm(imageURL);
        let position = '+' + 200 + '+' + 554;
        
        edit.composite("data/static/leagueoflegends/champIcon/64x64/ID" + champID + ".png");
        edit.geometry(position);

        edit.write(imageURL, function(err) {
            console.log(err);
        })
    }


    addPlayerStats(imageURL, accountData) {
        return new Promise((resolve, reject) => {
            console.log(accountData.basedata);
            let edit = gm(imageURL);
            edit.composite("data/static/leagueoflegends/summonerIcon/64x64/" + accountData.basedata.profileIconId + ".jpg")
            edit.geometry('+' + 100 + '+' + 360)
            
            edit.write(imageURL, function(err) {
                console.log(err);

                let edit = gm(imageURL);

                edit.font("ZenKaiUni", 26)
                edit.drawText(100,530, accountData.basedata.name)
                edit.drawText(100,560, accountData.basedata.summonerLevel)
                edit.write(imageURL, function(err) {
                    resolve("ok");
                })
            })
        })

        

        
        /*edit.drawText(120, 120, accountData.basedata.name);

        edit.write(imageURL, function(err) {
            console.log(err);
        })*/
    }

    async showLastChampions(imageURL, matchs) {
        //return new Promise((resolve, reject) => {

            function addChamp(champ, index) {
                return new Promise((resolve, reject) => {
                    let edit = gm(imageURL);
                    edit.composite("data/static/leagueoflegends/champIcon/64x64/ID/" + champ[0] + ".png");
                    edit.geometry('+' + 20 + '+' + (800 + (index * 70)));

                    //edit.fill("#ffffff")
                    

                    edit.write(imageURL, function(err) {
                        if(err) {
                            reject(err.message);
                        }
                        let edit = gm(imageURL);

                        edit.font("ZenKaiUni", 26)
                        edit.drawText(100,(840 + (index * 70)), champ[1] + " parties jouées")

                        edit.write(imageURL, function(err) {
                            if(err) {
                                reject(err.message);
                            }
                            resolve("Champion mis");
                        })
                       
                    })
                })
            }
            let threeChamps = await this._LoLManager.LoLUtility.getAmountLastChampions(matchs, 3);

            //console.log(accountData.basedata);
            

            for(var i =0; i < threeChamps.length; i++) {
                let result = await addChamp(threeChamps[i], i);
                console.log(result);
            }

            console.log("c fé");
            

        //})
        //console.log(threeChamps)
        //return threeChamps;
    }

    async paintStats(username, channel) {
        
        let account = await this._LoLManager.LoLStats.handle(username);
        let imageURL = await this.createNewImage();
        let result2 = await this.addPlayerStats(imageURL, account);
        let result3 = await this.showLastChampions(imageURL, account.matches);
            //let result3 = await this.addPlayerRanked(imageURL, accountData);

        let result5 = await this.addPlayerRanks(imageURL, account.ranks);

        console.log("Résultat rank :" + result5);

        channel.send("", {
            files:[
                imageURL,
            ]
        })
        
    }
}

module.exports = LoLPaintData;