<template>
  <v-card>
    <v-card-text>
      <v-btn text outlined color="success" @click.stop="newGroupDialog = true">Добавить</v-btn>
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
      <Dialog v-model="newGroupDialog" title="Добавление группы">
        <template v-slot:body>
          <v-text-field
              dense
              outlined
              hide-details
              label="Название"
              class="ma-2"
              v-model="newGroup.name" />
          <v-select
              dense
              outlined
              hide-details
              label="Класс"
              class="ma-2"
              :items="$store.getters.schools"
              item-value="_id"
              item-text="address"
              v-model="newGroup.school"
          />
          <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="newGroup.start"
                  outlined
                  hide-details
                  class="ma-2"
                  label="Выберите дату начала"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              />
            </template>
            <v-date-picker
                v-model="newGroup.start"
                @input="startDateMenu = false"
            />
          </v-menu>
        </template>
        <template v-slot:actions>
          <v-btn text color="success" @click="addNewGroup">Добавить</v-btn>
        </template>
      </Dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import dayjs from 'dayjs'
import Dialog from '@/components/Dialog'

export default {
  name: "Schools",
  components: {Dialog},
  computed: {
    groups() {
      return this.$store.getters.groups
    }
  },
  data: () => ({
    startDateMenu: false,
    newGroup: {
      name: '',
      school: '',
      start: dayjs().format('YYYY-MM-DD'),
      closed: false,
    },
    newGroupDialog: false,
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
    async addNewGroup() {
      const payload = Object.assign({}, this.newGroup)
      payload.start = parseInt(dayjs(payload.start).format('x'))
      await this.$store.dispatch('addNewGroup', payload)
      this.newGroupDialog = false
      this.$toast.success(`Группа добавлена`)
    },
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
