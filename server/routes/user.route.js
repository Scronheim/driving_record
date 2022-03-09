const { authJwt } = require('../middlewares')
const controller = require('../controllers/user.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
  app.post('/api/recaptcha', controller.verifyRecaptchaToken)
  app.get('/api/users', [authJwt.verifyToken], controller.getUsers)
  app.get('/api/roles', [authJwt.verifyToken], controller.getRoles)
  app.get('/api/user/me', [authJwt.verifyToken], controller.aboutMe)
  app.post('/api/user', [authJwt.verifyToken, authJwt.isAdmin], controller.insertUser)
  app.patch('/api/user', [authJwt.verifyToken], controller.updateUser)
}
