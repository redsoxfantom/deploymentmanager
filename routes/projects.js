const router = require('express').Router()
const projectmanager = require('../managers/projectmanager.js')
const fsManager = require('../managers/filesystemmanager')
const multer = require('multer')
const path = require('path')
const upload = multer({dest: path.join(fsManager.dynamics,'tmp')})

router.get('/',(req,res)=>{
    projectmanager.getAllProjects((arr)=>{
        res.locals.projects=arr
        res.render('projects')
    })
})

router.get('/new',(req,res)=>{
    res.render('newproject')
})

router.post('/new',upload.none(),(req,res)=>{
    projectdef = req.body
    projectmanager.createNewProject(projectdef,()=>{
        res.redirect('/projects')
    })
})

module.exports = router;