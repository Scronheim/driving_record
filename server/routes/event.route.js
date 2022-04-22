const { authJwt } = require('../middlewares')
const controller = require('../controllers/event.controller')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
  app.get('/api/events', controller.getEvents)
  app.post('/api/events', controller.addEvents)
  app.patch('/api/events', controller.updateEvent)
  app.delete('/api/events', [authJwt.verifyToken], controller.removeEvent)
  app.get('/api/event_types', controller.getEventTypes)
  app.get('/api/event_statuses', controller.getEventStatuses)
}
