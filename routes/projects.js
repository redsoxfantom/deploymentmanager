const router = require('express').Router()
const projectmanager = require('../managers/projectmanager.js')

router.get('/',(req,res)=>{
    projectmanager.getAllProjects((arr)=>{
        res.locals.projects=arr
        res.render('projects')
    })
})

router.get('/project/:projectid',(req,res)=>{
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

router.get('/project/:projectid/upload',(req,res)=>{
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

router.get('/new',(req,res)=>{
    res.render('newproject')
})

router.post('/new',(req,res)=>{
    projectdef = req.body
    projectmanager.createNewProject(projectdef,()=>{
        res.redirect('/projects')
    })
})

module.exports = router;