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
    component: () => import('../views/Main')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import('../views/Profile')
  },
  {
    path: '/schools',
    name: 'Schools',
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
    },
    component: () => import('../views/schools/Schools')
  },
  {
    path: '/schools/:id',
    name: 'School page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import('../views/schools/SchoolProfile')
  },
  {
    path: '/instructors',
    name: 'Instructors',
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
    },
    component: () => import('../views/instructors/Instructors')
  },
  {
    path: '/instructor/:id',
    name: 'Instructor profile',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    component: () => import('../views/instructors/InstructorProfile')
  },
  {
    path: '/groups/:id',
    name: 'Group page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import('../views/schools/Group')
  },
  {
    path: '/student/:id',
    name: 'Student page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import('../views/students/StudentProfile')
  },
  {
    path: '/events/:id',
    name: 'Event page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import('../views/events/EventProfile')
  },
  {
    path: '/admin',
    name: 'Admin page',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    component: () => import('../views/Admin')
  },
  {
    path: '/courses',
    name: 'courses page',
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    component: () => import('../views/Courses')
  },
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next()
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLogin) {
      return next()
    }
    return next('/')
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      return next()
    }
    return next('/')
  } else {
    return next()
  }
})
export default router
