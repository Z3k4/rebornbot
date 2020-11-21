const https = require('https');
const Discord = require('discord.js');

class GameviewerShow {
    constructor(gameviewer){
        this.gameviewer = gameviewer

    }

    makeRequest(discordChannel, serverip, discordmsg, discordimg, edit) {
        let discordclient = this.gameviewer._discordClient;

        return new Promise((resolve, reject) => {
            https.get("https://mtxserv.com/api/v1/viewers/game?type=garry-s-mod&ip=" + serverip + "&access_token=" + this.gameviewer._tokenacces, (resp) => {
                if(resp.statusCode >= 200 && resp.statusCode <= 226) {
                    let data = '';
                    let parsedata = '';

                    resp.on('data', (chunk) => {
                        data += chunk;
                    })

                    resp.on('end', () => {
                        //console.log(data)
                        try {
                            parsedata = JSON.parse(data);
                            
                            //console.log("steam://connect/" + parsedata.ip + ":" + parsedata.port)
                            const embedData = new Discord.MessageEmbed()
                            embedData.setThumbnail("https://servers.reborn-gaming.fr/resources/img/" + discordimg)
                            embedData.setColor("#3f3f3f")
                            embedData.setTitle(parsedata.ip + ":" + parsedata.port)
                            embedData.setURL("https://shop.reborn-gaming.fr")
                        
                            if(parsedata.is_online) {
                                embedData.setAuthor(parsedata.params.host_name)
                                embedData.addField("Mode", parsedata.params.game, true)
                                embedData.addField("Carte", parsedata.params.map, true)
                                embedData.addField("Places", parsedata.params.players.length + " / " + parsedata.params.max_slots, false)
                                //embedData.addBlankField();

                                let playermarkdown = null;
                                let playermarkdowntwo = null;

                                if (parsedata.params.players.length > 0) {
                                    playermarkdown = "```";
                                    if (parsedata.params.players.length < 15) {

                                        for(let plyc = 0; plyc < parsedata.params.players.length; plyc++) {
                                            playermarkdown += parsedata.params.players[plyc].name + "\n"
                                        }

                                    } else {

                                        playermarkdowntwo = "```";

                                        for(let plyc = 0; plyc < 15; plyc++) {
                                            playermarkdown += parsedata.params.players[plyc].name + "\n"
                                        }

                                        for(let plyc = 15; plyc < parsedata.params.players.length; plyc++) {
                                            playermarkdowntwo += parsedata.params.players[plyc].name + "\n"
                                        }
                                    }
                                }

                                if (playermarkdown != null) {
                                    playermarkdown += "```";
                                    embedData.addField("\u200b", playermarkdown, true)
                                }

                                if (playermarkdowntwo != null) {
                                    playermarkdowntwo += "```";
                                    embedData.addField("\u200b", playermarkdowntwo, true)
                                }

                            } else {
                                embedData.setAuthor("Serveur HORS-LIGNE")
                            }


                            embedData.setTimestamp()

                            //console.log(discordmsg)

                            if (!edit) {
                                //console.log(discordmsg[i])
                                let channel = discordclient.channels.cache.get('').send(embedData);
                                //channel.send(embedData);
                                //578255230840340480
                            }
                            else {
                                //console.log(discordmsg[i])
                                
                                //console.log(discordclient.channels)
                                let chnl = discordclient.channels.cache.get(discordChannel)
                                chnl.messages.fetch(discordmsg).then(msg => {
                                    msg.edit(embedData);
                                })
                                //msg.edit(embedData)
                                resolve("ok");

                            
                            }
                        }
                        catch(e) {
                            console.log(e)
                        }
                    })

                    resp.on("error", (error) => {
                        reject(error.message);
                    })
                }
                else {
                    reject("Error bad reponse code");
                }
            })
        })
    }

    async handle (edit)
    {
        for (var i = 0; i <  this.gameviewer._serverData.length; i++) {
            this.makeRequest('', this.gameviewer._serverData[i][0],  this.gameviewer._serverData[i][1], this.gameviewer._serverData[i][2], edit);
        }
    }
}

module.exports = GameviewerShow;