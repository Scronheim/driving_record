const mongoose = require('mongoose')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(isSameOrAfter)

dayjs.tz.setDefault('Asia/Yekaterinburg')

const ObjectId = mongoose.Types.ObjectId

const db = require('../schemas')
db.mongoose.connect('mongodb://127.0.0.1/driver_school', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const Event = db.event

async function checkEventsDate() {
  const events = await Event.find({})
  const now = parseInt(dayjs().format('x'))
  for (const e of events) {
    const statusIsAbsence = new ObjectId('623190e8926bff909550602f').equals(e.status) // статус неявка
    if (e.end < now && !statusIsAbsence) {
      e.status = ObjectId('623190de926bff909550602e')
      await Event.findByIdAndUpdate(e._id, e, {new: true, upsert: true})
    }
  }
  process.exitCode = 1
}

checkEventsDate()
