<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ student.name }}
        <v-btn icon color="primary">
          <v-icon v-text="'mdi-pencil'"/>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Класс</th>
                  <th>Группа</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ student.name }}</td>
                  <td>{{ student.email }}</td>
                  <td>{{ student.phone }}</td>
                  <td>
                    <v-edit-dialog
                        @save="updateStudent"
                        :return-value.sync="student.school"
                    >
                      {{ student.school.address }}
                      <template v-slot:input>
                        <v-select
                            dense
                            v-model="student.school"
                            :items="$store.getters.schools"
                            item-value="_id"
                            item-text="address"
                        />
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <v-edit-dialog
                        @save="updateStudent"
                        :return-value.sync="student.group"
                    >
                      {{ student.group.name }}
                      <template v-slot:input>
                        <v-select
                            dense
                            v-model="student.group"
                            :items="$store.getters.schoolGroups"
                            item-value="_id"
                            item-text="name"
                        />
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>{{ student.createdAt | humanDate }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row v-if="$store.getters.isAdmin">
          <v-col>
            <v-btn text color="success" @click="newPaymentDialog = true">Добавить платёж</v-btn>
            <v-data-table :headers="paymentHeaders" :items="student.payments">
              <template v-slot:item.date="{item}">
                {{ item.date | humanDate }}
              </template>
              <template v-slot:item.sum="{item}"> {{ item.sum }}р. </template>
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
          </v-col>
        </v-row>
        <v-row v-if="$store.getters.isAdmin">
          <v-col>123</v-col>
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
export default {
  name: 'StudentProfile',
  components: {Dialog},
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
        group: {},
      }
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
    paymentHeaders: [
      {text: 'Дата платежа', align: 'start', sortable: true, value: 'date'},
      {text: 'Сумма', align: 'start', sortable: true, value: 'sum'},
      {text: 'Тип', align: 'start', sortable: true, value: 'type'},
      {text: 'Комментарий', align: 'start', sortable: false, value: 'comment'},
      {text: 'Действия', align: 'start', sortable: false, value: 'actions'},
    ],
    eventHeaders: [
      {text: 'Дата занятия', align: 'start', sortable: true, value: 'date'},
      {text: 'Время', align: 'start', sortable: false, value: 'time'},
      {text: 'Инструктор', align: 'start', sortable: true, value: 'instructor'},
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
    async updateStudent() {
      await this.$store.dispatch('updateStudent', this.student)
      this.$toast.success(`Ученик обновлён`)
    },
    async addPayment() {
      this.student.payments.push(this.newPayment)
      await this.$store.dispatch('updateStudent', this.student)
      this.$toast.success(`Платёж добавлен`)
    }
  }
}
</script>

<style scoped></style>
