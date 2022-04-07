<template>
  <v-container fluid>
    <v-tabs v-model="tab">
      <v-tabs-slider color="yellow" />

      <v-tab>Инструкторы</v-tab>
      <v-tab>Классы</v-tab>
      <v-tab>Группы</v-tab>
      <v-tab>Ученики</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Instructors/>
      </v-tab-item>
      <v-tab-item>
        <Schools/>
      </v-tab-item>
      <v-tab-item>
        <Groups/>
      </v-tab-item>
      <v-tab-item>
        <Students/>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import Instructors from '@/components/admin/Instructors'
import Schools from '@/components/admin/Schools'
import Students from '@/components/admin/Students'
import Groups from '@/components/admin/Groups'

export default {
  name: 'Admin',
  components: {Instructors, Schools, Students, Groups},
  computed: {

  },
  data: () => ({
    tab: 0,
  }),
  methods: {

  },
}
</script>

<style scoped></style>
