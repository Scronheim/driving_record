<template>
  <v-card color="#363636">
    <v-card-text>
      <v-row>
        <v-col cols="1">
          <v-btn text outlined color="success" @click.stop="newInstructorDialog = true">Добавить</v-btn>
        </v-col>
        <v-col cols="2">
          <v-checkbox dense label="Показать всех" v-model="showAllInstructors"/>
        </v-col>
      </v-row>
      <v-data-table style="background-color: #363636"
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

      <Dialog v-model="newInstructorDialog" title="Добавление инструктора">
        <template v-slot:body>
          <v-subheader class="px-0">Информация об инструкторе</v-subheader>
          <v-text-field
              dense
              outlined
              hide-details
              label="ФИО"
              class="ma-2"
              v-model="newInstructor.name" />
          <v-text-field
              dense
              outlined
              hide-details
              label="Email (логин)"
              autocomplete="new-password"
              class="ma-2"
              v-model="newInstructor.email" />
          <v-text-field
              dense
              outlined
              hide-details
              type="password"
              autocomplete="new-password"
              label="Пароль"
              class="ma-2"
              v-model="newInstructor.password" />
          <v-text-field
              dense
              outlined
              hide-details
              label="Телефон"
              class="ma-2"
              v-model="newInstructor.phone" />
          <v-subheader class="px-0">Информация об автомобиле</v-subheader>
          <v-text-field
              dense
              outlined
              hide-details
              label="Модель"
              class="ma-2"
              v-model="newInstructor.car.model" />
          <v-text-field
              dense
              outlined
              hide-details
              label="Гос. номер"
              class="ma-2"
              v-model="newInstructor.car.lpn" />
          <v-text-field
              dense
              outlined
              hide-details
              label="Цвет"
              class="ma-2"
              v-model="newInstructor.car.color" />
          <v-select
              dense
              outlined
              hide-details
              label="Тип коробки передач"
              class="ma-2"
              v-model="newInstructor.car.transmission"
              :items="['Ручная', 'Автомат']" />
          <v-file-input
              dense
              outlined
              hide-details
              label="Фото автомобиля"
              accept="image/*"
              class="ma-2"
              v-model="newInstructor.car.photo" />
          <v-subheader class="px-0">Выберите класс</v-subheader>
          <v-select
              dense
              outlined
              hide-details
              class="ma-2"
              v-model="newInstructor.school"
              :items="$store.getters.schools"
              item-value="_id"
              item-text="address" />
        </template>
        <template v-slot:actions>
          <v-btn text outlined color="success" @click="addNewInstructor">Добавить</v-btn>
        </template>
      </Dialog>
      <Dialog v-model="carInfoDialog" title="Сведения об автомобиле">
        <template v-slot:body>
          <v-text-field
              dense
              outlined
              hide-details
              label="Модель"
              class="ma-2"
              v-model="currentInstructor.car.model" />
          <v-text-field
              dense
              outlined
              hide-details
              label="Гос. номер"
              class="ma-2"
              v-model="currentInstructor.car.lpn" />
          <v-text-field
              dense
              outlined
              hide-details
              label="Цвет"
              class="ma-2"
              v-model="currentInstructor.car.color" />
          <v-select
              dense
              outlined
              hide-details
              label="Тип коробки передач"
              class="ma-2"
              v-model="currentInstructor.car.transmission"
              :items="['Ручная', 'Автомат']" />
        </template>
        <template v-slot:actions>
          <v-btn text outlined color="success" @click="saveCarInfo">Сохранить</v-btn>
        </template>
      </Dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import Dialog from '@/components/Dialog'
export default {
  name: "Instructors",
  components: {Dialog},
  computed: {
    instructors() {
      return this.$store.getters.instructors.filter((i) => {
        if (this.showAllInstructors) {
          return i
        }
        return !i.disabled
      })
    },
  },
  data: () => ({
    showAllInstructors: false,
    currentInstructor: {
      car: {},
    },
    newInstructor: {
      name: null,
      password: null,
      email: null,
      phone: null,
      car: {
        model: null,
        lpn: null,
        color: null,
        transmission: 'Ручная',
        photo: null,
      },
      school: null,
      disabled: false,
      role: '622062c2056fad1a42ab2cf0',
    },
    newInstructorDialog: false,
    carInfoDialog: false,
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
    saveCarInfo() {
      this.updateInstructor(this.currentInstructor)
      this.carInfoDialog = false
    },
    openCarInfoDialog(instructor) {
      this.currentInstructor = instructor
      this.carInfoDialog = true
    },
    async addNewInstructor() {
      if (this.newInstructor.car.photo) {
        const formData = new FormData()
        formData.append('photo', this.newInstructor.car.photo)
        const {data} = await this.$store.dispatch('uploadPhoto', formData)
        this.newInstructor.car.photo = data.data.photo
      }
      await this.$store.dispatch('addNewInstructor', this.newInstructor)
      this.$toast.success(`Инструктор добавлен`)
    },
    async updateInstructor(instructor) {
      await this.$store.dispatch('updateUser', instructor)
      this.$toast.success(`Инструктор обновлён`)
    },
  }
}
</script>

<style scoped>

</style>
