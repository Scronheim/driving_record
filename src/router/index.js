import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "Main" */ '../views/Main.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '../views/Profile.vue')
  },
  {
    path: '/schools',
    name: 'Schools',
    component: () => import(/* webpackChunkName: "Schools" */ '../views/Schools.vue')
  },
  {
    path: '/instructors',
    name: 'Instructors',
    component: () => import(/* webpackChunkName: "Instructors" */ '../views/Instructors.vue')
  },
  {
    path: '/instructors/:id',
    name: 'Instructor profile',
    component: () => import(/* webpackChunkName: "Instructor profile" */ '../views/InstructorProfile.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
