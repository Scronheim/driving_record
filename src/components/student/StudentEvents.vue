<template>
  <div>
    <v-data-table style="background-color: #363636"
        dense no-data-text="Нет данных"
        :headers="eventHeaders"
        :items="userEvents"
        :item-class="rowClass"
        @contextmenu:row="show"
    >
      <template v-slot:top>
        <v-row>
          <v-col>
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
                  <v-list-item v-for="status in eventsStatuses" :key="`help-${status._id}`">
                    <v-list-item-content>
                      <v-btn small :color="status.color">{{ status.name }}</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <b>Всего занятий:</b> {{ totalEvents }}
          </v-col>
          <v-col>
            <b>Завершенных:</b> {{ totalFinished }}
          </v-col>
          <v-col>
            <b>Запланированных:</b> {{ totalPlaned }}
          </v-col>
          <v-col>
            <b>Неявок:</b> {{ totalAbsence }}
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.date="{item}">
        {{ item.start | humanDate }}
      </template>
      <template v-slot:item.time="{item}">
        {{ item.start | humanTime }} - {{ item.end | humanTime }}
      </template>
      <template v-slot:item.cost="{item}">
        <template v-if="item.cost">
        {{ item.cost }}р.
        </template>
      </template>
      <template v-slot:item.instructor="{item}">
        {{ item.instructor.name }} ({{ item.instructor.phone }})
      </template>
      <template v-slot:item.student="{item}">
        <template v-if="item.student">
          {{ item.student.name }} ({{ item.student.phone }})
        </template>
      </template>
      <template v-slot:item.status="{item}">
        <v-edit-dialog v-if="$store.getters.isAdmin"
                       @save="updateEvent(item)"
                       :return-value.sync="item.status"
        >
          {{ item.status.name }}
          <template v-slot:input>
            <v-select
                dense
                v-model="item.status"
                :items="$store.getters.eventStatuses"
                item-value="_id"
                item-text="name"
            />
          </template>
        </v-edit-dialog>
        <template v-else>
          {{ item.status.name }}
        </template>
      </template>
      <template v-slot:item.actions="{item}" v-if="$store.getters.isAdmin">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn icon color="error" v-on="on" v-bind="attrs"
                   @click="removeEvent(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Удалить</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-menu
        v-model="showContextMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
    >
      <v-list dense>
        <v-list-item link v-for="status in eventsStatuses" :key="status._id" @click="setEventStatus(status)">
          <v-list-item-icon>
            <v-icon :color="status.color">mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ status.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: "StudentEvents",
  props: {
    userEvents: {
      type: Array,
      required: true,
    }
  },
  computed: {
    eventsStatuses() {
      return this.$store.getters.eventStatuses
    },
    totalEvents() {
      return this.userEvents.length
    },
    totalFinished() {
      return this.userEvents.filter((e) => {
        return e.status._id === '623190de926bff909550602e'
      }).length
    },
    totalPlaned() {
      return this.userEvents.filter((e) => {
        return e.status._id === '623190b8926bff909550602c'
      }).length
    },
    totalAbsence() {
      return this.userEvents.filter((e) => {
        return e.status._id === '623190e8926bff909550602f'
      }).length
    },
  },
  data: () => ({
    currentEvent: {},
    showContextMenu: false,
    x: 0,
    y: 0,
    eventHeaders: [
      {text: 'Дата занятия', align: 'start', sortable: false, value: 'date'},
      {text: 'Время', align: 'start', sortable: false, value: 'time'},
      {text: 'Сумма', align: 'start', sortable: false, value: 'cost'},
      {text: 'Инструктор', align: 'start', sortable: false, value: 'instructor'},
      {text: 'Ученик', align: 'start', sortable: false, value: 'student'},
      {text: 'Статус', align: 'start', sortable: false, value: 'status'},
      {text: 'Действия', align: 'start', sortable: false, value: 'actions', visible: false,},
    ],
  }),
  methods: {
    async updateEvent(event) {
      await this.$store.dispatch('updateEvent', event)
      this.$toast.success('Занятие обновлено')
    },
    async setEventStatus(status) {
      this.currentEvent.status = status._id
      await this.$store.dispatch('updateEvent', this.currentEvent)
      this.$toast.success('Статус обновлён')
    },
    show(e, {item}) {
      if (this.$store.getters.isAdmin || this.$store.getters.isInstructor) {
        Object.assign(this.currentEvent, item)
        e.preventDefault()
        this.showContextMenu = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.showContextMenu = true
        })
      }
    },
    removeEventButtonIsDisabled(event) {
      return !dayjs(event.start).diff(dayjs(), 'd') >= 0
    },
    removeEvent(event) {
      const startDate = dayjs(event.start).format('DD.MM.YYYY HH:mm')
      if (confirm(`Вы уверены что хотите отписаться от занятия, назначенное на ${startDate}?`)) {
        this.$store.dispatch('removeEvent', event._id)
      }
    },
    rowClass(item) {
      return item.status.color
    },
  }
}
</script>

<style scoped>

</style>
