const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const db = require('./schemas')

db.mongoose.connect('mongodb://127.0.0.1/driver_school', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const app = express()
const router = new express.Router()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))

app.use(cors())
app.use(fileUpload({ createParentPath: true }))

require('./routes/auth.route')(app)
require('./routes/user.route')(app)
// require('./routes/instructor.route')(app)
// require('./routes/students.route')(app)
require('./routes/event.route')(app)
require('./routes/school.route')(app)
require('./routes/course.route')(app)

app.use(router)

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
