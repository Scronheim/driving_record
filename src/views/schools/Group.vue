<template>
  <v-container fluid>
    <v-row v-for="(chunk, chunkIndex) in chunkedStudents" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(student, studentIndex) in chunk" :key="`student-${studentIndex}`">
        <v-card link :to="`/student/${student._id}`">
          <v-card-title>{{ student.name }}</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-phone'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.phone }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-currency-rub'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ getPaymentsSum(student) }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-car'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.payments.length }}</v-list-item-title>
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
  name: "Group",
  mounted() {
    this.$store.dispatch('getGroupsBySchoolId', this.$route.params.id)
  },
  computed: {
    chunkedStudents() {
      if (this.$store.getters.schoolGroups.length > 0) {
        const group = this.$store.getters.schoolGroups.find((g) => {
          return g.school._id === this.$route.params.id
        })
        return this.$_.chunk(group.students, 5)
      }
      return []
    }
  },
  methods: {
    getPaymentsSum(student) {
      return student.payments.map((p) => {
        return p.sum
      }).reduce((prev, next) => {
        return prev + next
      })
    }
  }
}
</script>

<style scoped>

</style>
