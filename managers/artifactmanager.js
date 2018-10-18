const path = require('path')
const fs = require('fs')
const fsManager = require('./filesystemmanager')
const projectmanager = require('./projectmanager')

function getAllProjectArtifacts(artifactpath) {
    const artifacts = fs.readdirSync(artifactpath)
    const artifactnames = []
    artifacts.forEach((artifact)=>{
        artifactfile = path.join(artifactpath,artifact,"artifact.json")
        artifactfiledata = fs.readFileSync(artifactfile)
        artifactdata = JSON.parse(artifactfiledata)
        artifactnames.push({
            name: path.basename(artifact),
            datecreated: artifactdata.datecreated
        })
    })
    return artifactnames
}

function createArtifactJson(artifactpath,description,commitid,callback) {
    artifactdata = {
        description:description,
        datecreated:new Date()
    }
    if(commitid !== undefined) {
        artifactdata['commitid'] = commitid
    }
    artifactstr = JSON.stringify(artifactdata)
    fs.writeFile(path.join(artifactpath,'artifact.json'),artifactstr,(err)=>{
        callback()
    })
}

function createNewArtifact(projectdata,description,commitid,callback) {
    var artifactpath = ""
    if(!fs.existsSync(projectdata.artifactpath)) {
        artifactpath = path.join(projectdata.artifactpath,'0')
        fsManager.mkdir(artifactpath)
    } else {
        const preexistingartifacts = fs.readdirSync(projectdata.artifactpath).sort((a,b)=>{
            return a - b
        })
        const newartifactname = parseInt(preexistingartifacts[preexistingartifacts.length-1])+1
        artifactpath = path.join(projectdata.artifactpath,newartifactname.toString())
        fsManager.mkdir(artifactpath)
    }
    createArtifactJson(artifactpath,description,commitid,()=>{
        const datapath = path.join(artifactpath,'data',"original")
        fsManager.mkdir(datapath)
        callback(datapath)
    })
}

function uploadArtifact(projectid,description,commitid,files,callback) {
    projectmanager.getProjectData(projectid,(data)=>{
        if(data === undefined) {
            callback()
        } else {
            createNewArtifact(data,description,commitid,(artifactpath)=>{
                files.forEach((file)=>{
                    const src = file.path
                    const dest = path.join(artifactpath,file.originalname)
                    fs.renameSync(src,dest)
                })
                callback()
            })
        }
    })
}

function getArtifactData(projectid, artifactid, callback) {
    projectmanager.getProjectData(projectid,(data)=>{
        if(data === undefined) {
            callback()
        } else {
            artifactpath = path.join(data.artifactpath,artifactid)
            if(!fs.existsSync(artifactpath)) {
                callback()
            } else {
                artifactdatapath = path.join(artifactpath,"artifact.json")
                artifactdatastr = fs.readFileSync(artifactdatapath)
                artifactdata = JSON.parse(artifactdatastr)
                callback(artifactdata)
            }
        }
    })
}

module.exports.uploadArtifact = uploadArtifact
module.exports.getArtifactData = getArtifactData
module.exports.getAllProjectArtifacts = getAllProjectArtifacts