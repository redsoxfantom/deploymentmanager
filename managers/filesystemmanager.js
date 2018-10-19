const path = require('path')
const rootdir = require('../config.json').rootdir
const fs = require('fs')
const async = require('async')
const archiver = require('archiver')

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

function createWindowsArchive(dirToArchive,callback) {
    const dest = path.join(path.dirname(dirToArchive),"Windows.zip")
    const output = fs.createWriteStream(dest)
    output.on('close',()=>{
        callback()
    })
    const zip = archiver('zip',{
        zlib:{level:9}
    })
    zip.pipe(output)
    zip.directory(dirToArchive,false)
    zip.finalize()
}

function createArchives(dirToArchive,archiveTypesToCreate,callback) {
    async.eachSeries(archiveTypesToCreate,(archiveType,cb)=>{
        switch(archiveType) {
            case "Windows":
                createWindowsArchive(dirToArchive,()=>{cb()})
                break
            case "Linux":
                cb()
                break
            case "MacOS":
                cb()
                break
        }
    },(err)=>{
        callback()
    })
}

module.exports.dynamics = dynamicsDirectory
module.exports.mkdir = mkdir
module.exports.createArchives = createArchives