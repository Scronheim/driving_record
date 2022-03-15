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
                <v-btn block text color="primary">{{ instructor.car.model }}</v-btn>
                <v-btn block text color="primary">{{ instructor.car.lpn }}</v-btn>
                <v-btn block text color="primary">{{ instructor.car.transmission }}</v-btn>
                <v-btn block text color="primary">{{ instructor.car.color }}</v-btn>
                <v-btn block text color="primary">{{ instructor.school.address }}</v-btn>
                <v-btn block text color="primary">{{ instructor.phone }}</v-btn>
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
      return this.$_.chunk(this.$store.getters.instructors, 5)
    }
  },
  data: () => ({

  }),
}
</script>
