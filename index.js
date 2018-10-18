const express = require('express')
const app = express()
const config = require('./config.json')
const port = config.port
const logger = require('morgan')
const path = require('path')
const projects = require('./routes/projects.js')
const project = require('./routes/project')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/projects',projects)
app.use('/project',project)
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
app.listen(port, ()=> console.log(`Listening on ${port}`))