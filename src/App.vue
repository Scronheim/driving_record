<template>
  <v-app>
    <v-app-bar app>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="drawer = !drawer" v-on="on" v-bind="attrs">
            <v-icon v-text="drawer ? 'mdi-close': 'mdi-menu'"/>
          </v-btn>
        </template>
        <span>{{ drawer ? 'Закрыть': 'Открыть' }} меню</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="back" v-if="!isMobile" v-on="on" v-bind="attrs">
            <v-icon v-text="'mdi-arrow-left'"/>
          </v-btn>
        </template>
        <span>Назад</span>
      </v-tooltip>

      <div class="d-flex align-center">
        <v-img
            alt="Logo"
            class="shrink mt-1"
            contain
            min-width="100"
            src="@/assets/logo.png"
        />
      </div>

      <v-spacer/>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <LeftMenu/>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import LeftMenu from '@/components/LeftMenu'
export default {
  name: 'App',
  components: {LeftMenu},
  mounted() {
    this.$vuetify.theme.dark = true
    this.$store.commit('getToken')
    if (this.$store.getters.token) {
      this.$store.dispatch('getAllData')
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  data: () => ({
    drawer: true,
  }),
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
};
</script>

<style>
#app {
  background: url("assets/bg.gif") repeat !important;
}
</style>
