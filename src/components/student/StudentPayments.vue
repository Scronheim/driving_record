<template>
  <v-data-table
      dense no-data-text="Нет данных"
      :headers="paymentHeaders"
      :items="studentPayments">
    <template v-slot:top>
      <v-row>
        <v-col>
          <b>Всего:</b> {{ totalAmount }}р.
        </v-col>
        <v-col>
          <b>Теория:</b> {{ totalTheory }}р.
        </v-col>
        <v-col>
          <b>Вождение:</b> {{ totalDriving }}р.
        </v-col>
        <v-col>
          <b>Доп. вождение:</b> {{ totalAdditionalDriving }}р.
        </v-col>
        <v-col>
          <b>Экзамен:</b> {{ totalExam }}р.
        </v-col>
      </v-row>
    </template>
    <template v-slot:item.date="{item}">
      {{ item.date | humanDate }}
    </template>
    <template v-slot:item.sum="{item}">{{ item.sum }}р.</template>
    <template v-slot:item.type="{item}">
      <v-edit-dialog
          @save="updateStudent"
          :return-value.sync="item.type"
      >
        {{ item.type | paymentType }}
        <template v-slot:input>
          <v-select
              dense
              v-model="item.type"
              :items="$store.getters.paymentTypes"
              item-value="_id"
              item-text="name"
          />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.comment="{item}">
      <v-edit-dialog
          @save="updateStudent"
          :return-value.sync="item.comment"
      >
        {{ item.comment }}
        <template v-slot:input>
          <v-text-field dense solo-inverted v-model="item.comment"/>
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.actions="{item}">
      <v-btn icon color="error" @click="removePayment(item)">
        <v-icon v-text="'mdi-delete'"/>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "StudentPayments",
  props: {
    studentPayments: {
      type: Array,
      required: true,
    }
  },
  computed: {
    totalAmount() {
      if (this.studentPayments.length > 0) {
        return this.studentPayments.map((p) => {
          return p.sum
        }).reduce((prev, next) => {
          return prev + next
        })
      }
      return 0
    },
    totalTheory() {
      if (this.studentPayments.length > 0) {
        return this.studentPayments.filter((p) => {
          return p.type === '622f0b6386788d850dc496f3'
        }).map((p) => {
          return p.sum
        }).reduce((prev, next) => {
          return prev + next
        })
      }
      return 0
    },
    totalDriving() {
      const drivings = this.studentPayments.filter((p) => {
        return p.type === '622f0b6c86788d850dc496f4'
      })
      if (drivings.length > 0) {
        return drivings.map((p) => {
          return p.sum
        }).reduce((prev, next) => {
          return prev + next
        })
      }
      return 0
    },
    totalAdditionalDriving() {
      const additionalDrivings = this.studentPayments.filter((p) => {
        return p.type === '622f0b6c86788d850dc496f5'
      })
      if (additionalDrivings.length > 0) {
        return additionalDrivings.map((p) => {
          return p.sum
        }).reduce((prev, next) => {
          return prev + next
        })
      }
      return 0
    },
    totalExam() {
      const exams = this.studentPayments.filter((p) => {
        return p.type === '622f0b6c86788d850dc496f6'
      })
      if (exams.length > 0) {
        return exams.map((p) => {
          return p.sum
        }).reduce((prev, next) => {
          return prev + next
        })
      }
      return 0
    },
  },
  data: () => ({
    paymentHeaders: [
      {text: 'Дата платежа', align: 'start', sortable: true, value: 'date'},
      {text: 'Сумма', align: 'start', sortable: true, value: 'sum'},
      {text: 'Тип', align: 'start', sortable: true, value: 'type'},
      {text: 'Комментарий', align: 'start', sortable: false, value: 'comment'},
      {text: 'Действия', align: 'start', sortable: false, value: 'actions'},
    ],
  }),
  methods: {
    removePayment(payment) {
      if (confirm(`Вы действительно хотите удалить этот платёж?`)) {
        const paymentIndex = this.student.payments.findIndex((p) => {
          return p._id === payment._id
        })
        if (paymentIndex > -1) {
          this.student.payments.splice(paymentIndex, 1)
          this.updateStudent()
        }
      }
    },
    updateStudent(student) {
      this.$emit('updateStudent', student)
    }
  }
}
</script>

<style scoped>

</style>
