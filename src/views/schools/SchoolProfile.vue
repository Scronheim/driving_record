<template>
  <v-container fluid>
    <template v-if="chunkedGroups.length > 0">
      <v-row v-for="(chunk, chunkIndex) in chunkedGroups" :key="`chunk-${chunkIndex}`">
        <v-col v-for="(group, groupIndex) in chunk" :key="`group-${groupIndex}`">
          <v-card link :to="`/groups/${group._id}`">
            <v-card-title>{{ group.name }}</v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-account-group'"/>
                  </v-list-item-icon>
                  <v-list-item-title>{{ groupStudentsCount(group) }} человек</v-list-item-title>
                </v-list-item>
                <v-list-item title="Дата начала">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-clock-start'"/>
                  </v-list-item-icon>
                  <v-list-item-title>{{ group.start | humanDate }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-alert type="info">В данном классе нет групп</v-alert>
    </template>
  </v-container>
</template>

<script>
export default {
  name: "SchoolProfile",
  computed: {
    chunkedGroups() {
      const groups = this.$store.getters.groups.filter((g) => {
        return g.school._id === this.$route.params.id
      })
      return this.$_.chunk(groups, 4)
    }
  },
  data: () => ({

  }),
  methods: {
    groupStudentsCount(group) {
      return this.$store.getters.users.filter((u) => {
        return u.group === group._id
      }).length
    },
  }
}
</script>

<style scoped>

</style>
