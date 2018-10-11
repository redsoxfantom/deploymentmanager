const path = require('path')
const rootdir = require('../config.json').rootdir
const fs = require('fs')

var dynamicsDirectory = rootdir
if(!path.isAbsolute(rootdir)) {
    dynamicsDirectory = path.join(path.dirname(require.main.filename),rootdir)
}

function mkdir(dirToMake) {
    if(fs.existsSync(dirToMake)) {
        return
    }
    if(!fs.existsSync(path.dirname(dirToMake))) {
        mkdir(path.dirname(dirToMake))
    }
    fs.mkdirSync(dirToMake)
}

module.exports.dynamics = dynamicsDirectory
module.exports.mkdir = mkdir