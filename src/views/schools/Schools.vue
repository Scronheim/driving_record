<template>
  <v-container fluid>
    <v-row v-for="(chunk, chunkIndex) in chunkedSchools" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(school, schoolIndex) in chunk" :key="`school-${schoolIndex}`">
        <v-card link :to="`/schools/${school._id}`">
          <v-card-title>{{ school.address }}</v-card-title>
          <v-card-text>
            Количество учащихся:
            <v-btn text small outlined color="primary">{{ school.studentsCount }}</v-btn>
            в <v-btn text small outlined color="primary">{{ school.groupsCount }}</v-btn> группах
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Schools',
  computed: {
    chunkedSchools() {
      const schools = this.$store.getters.schools
      schools.forEach((school) => {
        const students = this.$store.getters.students.filter((user) => {
          return user.school._id === school._id
        })
        const groups = this.$store.getters.groups.filter((group) => {
          return group.school._id === school._id
        })
        school.studentsCount = students.length
        school.groupsCount = groups.length
      })
      return this.$_.chunk(schools, this.$vuetify.breakpoint.mobile? 1: 3)
    }
  },
  data: () => ({

  }),
}
</script>
