<template>
  <v-data-table
      dense
      :footer-props="{'items-per-page-options': rowsPerPageItems}"
      :headers="groupHeaders"
      :items="groups"
  >
    <template #item.name="{item}">
      <v-edit-dialog
          @save="updateGroup(item)"
          :return-value.sync="item.name"
      >
        {{ item.name }}
        <template v-slot:input>
          <v-text-field dense outlined v-model="item.name" />
        </template>
      </v-edit-dialog>
    </template>
    <template #item.school="{item}">
      <v-edit-dialog
          @save="updateGroup(item)"
          :return-value.sync="item.school"
      >
        {{ item.school.address }}
        <template v-slot:input>
          <v-select
              dense
              v-model="item.school"
              :items="$store.getters.schools"
              item-value="_id"
              item-text="address"
          />
        </template>
      </v-edit-dialog>
    </template>
    <template #item.start="{item}">
      {{ item.start | humanDate }}
    </template>
    <template #item.students="{item}">
      {{ groupStudentsCount(item) }}
    </template>
    <template #item.closed="{item}">
      <v-simple-checkbox :ripple="false" v-model="item.closed" @click="updateGroup(item)"/>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Schools",
  computed: {
    groups() {
      return this.$store.getters.groups
    }
  },
  data: () => ({
    rowsPerPageItems: [15, 30, 50, 100, -1],
    groupHeaders: [
      {text: 'Название', align: 'start', sortable: false, value: 'name'},
      {text: 'Класс', align: 'start', sortable: false, value: 'school'},
      {text: 'Дата начала', align: 'start', sortable: false, value: 'start'},
      {text: 'Кол-во учеников', align: 'start', sortable: false, value: 'students'},
      {text: 'Закрыта', align: 'start', sortable: false, value: 'closed'},
    ],
  }),
  methods: {
    groupStudentsCount(group) {
      return this.$store.getters.users.filter((u) => {
        return u.group === group._id
      }).length
    },
    async removeGroup(group) {
      if (confirm(`Вы действительно хотите удалить группу ${group.name}?`)) {
        // await this.$store.dispatch('removeSchool', school._id)
        this.$toast.success('Группа удалена')
      }
    },
    async updateGroup(group) {
      await this.$store.dispatch('updateGroup', group)
      this.$toast.success(`Группа ${group.name} обновлена`)
    }
  }
}
</script>

<style scoped>

</style>
