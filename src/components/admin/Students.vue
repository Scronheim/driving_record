<template>
  <v-card-text>
    <v-checkbox dense label="Показать только недобавленных" v-model="showOnlyNotAdded"/>
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
          {{ item.email }}
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
          {{ item.phone }}
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
        return this.$store.getters.students.filter((s) => {
          return s.added === false
        })
      }
      return this.$store.getters.students
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
      {text: 'Класс', align: 'start', sortable: true, value: 'school'},
      {text: 'Добавлен', align: 'start', sortable: false, value: 'added'},
      {text: 'Заблокирован', align: 'start', sortable: true, value: 'disabled'},
    ],
  }),
  methods: {
    updateStudent(student) {
      this.$emit('updateStudent', student)
    },
  }
}
</script>

<style scoped>

</style>
