<template>
  <div>
    <v-list nav dense v-if="$store.getters.isLogin">
      <v-list-item link to="/admin" v-if="$store.getters.isAdmin">
        <v-list-item-icon>
          <v-icon v-text="'mdi-crown'"/>
        </v-list-item-icon>
        <v-list-item-title v-text="'Админка'"/>
      </v-list-item>
      <v-list-item link v-for="(item, index) in menu" :key="`menuItem-${index}`" :to="item.to">
        <v-list-item-icon>
          <v-icon v-text="item.icon"/>
        </v-list-item-icon>
        <v-list-item-title v-text="item.text"/>
      </v-list-item>
      <v-divider/>
      <v-list-item link @click="logout">
        <v-list-item-icon>
          <v-icon v-text="'mdi-exit-to-app'"/>
        </v-list-item-icon>
        <v-list-item-title v-text="'Выход'"/>
      </v-list-item>
    </v-list>
    <LoginForm v-else/>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm'
export default {
  name: 'LeftMenu',
  components: {LoginForm},
  data: () => ({
    menu: [
      {text: 'Онлайн запись', to: '/', icon: 'mdi-pen-plus'},
      {text: 'Профиль', to: '/profile', icon: 'mdi-account'},
      {text: 'Сообщения', to: '/messages', icon: 'mdi-message'},
      {text: 'Классы', to: '/schools', icon: 'mdi-domain'},
      {text: 'Инструктора', to: '/instructors', icon: 'mdi-human-male-board'},
      // {text: 'Ученики', to: '/students', icon: 'mdi-school'},
    ],
  }),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
