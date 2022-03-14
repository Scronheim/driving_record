<template>
  <v-container fluid>
    <v-stepper
        v-model="currentStep"
        vertical
    >
      <v-stepper-step
          :complete="currentStep > 1"
          step="1"
      >
        Выберите инструктора
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-row v-for="(chunk, chunkIndex) in chunkedInstructors" :key="`chunk-${chunkIndex}`">
          <v-col v-for="(instructor, instructorIndex) in chunk" :key="`instructor-${instructorIndex}`">
            <v-card @click="selectInstructor(instructor)">
              <v-card-title>{{ instructor.name }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col align="center">
                    <v-avatar size="200">
                      <v-img :src="instructor.car.photo"/>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <v-btn x-large block text color="primary">{{ instructor.car.model }}</v-btn>
                    <v-btn x-large block text color="primary">{{ instructor.car.lpn }}</v-btn>
                    <v-btn x-large block text color="primary">{{ instructor.car.transmission }}</v-btn>
                    <v-btn x-large block text color="primary">{{ instructor.car.color }}</v-btn>
                    <v-btn x-large block text color="primary">{{ instructor.school.address }}</v-btn>
                    <v-btn x-large block text color="primary">{{ instructor.phone }}</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-step
          :complete="currentStep > 2"
          step="2"
      >
        Выберите дату и время
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
            >
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>День</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Неделя</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Месяц</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-calendar
            ref="calendar"
            v-model="focus"
            locale="ru"
            :weekdays="weekday"
            :type="type"
            :events="events"
            @click:date="viewDay"
            @mousedown:time="startTime"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            first-time="08:00"
            :interval-minutes="90"
            :interval-count="9"
            :interval-format="intervalFormatter"
        >
          <template v-slot:event="{ event }">
            <div class="v-event-draggable">
              <strong>{{ event.name }}</strong>
              {{ formatEventTime(event.start) }} - {{ formatEventTime(event.end) }}
            </div>
          </template>
        </v-calendar>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  name: 'Main',
  computed: {
    chunkedInstructors() {
      return this.$_.chunk(this.$store.getters.instructors, 3)
    },
    events() {
      return this.$store.getters.userEvents
    }
  },
  data: () => ({
    currentStep: 1,
    record: {
      instructor: {},
      student: null,
      date: null,
    },
    typeToLabel: {
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
    },
    type: 'month',
    types: [
      {text: 'День', value: 'day'},
      {text: 'Неделя', value: 'week'},
      {text: 'Месяц', value: 'month'},
    ],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    focus: '',
    names: ['Нет записи', 'Свободно', 'Занято', 'Неявка', 'Экзамен', 'Внутренний экзамен'],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),
  methods: {
    startDrag ({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
    startTime (tms) {
      const mouse = this.toTime(tms)
      console.log(this.roundTime(mouse))
      const eventIndex = this.events.findIndex((e) => {
        return e.start === this.roundTime(mouse)
      })
      if (eventIndex > -1) {
        console.log(eventIndex)
        this.$store.commit('removeEvent', eventIndex)
      }

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        this.createEvent = {
          name: `Занято`,
          color: 'error',
          start: this.createStart,
          end: this.$dayjs(this.createStart).add(1, 'h').add(30, 'm').format('YYYY-MM-DD HH:mm'),
          timed: true,
        }

        this.events.push(this.createEvent)
      }
    },
    extendBottom (event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    mouseMove (tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start
        const end = this.dragEvent.end
        const duration = end - start
        const newStartTime = mouse - this.dragTime
        const newStart = this.roundTime(newStartTime)
        const newEnd = newStart + duration

        this.dragEvent.start = newStart
        this.dragEvent.end = newEnd
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false)
        const min = Math.min(mouseRounded, this.createStart)
        const max = Math.max(mouseRounded, this.createStart)

        this.createEvent.start = min
        this.createEvent.end = max
      }
    },
    endDrag () {
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
    },
    cancelDrag () {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          const i = this.events.indexOf(this.createEvent)
          if (i !== -1) {
            this.events.splice(i, 1)
          }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },
    roundTime (time, down = true) {
      const roundTo = 90 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },
    toTime (tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    viewDay({date}) {
      this.focus = date
      this.type = 'day'
    },
    selectInstructor(instructor) {
      this.record.instructor = instructor
      this.$store.dispatch('getUserEvents', instructor._id)
      this.currentStep = 2
    },
    intervalFormatter(locale) {
      return locale.time
    },
    formatEventTime(date) {
      return new Date(date).toLocaleTimeString('ru-RU', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}
</style>
