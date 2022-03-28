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
                  <v-col cols="4">
                    <v-list dense>
                      <v-list-item>
                        <v-switch dense inset :label="manualTransmission ? 'Механическая': 'Автомат'"
                                  v-model="manualTransmission"/>
                      </v-list-item>
                      <v-list-item>
                        <v-slider
                            v-model="drivingCount"
                            :max="3"
                            label="Количество вождений"
                            :tick-labels="labels"
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
                          500р при сдаче экзамено в ГИБДД в Перми
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
                    <span class="text-h5">Стоимость занятий для курсантов других автошкол (восстановлене навыков)</span>
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
                    <v-card v-for="course in manualCourses" :key="course._id" class="ma-3">
                      <v-card-title>{{ course.name }}</v-card-title>
                      <v-card-text>
                        <v-list dense>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-steering</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.driving.classes }} вождений. {{ course.driving.cost }}р за вождение</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-human-male-board</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.theory.class }}р</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-laptop</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.theory.online }}р</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.additionalDriving }}р</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card v-for="course in autoCourses" :key="course._id" class="ma-3">
                      <v-card-title>{{ course.name }}</v-card-title>
                      <v-card-text>
                        <v-list dense>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-steering</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.driving.classes }} вождений. {{ course.driving.cost }}р за вождение</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-human-male-board</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.theory.class }}р</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-laptop</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.theory.online }}р</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon>mdi-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ course.additionalDriving }}р</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Courses",
  mounted() {
    this.$store.dispatch('getCourses')
  },
  computed: {
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
      return (this.labels[this.drivingCount] * this.oneDrivingCost) + this.theoryCost
    },
    oneDrivingCost() {
      if (this.manualTransmission) {
        return 900
      }
      return 1000
    },
    additionalDrivingCost() {
      if (this.drivingCount === 3 || this.drivingCount === 2) {
        if (this.manualTransmission) {
          return 900
        } else {
          return 1000
        }
      } else if (this.drivingCount === 1) {
        if (this.manualTransmission) {
          return 1000
        } else {
          return 1100
        }
      } else if (this.drivingCount === 0) {
        if (this.manualTransmission) {
          return 1000
        } else {
          return 1200
        }
      }
      return 0
    },
    theoryCost() {
      if (this.drivingCount === 3 || this.drivingCount === 0) {
        if (this.courseInClass) {
          return 3900
        } else {
          return 2500
        }
      } else if (this.drivingCount === 2 || this.drivingCount === 1) {
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
    tab: 0,
    courseInClass: true,
    manualTransmission: true,
    drivingCount: 3,
    labels: [15, 20, 25, 30],
  }),
  methods: {
    async selectCourse() {
      const course = this.$store.getters.courses.find((c) => {
        return (c.maxCost === this.totalCost) || (c.minCost === this.totalCost)
      })
      if (course) {
        this.$store.commit('setCourseToUser', course._id)
        await this.$store.dispatch('updateUser')
        this.$toast.success('Курс успешно выбран')
      }
    }
  }
}
</script>

<style scoped>

</style>
