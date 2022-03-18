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
                <v-list-item-title>{{ getPaymentsSum(student) }}р.</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="'mdi-car'"/>
                </v-list-item-icon>
                <v-list-item-title>{{ student.payments.length }} раз</v-list-item-title>
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
  computed: {
    chunkedStudents() {
      if (this.$store.getters.groups.length > 0) {
        const group = this.$store.getters.groups.find((g) => {
          return g.school._id === this.$route.params.id
        })
        return this.$_.chunk(group.students, 5)
      }
      return []
    }
  },
  methods: {
    getPaymentsSum(student) {
      if (student.payments.length > 0) {
        return student.payments.map((p) => {
          return p.sum
        }).reduce((prev, next) => {
          return prev + next
        })
      }
      return 0
    }
  }
}
</script>

<style scoped>

</style>
