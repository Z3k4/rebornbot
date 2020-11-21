class GmodTools {

    constructor(discordclient) {
        this.register(require('./collectionsize'));
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this);
    }
}

module.exports = GmodTools