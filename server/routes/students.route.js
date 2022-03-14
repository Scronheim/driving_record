const { authJwt } = require('../middlewares')
const controller = require('../controllers/student.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
  app.get('/api/students', controller.getStudents)
  app.get('/api/payment_types', [authJwt.verifyToken], controller.getPaymentTypes)
  // app.post('/api/student', controller.insertStudent)
  app.patch('/api/student', [authJwt.verifyToken], controller.updateStudent)
}
