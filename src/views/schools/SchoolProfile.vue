<template>
  <v-container fluid>
    <v-row v-for="(chunk, chunkIndex) in chunkedGroups" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(group, groupIndex) in chunk" :key="`group-${groupIndex}`">
        <v-card link :to="`/groups/${group.school._id}`">
          <v-card-title>{{ group.name }}</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-account-group'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ group.students.length }} человек</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-clock-start'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ group.createdAt | humanDate }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-clock-end'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ group.endedAt | humanDate }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SchoolProfile",
  mounted() {
    this.$store.dispatch('getGroupsBySchoolId', this.$route.params.id)
  },
  computed: {
    chunkedGroups() {
      return this.$_.chunk(this.$store.getters.schoolGroups, 3)
    }
  },
}
</script>

<style scoped>

</style>
