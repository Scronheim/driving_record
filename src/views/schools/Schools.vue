<template>
  <v-container fluid>
    <v-row v-for="(chunk, chunkIndex) in chunkedSchools" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(school, schoolIndex) in chunk" :key="`school-${schoolIndex}`">
        <v-card link :to="`/schools/${school._id}`">
          <v-card-title>{{ school.address }}</v-card-title>
          <v-card-text>
            Количество учащихся:
            <v-btn text small color="primary">{{ school.studentsCount }}</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Schools',
  async mounted() {
    await this.$store.dispatch('getStudents')
    await this.$store.dispatch('getSchools')
    this.$store.getters.schools.forEach((school) => {
      const students = this.$store.getters.students.filter((user) => {
        return user.school._id === school._id
      })
      school.studentsCount = students.length
      this.schools.push(school)
    })
  },
  computed: {
    chunkedSchools() {
      return this.$_.chunk(this.schools, 3)
    }
  },
  data: () => ({
    schools: [],
  }),
}
</script>
