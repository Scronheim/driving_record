<template>
  <v-container fluid>
    <v-card>
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item title="Email">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
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
          <v-list-item title="Адрес школы">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
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
          <v-list-item title="Телефон">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
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
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-icon v-on="on" v-bind="attrs">
                  <v-icon>mdi-clock</v-icon>
                </v-list-item-icon>
              </template>
              <span>Дата регистрации</span>
            </v-tooltip>
            <v-list-item-content>
              <v-list-item-title>
                <v-btn text small>{{ user.createdAt | humanDateTime }}</v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>

<style scoped>

</style>
