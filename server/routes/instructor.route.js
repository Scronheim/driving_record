const { authJwt } = require('../middlewares')
const controller = require('../controllers/instructors.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
  app.post('/api/recaptcha', controller.verifyRecaptchaToken)
  app.get('/api/instructors', controller.getUsers)
  app.post('/api/instructor', [authJwt.verifyToken, authJwt.isAdmin], controller.insertInstructor)
  app.patch('/api/instructor', [authJwt.verifyToken], controller.updateInstructor)
}
