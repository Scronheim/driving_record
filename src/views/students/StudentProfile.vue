<template>
  <v-container fluid>
    <v-card color="#363636">
      <v-card-title>{{ student.name }}</v-card-title>
      <v-card-text>
        <v-card flat color="#363636">
          <v-card-title>Информация об ученике</v-card-title>
          <v-card-text>
            <StudentInfo
                :student="student"
                @updateStudent="updateStudent"
            />
          </v-card-text>
        </v-card>
        <v-card flat color="#363636" v-if="$store.getters.isAdmin">
          <v-card-title>
            Платежи
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn icon color="success" v-on="on" @click="newPaymentDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Добавить платёж</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <StudentPayments
                :student-payments="studentPayments"
                :student="student"
                @updateStudent="updateStudent"
            />
          </v-card-text>
        </v-card>
        <v-card flat color="#363636" v-if="$store.getters.isAdmin">
          <v-card-title>Занятия</v-card-title>
          <v-card-text>
            <StudentEvents :student-events="studentEvents"/>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <Dialog v-model="newPaymentDialog" title="Добавление платежа">
      <template v-slot:body>
        <v-date-picker locale="ru" show-week show-adjacent-months no-title class="ma-1" v-model="newPayment.date"/>
        <v-text-field dense solo-inverted hide-details label="Сумма" class="ma-1" type="number" v-model.number="newPayment.sum" append-icon="mdi-currency-rub"/>
        <v-select dense solo-inverted hide-details label="Тип" class="ma-1" v-model="newPayment.type"
                  :items="$store.getters.paymentTypes"
                  item-text="name"
                  item-value="_id"
        />
        <v-text-field dense solo-inverted hide-details label="Комментарий" class="ma-1" v-model="newPayment.comment"/>
      </template>
      <template v-slot:actions>
        <v-btn outlined text color="success" @click="addPayment">Добавить</v-btn>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import Dialog from '@/components/Dialog'
import StudentInfo from '@/components/student/StudentInfo'
import StudentEvents from '@/components/student/StudentEvents'
import StudentPayments from '@/components/student/StudentPayments'
import dayjs from "dayjs";
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
    studentPayments() {
      const student = this.$store.getters.students.find((s) => {
        return s._id === this.$route.params.id
      })
      if (student) {
        return student.payments.sort((a, b) => {
          return b.date - a.date
        })
      }
      return []
    }
  },
  data: () => ({
    newPayment: {
      date: dayjs().format('YYYY-MM-DD'),
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
      const payment = Object.assign({}, this.newPayment)
      payment.date = dayjs(payment.date).format('x')
      this.student.payments.push(payment)
      await this.$store.dispatch('updateUser', this.student)
      this.$toast.success(`Платёж добавлен`)
      this.newPaymentDialog = false
    }
  }
}
</script>

<style scoped></style>
