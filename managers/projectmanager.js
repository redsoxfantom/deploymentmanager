const path = require('path')
const fs = require('fs')
const async = require('async')
const fsManager = require('./filesystemmanager')
const rootdir = path.join(fsManager.dynamics,"projects")
const artifactmanager = require('./artifactmanager')
const uuid = require('uuid/v4')

if(!fs.existsSync(rootdir)) {
    fsManager.mkdir(rootdir)
}
console.log('Project files will be stored in '+rootdir)

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
        maxnumartifacts: projectdefinition.numartifacts
    }
    projectjson["operatingsystems"] = getOSArray(projectdefinition)
    if(projectdefinition['gitrepo'] !== "") {
        projectjson['gitrepo'] = projectdefinition['gitrepo']
    }
    foldername = uuid()
    projectjson['uuid'] = foldername
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
    const projectroot = path.join(rootdir,projectid)
    const projinfofile = path.join(projectroot,"project.json")
    if(!fs.existsSync(projinfofile)) {
        callback()
    }
    else {
        fs.readFile(projinfofile, (err, info) => {
            const projinfo = JSON.parse(info)
            projinfo['projectroot'] = projectroot
            const artifactpath = path.join(projectroot,'artifacts')
            projinfo['artifactpath'] = artifactpath
            if(fs.existsSync(artifactpath)) {
                fs.readdir(artifactpath,(err,items)=>{
                    projinfo['numartifacts'] = items.length
                    projinfo['artifacts'] = artifactmanager.getAllProjectArtifacts(projinfo.artifactpath)
                    callback(projinfo)
                })
            } else {
                projinfo['numartifacts'] = 0
                callback(projinfo)
            }
        })
    }
}

module.exports.getAllProjects = getAllProjects
module.exports.getProjectData = getProjectData
module.exports.createNewProject = createNewProject