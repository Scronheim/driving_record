const { authJwt } = require('../middlewares')
const controller = require('../controllers/course.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
  app.get('/api/courses', controller.getCourses)
  // app.post('/api/schools', controller.insertSchool)
  // app.patch('/api/schools', controller.updateSchool)
  // app.get('/api/groups', controller.getGroups)
}
