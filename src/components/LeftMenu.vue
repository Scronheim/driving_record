<template>
  <v-list nav dense>
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
</template>

<script>
export default {
  name: 'LeftMenu',

  data: () => ({
    menu: [
      {text: 'Главная', to: '/', icon: 'mdi-home'},
      {text: 'Профиль', to: '/profile', icon: 'mdi-account'},
      {text: 'Сообщения', to: '/messages', icon: 'mdi-message'},
      {text: 'Школы', to: '/schools', icon: 'mdi-domain'},
      {text: 'Инструктора', to: '/instructors', icon: 'mdi-human-male-board'},
      {text: 'Ученики', to: '/students', icon: 'mdi-school'},
    ],
  }),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
