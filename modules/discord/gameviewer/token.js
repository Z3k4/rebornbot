const https = require('https');

class GameviewerToken {

    constructor(gameviewer) {
        this.gameviewer = gameviewer
    }

    handle() {
        console.log("Actualisation du token")
        return new Promise((resolve, reject) => {
       
        //return new Promise((resolve, reject) => {
            https.get("https://mtxserv.com/oauth/v2/token?&grant_type=https://mtxserv.com/grants/api_key&client_id=" + this.gameviewer._mtxclientid + "&client_secret=" + this.gameviewer._mtxcliensecret + "&api_key=" + this.gameviewer._mtxapi_key, (resp) => {
                console.log("https://mtxserv.com/oauth/v2/token?&grant_type=https://mtxserv.com/grants/api_key&client_id=" + this.gameviewer._mtxclientid + "&client_secret=" + this.gameviewer._mtxcliensecret + "&api_key=" + this.gameviewer._mtxapi_key)
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                })

                resp.on('end', () => {
                    let token = JSON.parse(data).access_token
                    //console.log(JSON.parse(data));

                    console.log("Nouveau token " + token + ", code : " + resp.statusCode);
                    //rebornclient._tokenacces = token;
                    this._tokenacces = token;
                    resolve(token)
                })

                resp.on('error', (err) => {
                    reject(err);
                })

            })
        });
    }
}

module.exports = GameviewerToken;