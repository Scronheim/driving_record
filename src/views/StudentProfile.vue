<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ student.name }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-at'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.email }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-phone'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.phone }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-domain'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.school.address }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-clock'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.createdAt | humanDate }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <v-data-table
                :headers="paymentHeaders"
                :items="student.payments"
            >
              <template v-slot:item.date="{item}">
                {{ item.date | humanDate }}
              </template>
              <template v-slot:item.sum="{item}">
                {{ item.sum }}р.
              </template>
              <template v-slot:item.type="{item}">
                {{ item.type | paymentType }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "StudentProfile",
  mounted() {
    this.$store.dispatch('getStudents')
    this.$store.dispatch('getPaymentTypes')
    this.$store.dispatch('getUserEvents', this.$route.params.id)
  },
  computed: {
    student() {
      if (this.$store.getters.students.length > 0) {
        return this.$store.getters.students.find((s) => {
          return s._id === this.$route.params.id
        })
      }
      return {
        school: {},
      }
    }
  },
  data: () => ({
    paymentHeaders: [
      {text: 'Дата платежа', align: 'start', sortable: true, value: 'date'},
      {text: 'Сумма', align: 'start', sortable: true, value: 'sum'},
      {text: 'Тип', align: 'start', sortable: true, value: 'type'},
      {text: 'Комментарий', align: 'start', sortable: false, value: 'comment'},
    ],
    eventHeaders: [
      {text: 'Дата занятия', align: 'start', sortable: true, value: 'date'},
      {text: 'Время', align: 'start', sortable: false, value: 'time'},
      {text: 'Инструктор', align: 'start', sortable: true, value: 'instructor'},
    ]
  })
}
</script>

<style scoped>

</style>
