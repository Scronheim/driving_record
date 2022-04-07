<template>
  <v-data-table
      dense
      :footer-props="{'items-per-page-options': rowsPerPageItems}"
      :headers="schoolHeaders"
      :items="schools"
  >
    <template v-slot:item.address="{item}">
      <v-edit-dialog
          @save="updateSchool(item)"
          :return-value.sync="item.address"
      >
        {{ item.address }}
        <template v-slot:input>
          <v-text-field dense solo-inverted v-model="item.address" />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.actions="{item}">
      <v-btn icon color="error" @click="removeSchool(item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Schools",
  computed: {
    schools() {
      return this.$store.getters.schools
    }
  },
  data: () => ({
    rowsPerPageItems: [15, 30, 50, 100, -1],
    schoolHeaders: [
      {text: 'Адрес', align: 'start', sortable: false, value: 'address'},
      {text: 'Действия', align: 'start', sortable: false, value: 'actions'},
    ],
  }),
  methods: {
    async removeSchool(school) {
      if (confirm(`Вы действительно хотите удалить класс на ${school.address}?`)) {
        await this.$store.dispatch('removeSchool', school._id)
        this.$toast.success('Класс удалён')
      }
    },
    updateSchool(school) {
      this.$emit('updateSchool', school)
    }
  }
}
</script>

<style scoped>

</style>
