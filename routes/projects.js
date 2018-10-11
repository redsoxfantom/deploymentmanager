const router = require('express').Router()
const projectmanager = require('../managers/projectmanager.js')

router.get('/',(req,res)=>{
    projectmanager.getAllProjects((arr)=>{
        res.locals.projects=arr
        res.render('projects')
    })
})

router.get('/:projectid',(req,res)=>{
    const projectid = req.params.projectid
    projectmanager.getProjectData(projectid,(projectdata)=>{
        res.locals.project=projectdata
        res.locals.projectid=projectid
        res.render('project')
    })
})

module.exports = router;