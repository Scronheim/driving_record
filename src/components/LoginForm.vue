<template>
  <v-container fluid>
    <v-card color="transparent" flat v-if="registerForm">
      <v-card-title>Форма регистрации</v-card-title>
      <v-card-text align="center">
        <v-text-field dense
                      solo
                      required
                      :rules="inputRules"
                      label="Email*"
                      v-model="user.email"
        />
        <v-text-field dense
                      solo
                      required
                      :rules="inputRules"
                      label="Полное имя*"
                      v-model="user.name"
        />
        <v-text-field dense
                      solo
                      label="Номер телефона"
                      type="tel"
                      v-model="user.phone"
        />
        <v-text-field dense
                      solo
                      required
                      label="Пароль*"
                      :rules="inputRules"
                      :append-icon="e1 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="e1 = !e1"
                      :type="e1 ? 'password' : 'text'"
                      v-model="user.password"
        />
        <v-text-field dense
                      solo
                      label="Пароль ещё раз*"
                      :rules="inputRules"
                      :type="e1 ? 'password' : 'text'"
                      v-model="confirmPassword"
        />
        <v-select dense
                  solo
                  label="Адрес школы"
                  :items="$store.getters.schools"
                  item-text="address"
                  item-value="_id"
                  :rules="inputRules"
                  v-model="user.school"
        />
        <v-btn text color="success" @click="register">Регистрация</v-btn>
        <v-btn text color="primary" @click="registerForm = false">Форма входа</v-btn>
      </v-card-text>
    </v-card>

    <v-card color="transparent" flat v-else>
      <v-card-title>Форма входа</v-card-title>
      <v-card-text align="center">
        <v-text-field dense
                      solo
                      required
                      label="Email"
                      v-model="user.email"
        />
        <v-text-field dense
                      solo
                      label="Пароль"
                      :rules="inputRules"
                      :append-icon="e1 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="e1 = !e1"
                      :type="e1 ? 'password' : 'text'"
                      v-model="user.password"
                      @keyup.enter="login"
        />
        <v-btn text color="success" @click="login">Войти</v-btn>
        <v-btn text color="primary" @click="registerForm = true">Регистрация</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "LoginForm",
  mounted() {
    this.$store.dispatch('getSchools')
  },
  data: () => ({
    e1: true,
    inputRules: [
      (v) => !!v || 'Обязательное поле',
    ],
    registerForm: false,
    user: {
      email: null,
      name: null,
      car: null,
      school: null,
      disabled: false,
      phone: null,
      password: null,
    },
    confirmPassword: null,
  }),
  methods: {
    async login() {
      const payload = {
        email: this.user.email,
        password: this.user.password,
      }
      await this.$store.dispatch('login', payload)
    },
    async register() {
      await this.$store.dispatch('register', this.user)
      this.registerForm = false
    }
  }
}
</script>

<style scoped>

</style>
