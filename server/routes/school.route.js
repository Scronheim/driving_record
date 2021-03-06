const { authJwt } = require('../middlewares')
const controller = require('../controllers/school.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
  app.get('/api/schools', controller.getSchools)
  app.post('/api/schools', controller.insertSchool)
  app.patch('/api/schools', controller.updateSchool)
  app.delete('/api/schools', controller.removeSchool)

  app.get('/api/groups', controller.getGroups)
  app.post('/api/groups', controller.insertGroup)
  app.patch('/api/groups', controller.updateGroup)
}
