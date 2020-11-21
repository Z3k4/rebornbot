const path = require('path');
const fs = require('fs');

class HelperFunctionnality { //C'est un prequel de 'chatbot', il fonctionne par mots clés
    
    constructor(Helper, directory) {
        //super(client);
        this._responsesentence = ["Voilà pour toi :", "Suffit de demander :", "Ça doit être", "Normalement c'est"]
        this._addtext = ["svp di ke jté aidé a mezkay",
        "N'oublie pas de dire que j'ai été utile, sinon le fondateur me débranche :(", 
        "fo dire aux autres que jsui bien stp",,
        "stp oublie pas d'appeler SOS bot en danger", "", "", "", "", "", "", "", ""]
        this._deepWords = null;
        this._responses = null;
        this.directorypath = directory
        this.Helper = Helper
        

        /*this.getDeepWord().then(answers => {
            this._deepWords = answers;
            console.log("Fichier des alias initialisé")

            this.getDeepData().then(responses => {
                this._responses = responses;
                console.log("Fichier des réponses initialisé")

                client.on("message", message => {
                    
                    if(message.author.id == XXX) {
                        if(message.content.indexOf(";alias") > -1) {
                            let result = message.content.toLowerCase().substring(7).split(" ")

                            let word = result[0];
                            let alias = [];

                            for(let i = 1; i < result.length; i++) {
                                alias.push(result[i])
                            }

                            this.saveWord(word, alias);
                        } else if (message.content.indexOf(";answer") >-1) {

                            
                            let resp = message.content.substring(message.content.indexOf("[") + 1, message.content.indexOf("]"))
                            let result = message.content.toLowerCase().substring(0, message.content.indexOf("[") - 1).substring(8).split(" ")

                            let tblask = [];

                            

                            for(let i = 0; i < result.length; i++) {
                                let alias = []
                                alias.push(result[i])
                                
                                this.saveWord(result[i], alias)
                                tblask.push(result[i])
                            }

                            this.saveAnswer(tblask, resp);
                        }
                    }
                let result = message.content.toLowerCase().split(" ")
                this.searchAnswer(message.channel, result);
                })
            })
        })*/
    }

    syncVariable(words, alias) {
        this._deepWords = words
        this._responses = alias;
    }

    getDeepWord() {
        return new Promise((resolve, reject) => {
            
            let filepath = this.directorypath + "/data/deeplearning/words.txt"
            fs.stat(filepath, function(err, stat) {
                if(err == null) {
                    fs.readFile(filepath, function(err, data) {
                        if(err) throw err;
                        let answers = JSON.parse(data)
                            resolve(answers);
                        })
                        //console.log(userplaylist)
                } else if(err.code == 'ENOENT') {
                    let answer = {}
                    let stringify = JSON.stringify(answer, null, 2);
                    fs.writeFile(filepath, stringify, function(err) {
                        if (err) {
                            reject(err);
                        }
                        resolve(answer);
                    });
                }
                
            })
        })
    }

    getDeepData() {
        return new Promise((resolve, reject) => {
            let filepath = "./data/deeplearning/answers.txt"
            fs.stat(filepath, function(err, stat) {
                if(err == null) {
                    fs.readFile(filepath, function(err, data) {
                        if(err) throw err;
                        let answers = JSON.parse(data)
                        
                            resolve(answers);
                        })
                        //console.log(userplaylist)
                } else if(err.code == 'ENOENT') {
                    let answer = {}
                    let stringify = JSON.stringify(answer, null, 2);
                    fs.writeFile(filepath, stringify, function(err) {
                        if (err) {
                            reject(err);
                        }
                        resolve(answer);
                    });
                }
                
            })
        })
    }



    checkInWord(words, value) {
       
        /*for(let i =0; i < words.length; i++) {
            if(words[i][value] != undefined) {
                return true
            }
        }*/
        if (words[value] != undefined) {
            return true
        }
        return false
    }

    saveWord(word, alias) { //Faut modifier la fonction pour qu'elle check si la valeur stockée est un array
        return new Promise((resolve, reject) => {
            this.getDeepWord().then(words => {
                //On regarde si le mot est déjà enregistré avec des alias
               
                if(this.checkInWord(words, word)) {

                    //Si c'est une table, on vérifie chaque mot un par un
                    if(Array.isArray(alias)) {
                        for(let i =0; i < alias.length; i++) {
                           
                            if(words[word].indexOf(alias[i]) == -1) {
                                
                                
                                words[word].push(alias[i])
                            }
                        }

                        //resolve(words)

                    } else { // Sinon on fait autre chose
                        if(words[word][alias] == undefined) {
                            words[word].push(alias)
                        }
                    }
                } else { 
                    let newvalue = {}
                    if(Array.isArray(alias)) {
                        words[word] = alias;
                    }
                    else {
                        words[word] = [alias];
                    }
                    
                }
                this._deepWords = words;
                let stringify = JSON.stringify(words, null, 2)
                let filepath = "./data/deeplearning/words.txt"
                
                fs.writeFile(filepath, stringify, function(err) {
                    if (err) {
                        reject(err);
                    }
                    console.log("Mot sauvegardé");
                    resolve("ok");
                });
            })
        })
    }

    async saveAnswer(tblask, answ) {
        let i = 0;
        let buildReponse = function(tbl, keywords, answ) {
            
            
            if(i == keywords.length) {
                return;
            }
            else {
                if(tbl[keywords[i]] == undefined) {
                   
                    if(i +1 >= keywords.length) {
                        tbl[keywords[i]] = answ
                    }
                    else {
                        tbl[keywords[i]] = {}
                    }
                }
                
                i++;
                buildReponse(tbl[keywords[i - 1]], keywords, answ)
                
            }
            

            
        }
        return new Promise((resolve, reject) => {
            this.getDeepData().then(responses => {
                let i = 0;
                
                buildReponse(responses, tblask, answ);
                 
                let stringify = JSON.stringify(responses, null, 2)
                let filepath = "./data/deeplearning/answers.txt"
                console.log(stringify);
                this._responses = responses;

                fs.writeFile(filepath, stringify, function(err) {
                    if (err) {
                        reject(err);
                    }
                    resolve("ok");
                });
               
                
            })
        })
    }

    searchWord(word) {
        
        for(let [key, alias] of Object.entries(this._deepWords)) {
            for(let i = 0; i < alias.length; i++) {
                if (word == alias[i]) {
                    return key
                }
            }
        }

        return undefined
    }

    replaceAnswerByArticle(answer) {
        return new Promise((resolve, reject) => {
            let regexArticle = "{article=\\w+}"
            let regexResult = answer.match(regexArticle)
            if (regexResult) {
                let articleName = regexResult.input.substring(9, regexResult.input.length -1)
                this.Helper.HelperArticle.replace(articleName).then(result => {
                        resolve(result);
                })
                .catch(err => {
                    reject(err)
                })
            }
            else {
                resolve(false)
            }

            
        })
    }

    async searchAnswer(chnl, tbl) {
        let result = undefined;

        let searchinIndex = function(index) {//On cherche si un index contient un index
            if(index != undefined) {
                if(typeof(index) != "string") {
                    console.log(index)
                    return index
                } else {
                    result = index
                }
            }
        }

        let table = this._responses
        for(let i=0; i < tbl.length; i++) {
            let word = await this.searchWord(tbl[i]);
            if(word !=undefined) {
                console.log(word)
                table = searchinIndex(table[word]);
                
                if (result) {
                    break;
                }
            }
        }

        //console.log(result);
        

        if(result) {
            //console.log(result);
            let resultArticle = await this.replaceAnswerByArticle(result);
            
            if (!resultArticle) {
                
                let randomindex = Math.floor(Math.random() * Math.floor(this._responsesentence.length))
                let responsesentence = this._responsesentence[randomindex];

                let addresponse = await this.getRandomResponse();
                chnl.send(responsesentence + " " + result + "\n" + addresponse )
            }
            else {
                console.log("2 : " + resultArticle)
                chnl.send(resultArticle)
            }
            
        }
    }

    getRandomResponse(){
        let randomindex = Math.floor(Math.random() * Math.floor(this._addtext.length))
        let randomresponse = this._addtext[randomindex];
        
        return randomresponse;
    }

    handle() {

    }
}

module.exports = HelperFunctionnality;