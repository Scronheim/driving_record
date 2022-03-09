<template>
  <v-container fluid>
    <v-row v-for="(chunk, chunkIndex) in chunkedInstructors" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(instructor, instructorIndex) in chunk" :key="`instructor-${instructorIndex}`">
        <v-card @click="$router.push(`/instructors/${instructor._id}`)">
          <v-card-title>{{ instructor.name }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col align="center">
                <v-avatar size="200">
                  <v-img :src="instructor.car.photo"/>
                </v-avatar>
              </v-col>
              <v-col>
                <v-btn x-large block text color="primary">{{ instructor.car.model }}</v-btn>
                <v-btn x-large block text color="primary">{{ instructor.car.lpn }}</v-btn>
                <v-btn x-large block text color="primary">{{ instructor.car.transmission }}</v-btn>
                <v-btn x-large block text color="primary">{{ instructor.car.color }}</v-btn>
                <v-btn x-large block text color="primary">{{ instructor.school.address }}</v-btn>
                <v-btn x-large block text color="primary">{{ instructor.phone }}</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Instructors',
  computed: {
    chunkedInstructors() {
      const instructors = this.$store.getters.users.filter((u) => {
        return u.role._id === '622062c2056fad1a42ab2cf0'
      })
      return this.$_.chunk(instructors, 3)
    }
  },
  data: () => ({

  }),
}
</script>
