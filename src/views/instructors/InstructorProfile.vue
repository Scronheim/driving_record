<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ instructor.name }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
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
            <v-menu
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                    color="indigo"
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-help-circle</v-icon>
                </v-btn>
              </template>

              <Statuses readonly/>
            </v-menu>
            <v-btn text outlined color="success" @click="saveNewEvents">Сохранить</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-toolbar>
              <v-btn
                  fab
                  text
                  small
                  color="grey darken-2"
                  @click="prev"
              >
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn
                  fab
                  text
                  small
                  color="grey darken-2"
                  @click="next"
              >
                <v-icon small>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
            </v-toolbar>
          </v-col>
        </v-row>
        <v-calendar
            ref="calendar"
            v-model="focus"
            locale="ru"
            :weekdays="weekday"
            :type="type"
            :events="events"
            @click:date="viewDay"
            @click:event="cancelEvent"
            @contextmenu:event="showContextMenu"
            @mousedown:time="addEvent"
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
          <template v-slot:day-label="data">
            {{ data.day }}
            <v-select dense outlined v-if="data.future" :items="itemsForFillDay" @change="fillDay($event, data)" :value="0"/>
          </template>
        </v-calendar>
      </v-card-text>
    </v-card>

    <v-menu
        v-model="contextMenu.visible"
        :position-x="contextMenu.x"
        :position-y="contextMenu.y"
        absolute
        offset-y
        offset-x
        offset-overflow>
      <Statuses :readonly="false" :current-event="currentEvent"/>
    </v-menu>

  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import Statuses from '@/components/Statuses'

export default {
  name: 'InstructorProfile',
  components: {Statuses},
  computed: {
    instructor() {
      if (this.$store.getters.instructors.length > 0) {
        return this.$store.getters.instructors.find((u) => {
          return u._id === this.$route.params.id
        })
      }
      return {}
    },
    events() {
      const events = this.$store.getters.events.filter((e) => {
        return e.instructor._id === this.$route.params.id
      })
      events.forEach((e) => {
        e.name = e.type.name
        e.color = e.type.color
      })
      return events
    },
  },
  data: () => ({
    contextMenu: {
      visible: false,
      x: 0,
      y:0,
    },
    itemsForFillDay: [
      {value: 0, text: 'Выберите условие', disabled: true},
      {value: 1, text: 'День свободен'},
      {value: 2, text: 'День нерабочий'},
    ],
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
    weekday: [1, 2, 3, 4, 5, 6, 0],
    focus: '',
    eventDialog: false,
    addEventDialog: false,
    currentEvent: {
      student: {},
      instructor: {},
    },
  }),
  methods: {
    showContextMenu(e) {
      e.nativeEvent.preventDefault()
      this.currentEvent = e.event
      this.contextMenu.visible = false
      this.contextMenu.x = e.nativeEvent.clientX
      this.contextMenu.y = e.nativeEvent.clientY
      this.$nextTick(() => {
        this.contextMenu.visible = true
      })
    },
    fillDay(value, data) {
      let eventType
      if (value === 1) {
        eventType = {
          _id: '6221d6183962a189d7ade048',
          name: 'Свободно',
          color: 'success'
        }
      } else if (value === 2) {
        eventType = {
          _id: '6221d6063962a189d7ade047',
          name: 'Нет записи',
          color: '#FFE4B5'
        }
      }
      let createStart = dayjs(data.date).add(8, 'h')
      const eventIndex = this.events.findIndex((e) => {
        return e.start === parseInt(createStart.format('x'))
      })
      if (eventIndex !== -1) {
        this.$store.commit('removeEvents', {eventIndex, count: 10})
      }
      for (let i = 1; i < 10; i++) {
        if (i > 1) {
          createStart = createStart.add(1.5, 'h')
        }
        const event = {
          type: eventType,
          start: parseInt(createStart.format('x')),
          end: parseInt(dayjs(createStart).add(1.5, 'h').format('x')),
          instructor: {_id: this.instructor._id},
          timed: true,
          status: '623190b8926bff909550602c',
          isNewEvent: true,
        }
        this.$store.commit('addEvent', event)
      }
    },
    async saveNewEvents() {
      const newEvents = this.events.filter((e) => {
        return e.isNewEvent
      })
      await this.$store.dispatch('addNewEvents', newEvents)
      this.$toast.success('Расписание сохранено')
    },
    async addEvent(tms) {
      const clickedTime = this.toTime(tms)
      const createStart = this.roundTime(clickedTime)
      const eventExist = this.events.find((e) => {
        return e.start === createStart
      })
      if (!eventExist) {
        const event = {
          type: {
            _id: '6221d6183962a189d7ade048',
            name: 'Свободно',
            color: 'success'
          },
          start: createStart,
          end: parseInt(dayjs(createStart).add(1.5, 'h').format('x')),
          instructor: {_id: this.instructor._id},
          timed: true,
          status: '623190b8926bff909550602c',
          isNewEvent: true,
        }
        this.$store.commit('addEvent', event)
      }
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
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    viewDay({date}) {
      this.focus = date
      this.type = 'day'
    },
    cancelEvent(event) {
      if (event.event._id) {
        this.$store.dispatch('removeEvent', event.event._id)
      } else {
        const eventIndex = this.$store.getters.events.findIndex((e) => {
          return e.start === event.event.start && e.instructor._id === this.instructor._id
        })
        if (eventIndex > -1) {
          this.$store.commit('removeEvent', eventIndex)
        }
      }
      this.$toast.success('Событие удалено')
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
