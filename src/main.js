import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import _ from 'lodash'
import vuetify from './plugins/vuetify'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

Vue.config.productionTip = false

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(isSameOrAfter)

dayjs.tz.setDefault('Asia/Yekaterinburg')

Vue.prototype.$dayjs = dayjs
Vue.prototype.$_ = _

Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 3,
  newestOnTop: true,
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.7,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
})

Vue.filter('humanDateTime', function(date) {
  return dayjs(date).format('DD.MM.YYYY HH:mm:ss')
})

Vue.filter('humanDate', function(date) {
  return dayjs(date).format('DD.MM.YYYY')
})

Vue.filter('humanTime', function(date) {
  return dayjs(date).format('HH:mm')
})

Vue.filter('paymentType', function(type) {
  if (store.getters.paymentTypes.length > 0) {
    return store.getters.paymentTypes.find((t) => {
      return t._id === type
    }).name
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
