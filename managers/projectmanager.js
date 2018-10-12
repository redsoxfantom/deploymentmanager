const path = require('path')
const fs = require('fs')
const async = require('async')
const fsManager = require('./filesystemmanager')
const rootdir = path.join(fsManager.dynamics,"projects")

if(!fs.existsSync(rootdir)) {
    fsManager.mkdir(rootdir)
}

function getAllProjects(callback) {
    fs.readdir(rootdir,(err,files)=>{
        if(err) {
            console.log(err)
            callback([])
        }

        var arr = []
        async.eachSeries(files,(file,cb)=>{
            file = path.join(rootdir,file)
            var isdir = fs.lstatSync(file).isDirectory();
            if(isdir) {
                var dirname = path.basename(file)
                var projectfile = path.join(file,"project.json")
                if(fs.existsSync(projectfile)) {
                    info = fs.readFileSync(projectfile)
                    var projinfo = JSON.parse(info)
                    arr.push({
                        "projectdir":dirname,
                        "projectname":projinfo.name
                    })
                }
            }
            cb()
        },(err)=>{
            callback(arr)
        })
    })
}

function getProjectData(projectid, callback) {
    const projinfofile = path.join(rootdir,projectid,"project.json")
    if(!fs.existsSync(projinfofile)) {
        callback({})
    }

    fs.readFile(projinfofile,(err,info)=>{
        const projinfo = JSON.parse(info)
        callback(projinfo)
    })
}

module.exports.getAllProjects = (callback) => {getAllProjects(callback)}
module.exports.getProjectData = (projectid,callback)=>{getProjectData(projectid,callback)}