<template>
  <v-container fluid>
    <v-row v-for="(chunk, chunkIndex) in chunkedBuildings" :key="`chunk-${chunkIndex}`">
      <v-col v-for="(building, buildingIndex) in chunk" :key="`building-${buildingIndex}`">
        <v-card>
          <v-card-title>{{ building.address }}</v-card-title>
          <v-card-text>
            Количество учащихся:
            <v-btn text color="primary">{{ building.students }}</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Buildings',
  computed: {
    chunkedBuildings() {
      return this.$_.chunk(this.buildings, 3)
    }
  },
  data: () => ({
    buildings: [
      {
        address: 'Куйбышева 82',
        phone: '+79028320082',
        students: 98,
      },
      {
        address: 'Калинина 34',
        phone: '+79028320082',
        students: 75,
      },
      {
        address: 'с. Лобаново',
        phone: '+79028320082',
        students: 77,
      },
      {
        address: 'Пушкина 9',
        phone: '+79028320082',
        students: 103,
      },
      {
        address: 'Мильчакова 19',
        phone: '+79028320082',
        students: 18,
      },
      {
        address: 'Уральская 95',
        phone: '+79028320082',
        students: 53,
      },
      {
        address: 'м. Рыбалко 35',
        phone: '+79028320082',
        students: 0,
      },
      {
        address: 'Приоритет',
        phone: '+79028320082',
        students: 30,
      },
      {
        address: 'п. Новые Ляды',
        phone: '+79028320082',
        students: 27,
      },
      {
        address: 'Ким 77',
        phone: '+79028320082',
        students: 25,
      },
      {
        address: 'п. Ферма',
        phone: '+79028320082',
        students: 6,
      },
    ],
  }),
}
</script>
