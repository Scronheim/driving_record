<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="mt-7">
            <v-avatar size="56" color="primary">
              {{ splittedUserName[0] }}{{ splittedUserName[1] }}
            </v-avatar>
            <p class="ml-3 mt-3">
              {{ user.name }}
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="success" v-on="on" @click="updateUser">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </template>
                <span>Сохранить</span>
              </v-tooltip>
            </p>
          </v-card-title>
          <MobileProfile v-if="$vuetify.breakpoint.mobile"
                         :user="user"
                         @changePassword="changePasswordDialog = true"
                         @showCourseDialog="courseDialog = true"
          />
          <DesktopProfile v-else
                          :user="user"
                          @changePassword="changePasswordDialog = true"
                          @showCourseDialog="courseDialog = true"
          />
        </v-card>
      </v-col>
    </v-row>

    <Dialog v-model="changePasswordDialog" title="Смена пароля">
      <template v-slot:body>
        <v-form ref="passwordForm">
          <v-text-field
              dense
              outlined
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :rules="[rules.required, rules.min]"
              label="Новый пароль"
              v-model="newPassword.password" />
          <v-text-field
              dense
              outlined
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
        <v-btn text outlined color="success" @click="changePassword">Сменить </v-btn>
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
import DesktopProfile from '@/components/profile/DesktopProfile'
import MobileProfile from '@/components/profile/MobileProfile'
export default {
  name: 'Profile',
  components: {DesktopProfile, MobileProfile, Dialog},
  computed: {
    splittedUserName() {
      const splitted = this.user.name.split(' ')
      if (splitted[0][0]) {
        return [
          splitted[0][0].toUpperCase(),
          splitted[1][0].toUpperCase(),
        ]
      }
      return []
    },
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
    async updateUser() {
      await this.$store.dispatch('updateUser', this.user)
      this.$toast.success('Пользователь сохранён')
    },
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
