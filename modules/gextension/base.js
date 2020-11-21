

class GExtension {
    constructor(client){
        this.discordClient = client;
        this.register(require("./getgoal"));

        let funcReload = function(param) {
            param.handle();
        }
        setInterval(funcReload, 300, this)
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this);
    }

    async handle() {
        let msg = await this.GetGoal.handle();
        console.log(msg)
    }
}

module.exports = GExtension;