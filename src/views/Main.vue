<template>
  <v-container fluid>
    <template v-if="$store.getters.userHasCourse">
      <v-alert type="info" v-if="$store.getters.drivingIsAvailable">
        Стоимость занятия {{ user.course.driving.cost }}р. Вам доступно {{ $store.getters.availableSumForDriving }}р
      </v-alert>
      <v-alert type="warning" v-else>
        Доступная для вождения сумма ({{ $store.getters.availableSumForDriving }}р) меньше стоимости одного занятия ({{ user.course.driving.cost }}р).
        Пополните пожалуйста счёт через администратора
      </v-alert>
    </template>
    <v-alert type="warning" v-else-if="!$store.getters.userHasCourse && $store.getters.isLogin">
      У Вас не выбран курс. Пожалуйста <router-link to="/courses">перейдите</router-link> на страницу с выбором курса
    </v-alert>
    <v-stepper
        v-if="$store.getters.isStudent && $store.getters.userHasCourse"
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
        <v-btn text outlined color="success"
               :disabled="newEvents.length === 0"
               @click="register">
          Записаться
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
            :start="today"
            :type="type"
            :events="events"
            @click:date="viewDay"
            @mousedown:time="addEvent"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            first-time="08:00"
            :interval-minutes="90"
            :interval-count="9"
            :interval-format="intervalFormatter"
        >
          <template v-slot:event="{ event }">
            <strong>{{ event.name }}</strong>
            {{ formatEventTime(event.start) }} - {{ formatEventTime(event.end) }}
          </template>
        </v-calendar>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'Main',
  computed: {
    today() {
      return dayjs().format('YYYY-MM-DD')
    },
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
        return e.instructor._id === this.record.instructor._id || e.instructor === this.record.instructor._id
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
    type: 'week',
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
    async register() {
      await this.$store.dispatch('addNewEvents', this.newEvents)
      await this.$store.dispatch('updateUser')
      this.newEvents.forEach((e) => {
        const date = dayjs(e.start).format('DD.MM.YYYY')
        const timeStart = dayjs(e.start).format('HH:mm')
        const timeEnd = dayjs(e.end).format('HH:mm')
        this.$toast.success(`Вы записались на ${date}, с ${timeStart} до ${timeEnd}`)
      })
      this.newEvents = []
    },
    addPayment(event) {
      const payload = {
        date: dayjs(event.start).format('x'),
        sum: event.cost,
        type: this.$store.getters.paymentTypes.find((t) => {
          return t.name === 'Вождение'
        })._id,
        comment: '',
      }
      this.$store.commit('addPayment', payload)
    },
    addEvent(tms) {
      const mouse = this.toTime(tms)
      const eventIndex = this.events.findIndex((e) => {
        return e.start === this.roundTime(mouse)
      })

      if (eventIndex > -1) {
        const oldEvent = this.events[eventIndex]
        if (oldEvent.name === 'Занято') {
          if (oldEvent.student._id === this.user._id) {
            if (!dayjs(oldEvent.start).diff(dayjs(), 'd') > 0) {
              this.$toast.error('Нельзя отписаться менее чем за сутки')
              return
            } else {
              if (confirm(`Вы уверены что хотите отписаться от занятия?`)) {
                this.newEvents.splice(eventIndex, 1)
                this.$store.dispatch('removeEvent', oldEvent._id)
                this.$store.commit('removePayment', oldEvent.start)
                this.$store.dispatch('updateUser')
              }
              return
            }
          } else {
            this.$toast.warning('Данное время занято другим человеком')
            return
          }
        }
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
      this.addPayment(event)
    },
    roundTime(time, down = true) {
      const roundTo = 90 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },
    toTime(tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    viewDay({date}) {
      if (dayjs(date).isSameOrAfter(dayjs())) {
        this.focus = date
        this.type = 'day'
      } else {
        this.$toast.warning(`Выберите дату после ${dayjs(date).format('DD.MM.YYYY')}`)
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
