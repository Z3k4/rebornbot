const path = require('path');
const fs = require('fs');

class ShowMessages {
    constructor(Client) {
        this._DiscordClient = Client;
        this._saveChannels = undefined;
        this._targetGuild = undefined;

        this._DiscordClient.on('ready', () => {
            //console.log(this._DiscordClient.guilds)
            this._DiscordClient.guilds.forEach(guild => {
                //console.log(guild.id + " " + guild.name);
                if(guild.id == 662806839037132830) {
                    this._saveChannels = guild.channels;
                    
                }
                else if (guild.id == 693045254311641098) {
                    this._targetGuild = guild
                }
            })

            this.deleteAllChannels();
            /*this._saveChannels.forEach(channel => {
                if(channel.type == "text" && !this.channelExists(channel.name)) {
                    //console.log(channel.name)
                    this._targetGuild.createChannel(channel.name, "text")
                }
            })*/

            this.foundAllMessages();

            
        })
    }


    deleteAllChannels() {
        this._targetGuild.channels.forEach(channel => {
            channel.delete();
        })
    }

    foundAllMessages() {
        this._saveChannels.forEach(channel => {

        })
    }

    findChannelByName(name) {
        this._targetGuild.channels.forEach(channel => {
            if (channel.name = name) {
                return channel
            }
        })

        return undefined
    }

    channelExists(name) {
        this._targetGuild.channels.forEach(channel => {
            if (name == channel.name) {
                return true
            }
        })

        return false
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this, this.directorypath);
    }

}

module.exports = ShowMessages