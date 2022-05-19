import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Main" */ '../views/Main')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Profile" */ '../views/Profile')
  },
  {
    path: '/schools',
    name: 'Schools',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Schools" */ '../views/schools/Schools')
  },
  {
    path: '/schools/:id',
    name: 'School page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "School profile" */ '../views/schools/SchoolProfile')
  },
  {
    path: '/instructors',
    name: 'Instructors',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Instructors" */ '../views/instructors/Instructors')
  },
  {
    path: '/instructors/:id',
    name: 'Instructor profile',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Instructor profile" */ '../views/instructors/InstructorProfile')
  },
  {
    path: '/groups/:id',
    name: 'Group page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Group page" */ '../views/schools/Group')
  },
  {
    path: '/student/:id',
    name: 'Student page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Student page" */ '../views/students/StudentProfile')
  },
  {
    path: '/events/:id',
    name: 'Event page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "Event page" */ '../views/events/EventProfile')
  },
  {
    path: '/admin',
    name: 'Admin page',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    component: () => import(/* webpackChunkName: "Admin page" */ '../views/Admin')
  },
  {
    path: '/courses',
    name: 'courses page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import(/* webpackChunkName: "courses page" */ '../views/Courses')
  },
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLogin) {
      next()
      return
    }
    next('/')
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next()
      return
    }
    next('/')
  }
  else {
    next()
  }
})
export default router
