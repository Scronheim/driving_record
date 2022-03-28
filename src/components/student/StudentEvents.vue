<template>
  <v-data-table
      dense no-data-text="Нет данных"
      :headers="eventHeaders"
      :items="studentEvents"
      :item-class="rowClass"
  >
    <template v-slot:top>
      <v-row>
        <v-col>
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
      {{ item.cost }}р.
    </template>
    <template v-slot:item.status="{item}">
      {{ item.status.name }}
    </template>
    <template v-slot:item.instructor="{item}">
      {{ item.instructor.name }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "StudentEvents",
  props: {
    studentEvents: {
      type: Array,
      required: true,
    }
  },
  computed: {
    totalEvents() {
      return this.studentEvents.length
    },
    totalFinished() {
      return this.studentEvents.filter((e) => {
        return e.status._id === '623190de926bff909550602e'
      }).length
    },
    totalPlaned() {
      return this.studentEvents.filter((e) => {
        return e.status._id === '623190b8926bff909550602c'
      }).length
    },
    totalAbsence() {
      return this.studentEvents.filter((e) => {
        return e.status._id === '623190e8926bff909550602f'
      }).length
    },
  },
  data: () => ({
    eventHeaders: [
      {text: 'Дата занятия', align: 'start', sortable: true, value: 'date'},
      {text: 'Время', align: 'start', sortable: false, value: 'time'},
      {text: 'Сумма', align: 'start', sortable: false, value: 'cost'},
      {text: 'Статус', align: 'start', sortable: true, value: 'status'},
      {text: 'Инструктор', align: 'start', sortable: true, value: 'instructor'},
    ],
  }),
  methods: {
    rowClass(item) {
      switch (item.status._id) {
        case '623190b8926bff909550602c': // Запланировано
          return 'primary'
        case '623190ca926bff909550602d': // В процессе
          return 'orange'
        case '623190de926bff909550602e': // Завершено
          return 'success'
        case '623190e8926bff909550602f': // Неявка
          return 'error'
      }
    },
  }
}
</script>

<style scoped>

</style>
