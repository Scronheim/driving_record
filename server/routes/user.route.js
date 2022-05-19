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
  app.post('/api/upload_photo', controller.uploadPhoto)
  app.get('/api/users', controller.getUsers)
  app.patch('/api/users', [authJwt.verifyToken], controller.updateUser)
  app.post('/api/users', [authJwt.verifyToken], controller.insertUser)
  app.get('/api/payment_types', [authJwt.verifyToken], controller.getPaymentTypes)
}
