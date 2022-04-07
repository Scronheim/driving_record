<template>
  <v-card-text>
    <v-checkbox dense label="Показать только ожидающих добавления" v-model="showOnlyNotAdded"/>
    <v-data-table
        dense
        :footer-props="{'items-per-page-options': rowsPerPageItems}"
        :headers="studentsHeaders"
        :items="students"
    >
      <template v-slot:item.profile="{item}">
        <v-btn text small link :to="`/student/${item._id}`">Перейти</v-btn>
      </template>
      <template v-slot:item.name="{item}">
        <v-edit-dialog
            @save="updateStudent(item)"
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
            @save="updateStudent(item)"
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
            @save="updateStudent(item)"
            :return-value.sync="item.phone"
        >
          <v-btn text link small :href="`tel:${item.phone}`">{{ item.phone }}</v-btn>
          <template v-slot:input>
            <v-text-field dense solo-inverted v-model="item.phone" />
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.school="{item}">
        <v-edit-dialog
            @save="updateStudent(item)"
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
      <template v-slot:item.group="{item}">
        <v-edit-dialog
            @save="updateStudent(item)"
            :return-value.sync="item.group"
        >
          {{ studentGroup(item) }}
          <template v-slot:input>
            <v-select
                dense
                v-model="item.group"
                :items="$store.getters.groups"
                item-value="_id"
                item-text="name"
            />
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.added="{item}">
        <v-simple-checkbox
            v-ripple
            @click="updateStudent(item)"
            v-model="item.added"
        />
      </template>
      <template v-slot:item.disabled="{item}">
        <v-simple-checkbox
            v-ripple
            @click="updateStudent(item)"
            v-model="item.disabled"
        />
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script>
export default {
  name: "Students",
  computed: {
    students() {
      if (this.showOnlyNotAdded) {
        return this.$store.getters.users.filter((u) => {
          return u.added === false && u.role.role === 'Ученик'
        })
      }
      return this.$store.getters.users.filter((u) => {
        return u.role.role === 'Ученик'
      })
    },
  },
  data: () => ({
    showOnlyNotAdded: false,
    rowsPerPageItems: [15, 30, 50, 100, -1],
    studentsHeaders: [
      {text: 'Профиль', align: 'start', sortable: false, value: 'profile'},
      {text: 'ФИО', align: 'start', sortable: false, value: 'name'},
      {text: 'Email', align: 'start', sortable: false, value: 'email'},
      {text: 'Телефон', align: 'start', sortable: false, value: 'phone'},
      {text: 'Класс', align: 'start', sortable: false, value: 'school'},
      {text: 'Группа', align: 'start', sortable: false, value: 'group'},
      {text: 'Добавлен', align: 'start', sortable: false, value: 'added'},
      {text: 'Заблокирован', align: 'start', sortable: true, value: 'disabled'},
    ],
  }),
  methods: {
    updateStudent(student) {
      this.$emit('updateStudent', student)
    },
    studentGroup(student) {
      const group = this.$store.getters.groups.find((g) => {
        return g._id === student.group
      })
      if (group) {
        return group.name
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
