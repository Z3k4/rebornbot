const path = require('path');
const fs = require('fs');

class HelperArticle {
    constructor(Helper, directory)
    {
        this.directorypath = directory
    }

    replace(articlename) {
        return new Promise((resolve, reject) => {
            let filepath = this.directorypath + "/data/deeplearning/articles/" + articlename + "/index.txt"
            fs.stat(filepath, function(err, stat) {
                if(err == null) {
                    fs.readFile(filepath, "utf8", function(err, data) {
                        if(err) throw err;
                            //console.log("" + data)
                            resolve(data)
                        })
                        //console.log(userplaylist) 
                } else if(err.code == 'ENOENT') {
                    reject(false)
                }
                
            })
        })
    }
}

module.exports = HelperArticle;