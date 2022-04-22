<template>
  <v-card color="#363636">
    <v-card-text>
      <v-btn text outlined color="success" @click.stop="newSchoolDialog = true">Добавить</v-btn>
      <v-data-table style="background-color: #363636"
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

      <Dialog v-model="newSchoolDialog" title="Добавление класса">
        <template v-slot:body>
          <v-text-field
              dense
              outlined
              hide-details
              label="Адрес"
              class="ma-2"
              v-model="newSchool.address" />
        </template>
        <template v-slot:actions>
          <v-btn text outlined color="success" @click="addNewSchool">Добавить</v-btn>
        </template>
      </Dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import Dialog from '@/components/Dialog'

export default {
  name: "Schools",
  components: {Dialog},
  computed: {
    schools() {
      return this.$store.getters.schools
    }
  },
  data: () => ({
    newSchoolDialog: false,
    newSchool: {
      address: null,
    },
    rowsPerPageItems: [15, 30, 50, 100, -1],
    schoolHeaders: [
      {text: 'Адрес', align: 'start', sortable: false, value: 'address'},
      {text: 'Действия', align: 'start', sortable: false, value: 'actions'},
    ],
  }),
  methods: {
    async addNewSchool() {
      await this.$store.dispatch('addNewSchool', this.newSchool)
      this.newSchoolDialog = false
      this.$toast.success(`Класс добавлен`)
    },
    async removeSchool(school) {
      if (confirm(`Вы действительно хотите удалить класс на ${school.address}?`)) {
        await this.$store.dispatch('removeSchool', school._id)
        this.$toast.success('Класс удалён')
      }
    },
    async updateSchool(school) {
      await this.$store.dispatch('updateSchool', school)
      this.$toast.success(`Класс обновлён`)
    },
  }
}
</script>

<style scoped>

</style>
