import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import _ from 'lodash'
import vuetify from './plugins/vuetify'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

Vue.config.productionTip = false
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
  return dayjs(date).format('DD.MM.YYYY hh:mm:ss')
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
