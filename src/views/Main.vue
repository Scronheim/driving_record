<template>
  <v-container fluid>
    <v-stepper
        v-if="$store.getters.isLogin"
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
        <v-alert type="info">
          Стоимость занятия {{ user.course.driving.cost }}р.
        </v-alert>
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
                    <v-btn block text color="primary">{{ instructor.car.model }}</v-btn>
                    <v-btn block text color="primary">{{ instructor.car.lpn }}</v-btn>
                    <v-btn block text color="primary">{{ instructor.car.transmission }}</v-btn>
                    <v-btn block text color="primary">{{ instructor.car.color }}</v-btn>
                    <v-btn block text color="primary" :href="`tel: ${instructor.phone}`" @click.stop>{{ instructor.phone }}</v-btn>
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
        <v-btn text color="success"
               :disabled="newEvents.length === 0"
               @click="addNewEvent">Записаться
        </v-btn>
        <v-alert type="info">
          Вы можете записаться в 1 день максимум на 2 занятия. На последующие занятия можно записаться через администратора.
          Отписаться за сутки невозможно
        </v-alert>
        <v-calendar
            ref="calendar"
            v-model="focus"
            locale="ru"
            :weekdays="weekday"
            :type="type"
            :events="events"
            @click:date="viewDay"
            @mousedown:time="register"
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
    <v-card v-else>
      <v-card-title>Добро пожаловать в личный кабинет школы «Авто Зачёт»</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'Main',
  computed: {
    filteredInstructors() {
      return this.$store.getters.instructors.filter((i) => {
        return ((this.instructorFilter === '') || (i.name.toUpperCase().indexOf(this.instructorFilter.toUpperCase()) >= 0))
      })
    },
    chunkedInstructors() {
      return this.$_.chunk(this.filteredInstructors, 3)
    },
    events() {
      const events = this.$store.getters.events.filter((e) => {
        return e.instructor === this.record.instructor._id
      })
      events.forEach((e) => {
        e.name = e.type.name
        e.color = e.type.color
      })
      return events
    },
    user() {
      return this.$store.getters.user
    }
  },
  data: () => ({
    instructorFilter: '',
    currentStep: 1,
    record: {
      instructor: {},
      student: {},
      start: null,
      end: null,
      timed: true,
      type: null,
      status: null,
      name: null,
    },
    newEvents: [],
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
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),
  methods: {
    async addNewEvent() {
      await this.$store.dispatch('addNewEvents', this.newEvents)
      this.newEvents.forEach((e) => {
        const date = dayjs(e.start).format('DD.MM.YYYY')
        const timeStart = dayjs(e.start).format('HH:mm')
        const timeEnd = dayjs(e.end).format('HH:mm')
        this.$toast.success(`Вы записались на ${date}, с ${timeStart} до ${timeEnd}`)
      })
      this.newEvents = []
    },
    register (tms) {
      const mouse = this.toTime(tms)
      const eventIndex = this.newEvents.findIndex((e) => {
        return e.start === this.roundTime(mouse)
      })
      if (eventIndex > -1) {
        this.newEvents.splice(eventIndex, 1)
        this.$store.commit('removeEvent', eventIndex)
        return
      }
      if (this.newEvents.length >= 2) {
        this.$toast.error('Записаться можно не больше чем на 2 занятия в сутки')
        return
      }
      this.createStart = this.roundTime(mouse)
      const event = {
        type: '6221d6203962a189d7ade049',
        name: 'Занято',
        color: 'error',
        start: this.createStart,
        end: parseInt(dayjs(this.createStart).add(1.5, 'h').format('x')),
        instructor: this.record.instructor._id,
        student: this.record.student._id,
        cost: this.$store.getters.user.course.driving.cost,
        timed: true,
        status: '623190b8926bff909550602c'
      }

      this.newEvents.push(event)

      this.$store.commit('addEvent', event)
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
      if (dayjs(date).isSameOrAfter(dayjs())) {
        this.focus = date
        this.type = 'day'
      } else {
        this.$toast.warning(`Выберите дату после ${date}`)
      }
    },
    selectInstructor(instructor) {
      this.record.instructor = instructor
      this.record.student = this.$store.getters.user
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

</style>
