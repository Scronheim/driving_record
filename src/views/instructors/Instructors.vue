<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <v-text-field dense label="Фильтр" hide-details solo v-model="instructorFilter"/>
      </v-col>
    </v-row>
    <v-row v-for="(chunk, chunkIndex) in chunkedInstructors" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(instructor, instructorIndex) in chunk" :key="`instructor-${instructorIndex}`">
        <v-card>
          <v-card-title>{{ instructor.name }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col align="center">
                <v-avatar size="150">
                  <v-img :src="instructor.car.photo"/>
                </v-avatar>
              </v-col>
              <v-col>
                <v-btn block text color="primary">{{ instructor.car.model }}</v-btn>
                <v-btn block text color="primary">{{ instructor.car.lpn }}</v-btn>
                <v-btn block text color="primary">{{ instructor.car.transmission }}</v-btn>
                <v-btn block text color="primary">{{ instructor.car.color }}</v-btn>
                <v-btn block text :href="`tel:${instructor.phone}`" color="primary">{{ instructor.phone }}</v-btn>
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
    filteredInstructors() {
      return this.$store.getters.instructors.filter((i) => {
        return ((this.instructorFilter === '') || (i.name.toUpperCase().indexOf(this.instructorFilter.toUpperCase()) >= 0))
      })
    },
    chunkedInstructors() {
      return this.$_.chunk(this.filteredInstructors, 3)
    }
  },
  data: () => ({
    instructorFilter: '',
  }),
}
</script>
