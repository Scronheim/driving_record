<template>
  <v-data-table
      dense
      :footer-props="{'items-per-page-options': rowsPerPageItems}"
      :headers="instructorHeaders"
      :items="instructors"
  >
    <template v-slot:item.name="{item}">
      <v-edit-dialog
          @save="updateInstructor(item)"
          :return-value.sync="item.name"
      >
        {{ item.name }}
        <template v-slot:input>
          <v-text-field dense solo-inverted v-model="item.name" />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.email="{item}">
      <v-edit-dialog
          @save="updateInstructor(item)"
          :return-value.sync="item.email"
      >
        <v-btn text link small :href="`mailto:${item.email}`">{{ item.email }}</v-btn>
        <template v-slot:input>
          <v-text-field dense solo-inverted v-model="item.email" />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.phone="{item}">
      <v-edit-dialog
          @save="updateInstructor(item)"
          :return-value.sync="item.phone"
      >
        <v-btn text link small :href="`tel:${item.phone}`">{{ item.phone }}</v-btn>
        <template v-slot:input>
          <v-text-field dense solo-inverted v-model="item.phone" />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.car="{item}">
      <v-btn text small @click="openCarInfoDialog(item)">{{ item.car.model }} (КПП {{ item.car.transmission }})</v-btn>
    </template>
    <template v-slot:item.disabled="{item}">
      <v-simple-checkbox
          v-ripple
          @click="updateInstructor(item)"
          v-model="item.disabled"
      />
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Instructors",
  computed: {
    instructors() {
      return this.$store.getters.instructors
    },
  },
  data: () => ({
    rowsPerPageItems: [15, 30, 50, 100, -1],
    instructorHeaders: [
      {text: 'ФИО', align: 'start', sortable: false, value: 'name'},
      {text: 'Email', align: 'start', sortable: false, value: 'email'},
      {text: 'Телефон', align: 'start', sortable: false, value: 'phone'},
      {text: 'Автомобиль', align: 'start', sortable: false, value: 'car'},
      {text: 'Заблокирован', align: 'start', sortable: true, value: 'disabled'},
    ],
  }),
  methods: {
    updateInstructor(instructor) {
      this.$emit('updateInstructor', instructor)
    },
    openCarInfoDialog(instructor) {
      this.$emit('openCarInfoDialog', instructor)
    }
  }
}
</script>

<style scoped>

</style>
