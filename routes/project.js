const router = require('express').Router()
const projectmanager = require('../managers/projectmanager.js')
const artifactmanager = require('../managers/artifactmanager')
const fsManager = require('../managers/filesystemmanager')
const multer = require('multer')
const path = require('path')
const upload = multer({dest: path.join(fsManager.dynamics,'tmp')})

router.get('/:projectid',(req,res)=>{
    const projectid = req.params.projectid
    projectmanager.getProjectData(projectid,(projectdata)=>{
        if(projectdata === undefined) {
            res.redirect('/projects')
        } else {
            res.locals.project = projectdata
            res.locals.projectid = projectid
            res.render('project')
        }
    })
})

router.get('/:projectid/upload',(req,res)=>{
    const projectid = req.params.projectid
    projectmanager.getProjectData(projectid,(projectdata)=>{
        if(projectdata === undefined) {
            res.redirect('/projects')
        } else {
            res.locals.project = projectdata
            res.locals.projectid = projectid
            res.render('upload')
        }
    })
})

router.get("/:projectid/:artifactid(\\d+)",(req,res)=>{
    const projectid = req.params.projectid
    const artifactid = req.params.artifactid
    projectmanager.getProjectData(projectid, (data)=>{
        if(data === undefined) {
            res.redirect('/projects')
        } else {
            artifactmanager.getArtifactData(projectid,artifactid, (artifactdata)=>{
                if(artifactdata === undefined) {
                    res.redirect('/project/'+projectid)
                } else {
                    res.locals.projectid = projectid
                    res.locals.artifactid = artifactid
                    res.locals.artifact = artifactdata
                    res.locals.project = data
                    res.render('artifact')
                }
            })
        }
    })
})

router.get("/:projectid/:artifactid(\\d+)/:operatingsystem",(req,res)=>{
    const projectid = req.params.projectid
    const artifactid = req.params.artifactid
    const os = req.params.operatingsystem
    projectmanager.getProjectData(projectid, (data)=>{
        if(data === undefined) {
            res.redirect('/projects')
        } else {
            artifactmanager.getArtifactData(projectid,artifactid, (artifactdata)=>{
                if(artifactdata === undefined) {
                    res.redirect('/project/'+projectid)
                } else {
                    res.download(artifactmanager.getPathToOsFile(artifactdata.artifactpath,os))
                }
            })
        }
    })
})

router.post('/:projectid/upload',upload.array('files'),(req,res)=>{
    const projid = req.params.projectid
    artifactmanager.uploadArtifact(projid,req.body.desc,req.body.commitid,req.files,()=>{
        res.redirect('/project/'+projid)
    })
})

module.exports = router;