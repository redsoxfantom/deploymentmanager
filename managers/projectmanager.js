const path = require('path')
const fs = require('fs')
const async = require('async')
const fsManager = require('./filesystemmanager')
const rootdir = path.join(fsManager.dynamics,"projects")
const querystring = require('querystring')

if(!fs.existsSync(rootdir)) {
    fsManager.mkdir(rootdir)
}

function getOSArray(projdef) {
    osArr = []
    if ("osWindows" in projdef) {
        osArr.push("Windows")
    }
    if ("osMac" in projdef) {
        osArr.push("MacOS")
    }
    if ("osLinux" in projdef) {
        osArr.push("Linux")
    }
    return osArr
}

function createNewProject(projectdefinition,callback) {
    projectjson = {
        name: projectdefinition.name,
        description: projectdefinition.desc,
        numartifacts: projectdefinition.numartifacts
    }
    projectjson["operatingsystems"] = getOSArray(projectdefinition)
    if(projectdefinition['gitrepo'] !== "") {
        projectjson['gitrepo'] = projectdefinition['gitrepo']
    }

    foldername = querystring.escape(projectjson.name)
    projectstr = JSON.stringify(projectjson)
    folderpath = path.join(rootdir,foldername)
    fs.mkdir(folderpath,(err)=>{
        projectfilename = path.join(folderpath,"project.json")
        fs.writeFile(projectfilename,projectstr,(err)=>{
            callback()
        })
    })
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
                        "projectdir":querystring.escape(dirname),
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
module.exports.createNewProject = createNewProject