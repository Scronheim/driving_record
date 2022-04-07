<template>
  <v-container fluid>
    <v-tabs v-model="tab" align-with-title>
      <v-tabs-slider color="yellow" />

      <v-tab>Инструктора</v-tab>
      <v-tab>Классы</v-tab>
      <v-tab>Группы</v-tab>
      <v-tab>Ученики</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card>
          <v-card-text>
            <v-btn text color="success" @click.stop="newInstructorDialog = true"
            >Добавить
            </v-btn>
            <Instructors
                @updateInstructor="updateInstructor"
                @openCarInfoDialog="openCarInfoDialog" />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <v-btn text color="success" @click.stop="newSchoolDialog = true">Добавить</v-btn>
            <Schools
                @updateSchool="updateSchool"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <v-btn text color="success" @click.stop="newGroupDialog = true">Добавить</v-btn>
            <Groups/>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <Students
              @updateStudent="updateStudent"
          />
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <Dialog
        v-model="newInstructorDialog"
        title="Добавление инструктора">
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
        <v-btn text color="success" @click="addNewInstructor">Добавить</v-btn>
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
        <v-btn text color="success" @click="saveCarInfo">Сохранить</v-btn>
      </template>
    </Dialog>
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
        <v-btn text color="success" @click="addNewSchool">Добавить</v-btn>
      </template>
    </Dialog>
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
  </v-container>
</template>

<script>
import Dialog from '@/components/Dialog'
import Instructors from '@/components/admin/Instructors'
import Schools from '@/components/admin/Schools'
import Students from '@/components/admin/Students'
import Groups from '@/components/admin/Groups'
import dayjs from 'dayjs'

export default {
  name: 'Admin',
  components: {Dialog, Instructors, Schools, Students, Groups},
  computed: {
    instructors() {
      return this.$store.getters.instructors
    },
  },
  data: () => ({
    currentInstructor: {
      car: {},
    },
    startDateMenu: false,
    newGroup: {
      name: '',
      school: '',
      start: dayjs().format('YYYY-MM-DD'),
      closed: false,
    },
    newSchool: {
      address: null,
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
    newSchoolDialog: false,
    newGroupDialog: false,
    carInfoDialog: false,
    tab: 2,
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
    async addNewGroup() {
      const payload = Object.assign({}, this.newGroup)
      payload.start = parseInt(dayjs(payload.start).format('x'))
      await this.$store.dispatch('addNewGroup', payload)
      this.newGroupDialog = false
      this.$toast.success(`Группа добавлена`)
    },
    async addNewSchool() {
      await this.$store.dispatch('addNewSchool', this.newSchool)
      this.newSchoolDialog = false
      this.$toast.success(`Класс добавлен`)
    },
    async updateInstructor(instructor) {
      await this.$store.dispatch('updateUser', instructor)
      this.$toast.success(`Инструктор обновлён`)
    },
    async updateSchool(school) {
      await this.$store.dispatch('updateSchool', school)
      this.$toast.success(`Класс обновлён`)
    },
    async updateStudent(student) {
      await this.$store.dispatch('updateUser', student)
      this.$toast.success(`Ученик обновлён`)
    },
  },
}
</script>

<style scoped></style>
