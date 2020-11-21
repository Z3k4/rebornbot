const https = require('https');
const path = require('path');
var mysql = require('mysql')
const Discord = require('discord.js');

class GetGoal {
    constructor(parent)
    {
        this._discordClient = parent.discordClient;
        this.con = mysql.createConnection({
            host:"localhost",
            user:"",
            password:'',
            database:""
            
        });
        this._ready = false;


        this.con.connect(function(err) {
            if(err) reject(err);
            console.log("Connected ")
            this._ready = true
        })

        this._sendToChanel = this._discordClient.channels.cache.get(""); //L'ID du salon ou envoyé

    }

    async handle() {
        //return new Promise((resolve, reject) => {
            /*https.get("https://rebornoo.mtxserv.com/shop/request.php?t=main_testlogin&key=03p6jNQWk2assUAz8uXHYLweZ7h", (resp) => {
                console.log(resp.statusCode)
                if(resp.statusCode >= 200 && resp.statusCode <= 226) {
                    let data = ''
                    let parsedata = ''
                    

                    resp.on('data', (chunk) => {
                        data += chunk;
                        
                    })

                    
                    resp.on('end', () => {
                        //console.log(data)
                        try {
                            //parsedata = JSON.parse(data);
                            return parsedata;
                        }
                        catch(e)
                        {
                            return e;
                        }
                    })

                    resp.on('error', (err) => {
                        return err;
                    })
                }
                else {
                    return new Error("Bad request")
                }
            })*/
        //})

        let response = await this.SendToDB("SELECT name_buyer, steamid64_buyer, date, amount FROM gex_donations");
        
        
        response.forEach(donationData => {
            let steamAvatar = this.SendToDB("SELECT avatar_large FROM gex_users WHERE steamid64 =" + donationData.steamid64_buyer)

            let messageEmbed = Discord.MessageEmbed()

            messageEmbed.setThumbnail(steamAvatar.avatar_large)
            messageEmbed.setColor("#3f3f3f")
            messageEmbed.setTitle("Nouvelle donation !")
            messageEmbed.setURL("https://localhost/shop/index.php?t=shop")
            embedData.setAuthor(donationData.buyer_name)

        })

        response.catch(err =>  {
            console.log(err);
        })
    }

    SendToDB(sqlQuery) {
        let con = this.con;
        return new Promise((resolve, reject) => {
            con.query(sqlQuery, function(err, result) {
                if(err) reject(err);
                resolve(result)
            })
        })
    }
}

module.exports = GetGoal;