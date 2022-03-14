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
  app.get('/api/schools/:id', controller.getSchoolGroups)
}
