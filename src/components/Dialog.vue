<template>
  <v-dialog v-model="show" :width="width" :fullscreen="$vuetify.breakpoint.mobile">
    <v-card :color="color">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot name="body"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text outlined color="error" @click.stop="show = false">Закрыть</v-btn>
        <slot name="actions"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '40%'
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#363636'
    }
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
