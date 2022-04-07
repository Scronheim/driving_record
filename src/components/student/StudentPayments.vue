<template>
  <v-data-table
      dense no-data-text="Нет данных"
      :headers="paymentHeaders"
      :items="studentPayments">
    <template v-slot:top>
      <v-row>
        <v-col>
          <b>Стоимость курса:</b> {{ courseCost }}р.
        </v-col>
        <v-col>
          <b>Фактически внесено:</b> {{ totalRealMoney }}р.
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
        <v-col>
          <b>Остаток:</b> {{ balanceLeft }}р.
        </v-col>
      </v-row>
    </template>
    <template v-slot:item.date="{item}">
      {{ item.date | humanDate }}
    </template>
    <template v-slot:item.sum="{item}">{{ item.sum }}р.</template>
    <template v-slot:item.type="{item}">
      <v-edit-dialog v-if="$store.getters.isAdmin"
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
      <template v-else>
        {{ item.type | paymentType }}
      </template>
    </template>
    <template v-slot:item.comment="{item}">
      <v-edit-dialog v-if="$store.getters.isAdmin"
          @save="updateStudent"
          :return-value.sync="item.comment"
      >
        {{ item.comment }}
        <template v-slot:input>
          <v-text-field dense solo-inverted v-model="item.comment"/>
        </template>
      </v-edit-dialog>
      <template v-else>
        {{ item.comment }}
      </template>
    </template>
    <template v-slot:item.actions="{item}" v-if="$store.getters.isAdmin">
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
    },
    student: {
      type: Object,
      required: true,
    }
  },
  computed: {
    balanceLeft() {
      return this.totalRealMoney - this.totalExam - this.totalTheory - this.totalDriving - this.totalAdditionalDriving
    },
    courseCost() {
      return this.student.course.cost
    },
    totalTheory() {
      return this.student.course.theory.cost - this.student.course.theory.discount
    },
    totalRealMoney() {
      const money = this.student.payments.filter((p) => {
        return p.type === '624e693d1d606f93efc3e444' // тип фактический взнос денег
      })
      return money.reduce((acc, value) => {
        return acc + value.sum
      }, 0)
    },
    totalDriving() {
      const driving = this.student.payments.filter((p) => {
        return p.type === '622f0b6c86788d850dc496f4' // тип вождение
      })
      return driving.reduce((acc, value) => {
        return acc + value.sum
      }, 0)
    },
    totalAdditionalDriving() {
      const driving = this.student.payments.filter((p) => {
        return p.type === '622f0b7586788d850dc496f5' // тип доп. вождение
      })
      return driving.reduce((acc, value) => {
        return acc + value.sum
      }, 0)
    },
    totalExam() {
      return this.student.course.driving.cost * 4
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
