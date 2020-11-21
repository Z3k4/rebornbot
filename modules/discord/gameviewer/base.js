const https = require('https');
const path = require('path');

class Gameviewer {
    constructor(client){
        this._discordClient = client;
        this._tokenacces = "";
        this._mtxclientid = '';
        this._mtxcliensecret = '';
        this._mtxapi_key = '';

        this._serverData = [
            ["127.0.0.1&port=27120", "699367932018425867", "breach.png"], //IP du serveur / message à mettre à jour / image
            ["127.0.0.1&port=27120", "699367933318529024", "jailbreak.png"]
        ];

        
        this.register(require("./show"));
        this.register(require("./token"));

        client.on("ready", () => { 
            var newtoken = function(rebornmodule) {
                rebornmodule.GameviewerToken.handle().then(token => {
                rebornmodule._tokenacces = token;
                })
                .catch(err => console.log(err));
            }
    
            var getserverdata = function(rebornmodule) {
                rebornmodule.GameviewerShow.handle(true)
                .catch(err => console.log(err));
            } 
            
            newtoken(this);
    
                
            setInterval(newtoken, 1000 * 60 * 30, this);
            setInterval(getserverdata, 1000 * 10, this);
        })
        
    }

    /*makeRequest(discordChannel, serverip, discordmsg, discordimg, edit) {

    }*/

    register(moduleName) {
        this[moduleName.name] = new moduleName(this);
    }
}

module.exports = Gameviewer;