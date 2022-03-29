<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col :cols="$vuetify.breakpoint.mobile ? '' : 2">
            <v-list dense>
              <v-list-item title="Email">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-list-item-icon v-on="on" v-bind="attrs">
                      <v-icon>mdi-at</v-icon>
                    </v-list-item-icon>
                  </template>
                  <span>Email</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn text small>{{ user.email }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Адрес школы" v-if="!$store.getters.isAdmin">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-list-item-icon v-on="on" v-bind="attrs">
                      <v-icon>mdi-domain</v-icon>
                    </v-list-item-icon>
                  </template>
                  <span>Адрес школы</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn text small>{{ user.school.address }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Группа" v-if="!$store.getters.isAdmin">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-list-item-icon v-on="on" v-bind="attrs">
                      <v-icon>mdi-account-group</v-icon>
                    </v-list-item-icon>
                  </template>
                  <span>Группа</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn text small>{{ user.group.name }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Роль">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-list-item-icon v-on="on" v-bind="attrs">
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                  </template>
                  <span>Роль</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn text small>{{ user.role.role }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Телефон">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-list-item-icon v-on="on" v-bind="attrs">
                      <v-icon>mdi-phone</v-icon>
                    </v-list-item-icon>
                  </template>
                  <span>Телефон</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn text small>{{ user.phone }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Дата регистрации">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-list-item-icon v-on="on" v-bind="attrs">
                      <v-icon>mdi-clock</v-icon>
                    </v-list-item-icon>
                  </template>
                  <span>Дата регистрации</span>
                </v-tooltip>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn text small>{{ user.createdAt | humanDate }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn text color="yellow" v-if="$store.getters.userHasCourse" @click="courseDialog = true">
              Выбранный курс
            </v-btn>
            <v-btn text color="success" @click="$router.push('/')">
              Записаться на вождение
            </v-btn>
            <v-btn text color="primary" @click="changePasswordDialog = true">
              Сменить пароль
            </v-btn>
          </v-col>
          <template v-if="$store.getters.isStudent">
            <v-col>
              <StudentEvents :student-events="$store.getters.userEvents"/>
            </v-col>
            <v-col>
              <StudentPayments
                  :student="user"
                  :student-payments="$store.getters.userPayments"/>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>

    <Dialog v-model="changePasswordDialog" title="Смена пароля">
      <template v-slot:body>
        <v-form ref="passwordForm">
          <v-text-field
              dense
              solo-inverted
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :rules="[rules.required, rules.min]"
              label="Новый пароль"
              v-model="newPassword.password" />
          <v-text-field
              dense
              solo-inverted
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              autocomplete="new-password"
              :rules="[rules.required, rules.min, passwordConfirmationRule]"
              label="Новый пароль ещё раз"
              @click:append="showPassword = !showPassword"
              v-model="newPassword.passwordConfirm" />
        </v-form>
      </template>
      <template v-slot:actions>
        <v-btn text color="success" @click="changePassword">Сменить </v-btn>
      </template>
    </Dialog>
    <Dialog v-if="$store.getters.isStudent" v-model="courseDialog" title="Просмотр выбранного курса" width="60%">
      <template v-slot:body>
        <v-simple-table dense>
          <thead>
            <tr>
              <th>Общая сумма</th>
              <th>КПП</th>
              <th>Занятий по вождению</th>
              <th>Цена 1 занятия</th>
              <th>Стоимость теории</th>
              <th>Цена за доп. вождение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ user.course.cost }}р</td>
              <td>{{ user.course.transmission }}</td>
              <td>{{ user.course.driving.class }}</td>
              <td>{{ user.course.driving.cost }}р</td>
              <td>{{ user.course.theory.cost }}р ({{ user.course.theory.place }})</td>
              <td>{{ user.course.additionalDrivingCost }}р</td>
            </tr>
          </tbody>
        </v-simple-table>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import Dialog from '@/components/Dialog'
import StudentEvents from '@/components/student/StudentEvents'
import StudentPayments from '@/components/student/StudentPayments'

export default {
  name: 'Profile',
  components: {StudentPayments, Dialog, StudentEvents},
  computed: {
    user() {
      return this.$store.getters.user
    },
    passwordConfirmationRule() {
      return (
          this.newPassword.password === this.newPassword.passwordConfirm ||
          'Пароли должны совпадать'
      )
    },
  },
  data: () => ({
    courseDialog: false,
    showPassword: false,
    changePasswordDialog: false,
    newPassword: {
      password: '',
      passwordConfirm: '',
    },
    eventHeaders: [
      {text: 'Дата занятия', align: 'start', sortable: true, value: 'date'},
      {text: 'Время', align: 'start', sortable: false, value: 'time'},
      {text: 'Сумма', align: 'start', sortable: false, value: 'cost'},
      {text: 'Статус', align: 'start', sortable: true, value: 'status'},
      {text: 'Инструктор', align: 'start', sortable: true, value: 'instructor'},
    ],
    rules: {
      required: (value) => !!value || 'Обязательное поле',
      min: (v) => v.length >= 8 || 'Минимум 8 символов',
      emailMatch: () => `The email and password you entered don't match`,
    },
  }),
  methods: {
    async changePassword() {
      if (this.$refs.passwordForm.validate()) {
        await this.$store.dispatch('changePassword', this.newPassword)
        this.changePasswordDialog = false
        this.$toast.success('Пароль изменён')
      } else {
        this.$toast.error('Форма содержит ошибки')
      }
    },
  },
}
</script>

<style scoped></style>
