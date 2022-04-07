<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-text-field dense outlined label="ФИО" v-model="user.name"/>
        <v-text-field dense outlined label="Класс" readonly v-if="$store.getters.isStudent" v-model="user.school.address"/>
      </v-col>
      <v-col>
        <v-text-field dense outlined label="Email" v-model="user.email"/>
        <v-text-field dense outlined label="Группа" readonly v-if="$store.getters.isStudent" v-model="user.group.name"/>
      </v-col>
      <v-col>
        <v-text-field dense outlined label="Телефон" v-model="user.phone"/>
        <v-text-field dense outlined label="Дата регистрации" readonly v-model="registerDate"/>
      </v-col>
    </v-row>
    <template v-if="!$store.getters.isAdmin">
      <v-row>
        <v-col>
          <StudentEvents :student-events="$store.getters.studentEvents"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <StudentPayments :student="user" :student-payments="$store.getters.studentPayments"/>
        </v-col>
      </v-row>
    </template>
  </v-card-text>
</template>

<script>
import dayjs from 'dayjs'
import StudentEvents from '@/components/student/StudentEvents'
import StudentPayments from '@/components/student/StudentPayments'

export default {
  name: "DesktopProfile",
  components: {StudentEvents, StudentPayments},
  props: {
    user: {
      type: Object,
      required: true,
    }
  },
  computed: {
    registerDate() {
      return dayjs(this.user.createdAt).format('DD.MM.YYYY')
    }
  }
}
</script>

<style scoped>

</style>
