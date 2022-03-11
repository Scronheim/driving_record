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

              <v-card>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn small color="#FFE4B5">Нет записи</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn small color="success">Свободно</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn small color="error">Занято</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn small color="#F4A460">Неявка</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn small color="#008CFF">Экзамен</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn small color="#B88527">Внутренний экзамен</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
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
              <v-tooltip bottom v-if="$store.getters.isAdmin">
                <template v-slot:activator="{on, attrs}">
                  <v-btn small icon color="success" v-on="on" v-bind="attrs" @click="addEventDialog = true">
                    <v-icon v-text="'mdi-plus'"/>
                  </v-btn>
                </template>
                <span>Добавить событие</span>
              </v-tooltip>
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
            @click:event="showEventDialog"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :first-interval="5"
            :interval-minutes="90"
            :interval-count="10"
            :interval-format="intervalFormatter"
        >
          <template v-slot:event="{ event }">
            <div class="v-event-draggable">
              <strong>{{ event.name }}</strong>
              {{ formatEventTime(event.start) }} - {{ formatEventTime(event.end) }}
            </div>
          </template>
        </v-calendar>
      </v-card-text>
    </v-card>

    <v-dialog v-model="eventDialog" max-width="60%" :fullscreen="$vuetify.breakpoint.mobile">
      <v-card>
        <v-card-title>Просмотр записи</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-school'"/>
              </v-list-item-icon>
              <v-list-item-title>
                {{ currentEvent.student.name }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-clock-start'"/>
              </v-list-item-icon>
              <v-list-item-title>
                {{ currentEvent.start | humanDateTime }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-clock-end'"/>
              </v-list-item-icon>
              <v-list-item-title>
                {{ currentEvent.end | humanDateTime }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-phone'"/>
              </v-list-item-icon>
              <v-list-item-title>
                {{ currentEvent.student.phone }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" @click="eventDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addEventDialog" max-width="60%" :fullscreen="$vuetify.breakpoint.mobile">
      <v-card>
        <v-card-title>Добавить событие</v-card-title>
        <v-card-text>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'InstructorProfile',
  mounted() {
    this.$store.dispatch('getUserEvents', this.$route.params.id)
  },
  computed: {
    instructor() {
      if (this.$store.getters.users.length > 0) {
        return this.$store.getters.users.find((u) => {
          return u._id === this.$route.params.id
        })
      }
      return {}
    },
    events() {
      return this.$store.getters.userEvents
    },
    colors() {
      return this.$store.getters.eventTypes.map((t) => {
        return t.color
      })
    }
  },
  data: () => ({
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
    eventDialog: false,
    addEventDialog: false,
    currentEvent: {
      student: {},
      instructor: {},
    },
  }),
  methods: {
    setToday () {
      this.focus = ''
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
    showEventDialog(event) {
      this.currentEvent = event.event
      this.eventDialog = true
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
