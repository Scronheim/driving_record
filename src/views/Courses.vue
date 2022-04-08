<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="pa-1">
            <v-tabs v-model="tab">
              <v-tabs-slider color="yellow"/>
              <v-tab>Конфигуратор</v-tab>
              <v-tab>Готовые</v-tab>
            </v-tabs>
          </v-card-title>
          <v-card-text>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-row>
                  <v-col>
                    <v-list dense>
                      <v-list-item>
                        КПП:<v-switch dense inset :label="manualTransmission ? 'Механическая': 'Автомат'"
                                      v-model="manualTransmission"/>
                      </v-list-item>
                      <v-list-item>
                        <v-slider
                            v-model="drivingCount"
                            :min="15"
                            :max="30"
                            :step="5"
                            thumb-label="always"
                            label="Количество вождений"
                            ticks
                        />
                      </v-list-item>
                      <v-list-item v-if="drivingCount === 0">
                        <v-alert type="info">
                          Только при наличии в/у. Сдача внутренних экзаменов в счёт занятий. Выход на экзамены в ГИБДД первично в счёт занятий
                        </v-alert>
                      </v-list-item>
                      <v-list-item>
                        <span class="v-label theme--dark">Цена за 1 вождение: <b>{{ oneDrivingCost }}р</b></span>
                      </v-list-item>
                      <v-list-item>
                        <v-radio-group v-model="courseInClass">
                          <v-radio label="Класс" :value="true"/>
                          <v-radio label="Онлайн" :value="false"/>
                        </v-radio-group>
                        <v-list-item-title>
                          <span class="v-label theme--dark ml-10">{{ theoryCost }}р</span>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <span class="v-label theme--dark">Дополнительное вождение: <b>{{ additionalDrivingCost }}р</b></span>
                      </v-list-item>
                      <v-list-item>
                        <v-btn light x-large block color="yellow"
                               :disabled="$store.getters.userHasCourse"
                               @click="selectCourse">
                          {{ totalCost }}р</v-btn>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col>
                    <span class="text-h5">Взнос за регистрацию в ГИБДД, подготовку пакета документа и свидетельства:</span>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-minus</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          500р при сдаче экзаменов в ГИБДД в Перми
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-minus</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          1500р при сдаче экзаменов в других городах или самостоятельно
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <span class="text-h5">Стоимость занятий для курсантов других автошкол (восстановление навыков)</span>
                    <v-simple-table dense>
                      <thead>
                        <tr>
                          <th>Занятий</th>
                          <th>Механика</th>
                          <th>Автомат</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>10-14</td>
                          <td>1000р</td>
                          <td>1100р</td>
                        </tr>
                        <tr>
                          <td>5-9</td>
                          <td>1200р</td>
                          <td>1300р</td>
                        </tr>
                        <tr>
                          <td>1-1</td>
                          <td>1400р</td>
                          <td>1500р</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col>
                    <v-btn text x-large block color="yellow">Механика</v-btn>
                    <v-card elevation="10" v-for="course in manualCourses" :key="course._id" class="ma-3">
                      <v-card-title>{{ course.name }}</v-card-title>
                      <v-card-text>
                        <v-list>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-steering</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title :class="classesForCourseTitle">{{ course.driving.classes }} вождений. {{ course.driving.cost }}р за вождение</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-domain</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-select dense hide-details outlined label="Место проведения теории" :items="theoryPlaces" v-model="courseInClass"/>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title :class="classesForCourseTitle" title="Цена за доп. вождение">Цена доп. вождения {{ course.additionalDriving }}р</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn text color="success"
                               :disabled="$store.getters.userHasCourse"
                               @click="chooseCourse(course)">Выбрать</v-btn>
                        <v-btn text color="primary"
                               v-if="$store.getters.isAdmin"
                               @click="showCourseDialog(course)"
                        >Редактировать</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-btn text x-large block color="yellow">Автомат</v-btn>
                    <v-card elevation="10" v-for="course in autoCourses" :key="course._id" class="ma-3">
                      <v-card-title>{{ course.name }}</v-card-title>
                      <v-card-text>
                        <v-list>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-steering</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title :class="classesForCourseTitle">{{ course.driving.classes }} вождений. {{ course.driving.cost }}р за вождение</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-domain</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-select dense hide-details outlined label="Место проведения теории" :items="theoryPlaces" v-model="courseInClass"/>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title :class="classesForCourseTitle" title="Цена за доп. вождение">{{ course.additionalDriving }}р</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn text color="success"
                               :disabled="$store.getters.userHasCourse"
                               @click="chooseCourse(course)">Выбрать</v-btn>
                        <v-btn text color="primary"
                               v-if="$store.getters.isAdmin"
                               @click="showCourseDialog(course)"
                        >Редактировать</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <Dialog v-model="courseEditDialog" title="Редактирование курса">
      <template #body>
        <v-text-field dense hide-details outlined label="Название курса" v-model="currentCourse.name"/>
        <v-switch dense :label="currentCourse.transmission === 'Механика' ? 'Механика': 'Автомат'"
                  true-value="Механика" false-value="Автомат" v-model="currentCourse.transmission"/>
        <v-text-field dense outlined label="Количество занятий по вождению" type="number"
                      v-model.number="currentCourse.driving.classes"/>
        <v-text-field dense outlined label="Цена за 1 вождение" type="number"
                      v-model.number="currentCourse.driving.cost" append-outer-icon="mdi-currency-rub"/>
        <v-text-field dense outlined label="Цена за доп. вождение" type="number"
                      v-model.number="currentCourse.additionalDriving" append-outer-icon="mdi-currency-rub"/>
        <v-text-field dense outlined label="Цена занятий в классе" type="number"
                      v-model.number="currentCourse.theory.class" append-outer-icon="mdi-currency-rub"/>
        <v-text-field dense outlined label="Цена занятий в онлайне" type="number"
                      v-model.number="currentCourse.theory.online" append-outer-icon="mdi-currency-rub"/>
        <v-text-field dense outlined label="Скидка на теорию" type="number"
                      v-model.number="currentCourse.theory.discount" append-outer-icon="mdi-currency-rub"/>
        <v-checkbox dense label="Нужно в/у" v-model="currentCourse.license"/>
        Мин: <v-btn text color="yellow">{{ currentCourseMinCost }}р</v-btn>
        Макс: <v-btn text color="yellow">{{ currentCourseMaxCost }}р</v-btn>
      </template>
      <template #actions>
        <v-btn text outlined color="success" @click="updateCourse">Сохранить</v-btn>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import Dialog from '@/components/Dialog'
export default {
  name: "Courses",
  components: {Dialog},
  mounted() {
    this.$store.dispatch('getCourses')
  },
  computed: {
    classesForCourseTitle() {
      return {
        'text-wrap': this.$vuetify.breakpoint.mobile,
        'text-h5': !this.$vuetify.breakpoint.mobile,
      }
    },
    currentCourseMaxCost() {
      return (this.currentCourse.driving.classes * this.currentCourse.driving.cost) + (this.currentCourse.theory.class - this.currentCourse.theory.discount)
    },
    currentCourseMinCost() {
      return (this.currentCourse.driving.classes * this.currentCourse.driving.cost) + (this.currentCourse.theory.online - this.currentCourse.theory.discount)
    },
    manualCourses() {
      return this.$store.getters.courses.filter((c) => {
        return c.transmission === 'Механика'
      })
    },
    autoCourses() {
      return this.$store.getters.courses.filter((c) => {
        return c.transmission === 'Автомат'
      })
    },
    totalCost() {
      return (this.drivingCount * this.oneDrivingCost) + this.theoryCost
    },
    oneDrivingCost() {
      if (this.manualTransmission) {
        return 900
      }
      return 1000
    },
    additionalDrivingCost() {
      if (this.drivingCount === 30 || this.drivingCount === 25) {
        if (this.manualTransmission) {
          return 900
        } else {
          return 1000
        }
      } else if (this.drivingCount === 20) {
        if (this.manualTransmission) {
          return 1000
        } else {
          return 1100
        }
      } else if (this.drivingCount === 15) {
        if (this.manualTransmission) {
          return 1000
        } else {
          return 1200
        }
      }
      return 0
    },
    theoryCost() {
      if (this.drivingCount === 30 || this.drivingCount === 15) {
        if (this.courseInClass) {
          return 3900
        } else {
          return 2500
        }
      } else if (this.drivingCount === 25 || this.drivingCount === 20) {
        if (this.courseInClass) {
          return 4900
        } else {
          return 3500
        }
      }
      return 0
    },
  },
  data: () => ({
    theoryPlaces: [
      {text: 'Класс', value: true},
      {text: 'Онлайн', value: false},
    ],
    currentCourse: {
      transmission: 'Механика',
      driving: {},
      theory: {},
    },
    courseEditDialog: false,
    tab: 0,
    courseInClass: true,
    manualTransmission: true,
    drivingCount: 15,
  }),
  methods: {
    async updateCourse() {
      await this.$store.dispatch('updateCourse', this.currentCourse)
      this.courseEditDialog = false
      this.$toast.success(`Курс обновлён`)
    },
    showCourseDialog(course) {
      Object.assign(this.currentCourse, course)
      this.courseEditDialog = true
    },
    async chooseCourse(item) {
      const theoryCost = () => {
        if (item.driving.classes === 30 || item.driving.classes === 15) {
          if (this.courseInClass) {
            return 3900
          } else {
            return 2500
          }
        } else if (item.driving.classes === 25 || item.driving.classes === 20) {
          if (this.courseInClass) {
            return 4900
          } else {
            return 3500
          }
        }
      }
      const oneDrivingCost = () => {
        if (item.transmission === 'Механика') {
          return 900
        }
        return 1000
      }
      const course = {
        transmission: item.transmission,
        driving: {
          class: item.driving.classes,
          cost: oneDrivingCost()
        },
        theory: {
          place: this.courseInClass ? 'Класс' : 'Онлайн',
          cost: theoryCost(),
          discount: 0,
        },
        additionalDrivingCost: item.additionalDrivingCost,
        cost: (item.driving.classes * item.driving.cost) + theoryCost()
      }
      this.$store.commit('setCourseToUser', course)
      await this.$store.dispatch('updateUser')
      this.$toast.success('Курс успешно выбран')
    },
    async selectCourse() {
      const existingCourse = this.$store.getters.courses.find((c) => {
        return c.minCost === this.totalCost || c.maxCost === this.totalCost
      })
      const course = {
        name: existingCourse?.name || '',
        transmission: this.manualTransmission ? 'Механика' : 'Автомат',
        cost: this.totalCost,
        driving: {
          class: this.drivingCount,
          cost: this.oneDrivingCost,
        },
        theory: {
          place: this.courseInClass ? 'Класс' : 'Онлайн',
          cost: this.theoryCost,
          discount: 0,
        },
        additionalDrivingCost: this.additionalDrivingCost
      }
      this.$store.commit('setCourseToUser', course)
      await this.$store.dispatch('updateUser')
      this.$toast.success('Курс успешно выбран')
    }
  }
}
</script>

<style scoped>

</style>
