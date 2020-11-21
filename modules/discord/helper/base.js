const path = require('path');
const fs = require('fs');

class Helper {
    constructor(discordClient, directory) {

        this._discordClient = discordClient;
        this.directorypath = directory

        this.register(require('./helper'));
        this.register(require('./article'));       

        this._deepWords = null
        this._responses = null;
        
        this.initialize = [false, false]

        //console.log(this.isInitialized());
        this.HelperFunctionnality.getDeepWord().then(answers => {
            this._deepWords = answers;
            console.log("Fichier des alias initialisé");
            this.initialize[0] = true;

            this.HelperFunctionnality.getDeepData().then(responses => {
                this._responses = responses;
                console.log("Fichier des réponses initialisé");
                this.initialize[1] = true;

                this.HelperFunctionnality.syncVariable(this._deepWords, this._responses);
            })

        })


        this._discordClient.on('message', (msg) => {
            
            if(msg.channel.id == "XXX" && !msg.author.bot && msg.author.id == "XX") { //Seulement un channel pour les commandes et une personne (ID & ID)
                if(msg.content.indexOf(";alias") > -1) {
                    let result = msg.content.toLowerCase().substring(7).split(" ")

                    let word = result[0];
                    let alias = [];

                    for(let i = 1; i < result.length; i++) {
                        alias.push(result[i])
                    }

                    this.HelperFunctionnality.saveWord(word, alias);
                } else if (msg.content.indexOf(";answer") >-1) {

                    let resp = msg.content.substring(msg.content.indexOf("[") + 1, msg.content.indexOf("]"))
                    let result = msg.content.toLowerCase().substring(0, msg.content.indexOf("[") - 1).substring(8).split(" ")

                    let tblask = [];

                    

                    for(let i = 0; i < result.length; i++) {
                        let alias = []
                        alias.push(result[i])
                        
                        this.HelperFunctionnality.saveWord(result[i], alias)
                        tblask.push(result[i])
                    }

                    this.HelperFunctionnality.saveAnswer(tblask, resp);
                }
            }
            else if(!msg.author.bot) {
                if(this.isInitialized()) {
                    
                    let result = msg.content.toLowerCase().split(" ")
                    this.HelperFunctionnality.searchAnswer(msg.channel, result);
                }
                //msg.reply("Salut, je suis un prototype de bot venu là pour t'aider")
            }
        })
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this, this.directorypath);
    }

    isInitialized() {
        return this.initialize[0] && this.initialize[1]
    }

    
}

module.exports = Helper;