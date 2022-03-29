<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ student.name }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <StudentInfo
                :student="student"
                @updateStudent="updateStudent"
            />
          </v-col>
        </v-row>
        <v-row v-if="$store.getters.isAdmin">
          <v-col>
            <v-btn text color="success" @click="newPaymentDialog = true">Добавить платёж</v-btn>
            <StudentPayments
                :student-payments="student.payments"
                :student="student"
                @updateStudent="updateStudent"
            />
          </v-col>
        </v-row>
        <v-row v-if="$store.getters.isAdmin">
          <v-col>
            <StudentEvents :student-events="studentEvents"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <Dialog v-model="newPaymentDialog" title="Добавление платежа">
      <template v-slot:body>
        <v-date-picker locale="ru" show-week show-adjacent-months no-title class="ma-1" v-model="newPayment.date"/>
        <v-text-field dense solo-inverted hide-details label="Сумма" class="ma-1" v-model="newPayment.sum" append-icon="mdi-currency-rub"/>
        <v-select dense solo-inverted hide-details label="Тип" class="ma-1" v-model="newPayment.type"
                  :items="$store.getters.paymentTypes"
                  item-text="name"
                  item-value="_id"
        />
        <v-text-field dense solo-inverted hide-details label="Комментарий" class="ma-1" v-model="newPayment.comment"/>
      </template>
      <template v-slot:actions>
        <v-btn text color="success" @click="addPayment">Добавить</v-btn>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import Dialog from '@/components/Dialog'
import StudentInfo from '@/components/student/StudentInfo'
import StudentEvents from '@/components/student/StudentEvents'
import StudentPayments from '@/components/student/StudentPayments'
export default {
  name: 'StudentProfile',
  components: {Dialog, StudentInfo, StudentEvents, StudentPayments},
  computed: {
    student() {
      if (this.$store.getters.students.length > 0) {
        return this.$store.getters.students.find((s) => {
          return s._id === this.$route.params.id
        })
      }
      return {
        school: {},
        payments: [],
        course: {
          driving: {},
          theory: {},
        },
      }
    },
    studentEvents() {
      return this.$store.getters.events.filter((e) => {
        return e.student._id === this.$route.params.id
      })
    },
  },
  data: () => ({
    newPayment: {
      date: null,
      type: null,
      sum: null,
      comment: null,
    },
    newPaymentDialog: false,
  }),
  methods: {
    async updateStudent() {
      await this.$store.dispatch('updateUser', this.student)
      this.$toast.success(`Ученик обновлён`)
    },
    async addPayment() {
      this.student.payments.push(this.newPayment)
      await this.$store.dispatch('updateUser', this.student)
      this.$toast.success(`Платёж добавлен`)
    }
  }
}
</script>

<style scoped></style>
