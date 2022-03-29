<template>
  <v-simple-table dense>
    <thead>
      <tr>
        <th>ФИО</th>
        <th>Email</th>
        <th>Телефон</th>
        <th>Класс</th>
        <th>Группа</th>
        <th>Дата регистрации</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <v-edit-dialog v-if="$store.getters.isAdmin"
                         @save="updateStudent"
                         :return-value.sync="student.name"
          >
            {{ student.name }}
            <template v-slot:input>
              <v-text-field
                  dense
                  solo-inverted
                  hide-details
                  v-model="student.name"
              />
            </template>
          </v-edit-dialog>
          <template v-else>
            {{ student.name }}
          </template>
        </td>
        <td>
          <v-edit-dialog v-if="$store.getters.isAdmin"
              @save="updateStudent"
              :return-value.sync="student.email"
          >
            {{ student.email }}
            <template v-slot:input>
              <v-text-field
                  dense
                  solo-inverted
                  hide-details
                  v-model="student.email"
              />
            </template>
          </v-edit-dialog>
          <template v-else>
            {{ student.email }}
          </template>
        </td>
        <td>
          <v-edit-dialog v-if="$store.getters.isAdmin"
                         @save="updateStudent"
                         :return-value.sync="student.phone"
          >
            {{ student.phone }}
            <template v-slot:input>
              <v-text-field
                  dense
                  solo-inverted
                  hide-details
                  v-model="student.phone"
              />
            </template>
          </v-edit-dialog>
          <template v-else>
            {{ student.phone }}
          </template>
        </td>
        <td>
          <v-edit-dialog v-if="$store.getters.isAdmin"
                         @save="updateStudent"
                         :return-value.sync="student.school"
          >
            {{ student.school.address }}
            <template v-slot:input>
              <v-select
                  dense
                  v-model="student.school"
                  :items="$store.getters.schools"
                  item-value="_id"
                  item-text="address"
              />
            </template>
          </v-edit-dialog>
          <template v-else>
            {{ student.school.address }}
          </template>
        </td>
        <td>
          <v-edit-dialog v-if="$store.getters.isAdmin"
                         @save="updateStudent"
                         :return-value.sync="student.group"
          >
            {{ studentGroup.name }}
            <template v-slot:input>
              <v-select
                  dense
                  v-model="student.group"
                  :items="$store.getters.groups"
                  item-value="_id"
                  item-text="name"
              />
            </template>
          </v-edit-dialog>
          <template v-else>
            {{ studentGroup.name }}
          </template>
        </td>
        <td>{{ student.createdAt | humanDate }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  name: "StudentInfo",
  props: {
    student: {
      type: Object,
      required: true,
    }
  },
  computed: {
    studentGroup() {
      if (this.student.group) {
        return this.$store.getters.groups.find((g) => {
          return g._id === this.student.group
        })
      }
      return {}
    }
  },
  methods: {
    updateStudent(student) {
      this.$emit('updateStudent', student)
    }
  }
}
</script>

<style scoped>

</style>
