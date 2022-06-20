<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-content>
        <v-btn text small color="#FFE4B5" @click="updateCurrentEvent('noRecord')">Нет записи</v-btn>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-btn text small color="success" @click="updateCurrentEvent('free')">Свободно</v-btn>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-btn text small color="error" @click="updateCurrentEvent('busy')">Занято</v-btn>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-btn text small color="#F4A460" @click="updateCurrentEvent('absence')">Неявка</v-btn>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-btn text small color="#008CFF" @click="updateCurrentEvent('exam')">Экзамен</v-btn>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-btn text small color="#B88527" @click="updateCurrentEvent('innerExam')">Внутренний экзамен</v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "Statuses",
  props: {
    readonly: {
      type: Boolean,
      default: true,
    },
    currentEvent: {
      type: Object,
    }
  },
  methods: {
    updateCurrentEvent(eventType) {
      if (this.readonly) return
      let type
      switch (eventType) {
        case 'noRecord':
          type = {
            _id: '6221d6063962a189d7ade047',
            name: 'Нет записи',
            color: '#FFE4B5'
          }
          break
        case 'free':
          type = {
            _id: '6221d6183962a189d7ade048',
            name: 'Свободно',
            color: 'success'
          }
          break
        case 'busy':
          type = {
            _id: '6221d6203962a189d7ade049',
            name: 'Занято',
            color: 'error'
          }
          break
        case 'absence':
          type = {
            _id: '6221d6263962a189d7ade04a',
            name: 'Неявка',
            color: '#F4A460'
          }
          break
        case 'exam':
          type = {
            _id: '6221d62e3962a189d7ade04b',
            name: 'Экзамен',
            color: '#008CFF'
          }
          break
        case 'innerExam':
          type = {
            _id: '6221d6393962a189d7ade04c',
            name: 'Внутренний экзамен',
            color: '#B88527'
          }
          break
      }
      this.currentEvent.isNewEvent = true
      this.currentEvent.type = type
      this.$store.dispatch('updateEvent', this.currentEvent)
      this.$toast.success('Тип обновлён')
    }
  }
}
</script>

<style scoped>

</style>
