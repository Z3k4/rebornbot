

class Playlist {
    constructor(discordClient) {
        this._discordClient = discordClient;
        this.register(require('database'));
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this);
    }

    
}

module.exports = Playlist;