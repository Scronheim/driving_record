const { verifySignUp, authJwt} = require("../middlewares")
const controller = require("../controllers/auth.controller")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.post("/api/auth/signup", [verifySignUp.checkDuplicateEmail], controller.signUp)
  app.post("/api/auth/signin", controller.signIn)
  app.get("/api/me", [authJwt.verifyToken],controller.aboutMe)
  app.patch("/api/change_password", [authJwt.verifyToken],controller.changePassword)
  app.get('/api/roles', [authJwt.verifyToken], controller.getRoles)
}
