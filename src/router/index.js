import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "Main" */ '../views/Main')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '../views/Profile')
  },
  {
    path: '/schools',
    name: 'Schools',
    component: () => import(/* webpackChunkName: "Schools" */ '../views/schools/Schools')
  },
  {
    path: '/schools/:id',
    name: 'School page',
    component: () => import(/* webpackChunkName: "School profile" */ '../views/schools/SchoolProfile')
  },
  {
    path: '/instructors',
    name: 'Instructors',
    component: () => import(/* webpackChunkName: "Instructors" */ '../views/instructors/Instructors')
  },
  {
    path: '/instructors/:id',
    name: 'Instructor profile',
    component: () => import(/* webpackChunkName: "Instructor profile" */ '../views/instructors/InstructorProfile')
  },
  {
    path: '/groups/:id',
    name: 'Group page',
    component: () => import(/* webpackChunkName: "Group page" */ '../views/schools/Group')
  },
  {
    path: '/student/:id',
    name: 'Student page',
    component: () => import(/* webpackChunkName: "Student page" */ '../views/students/StudentProfile')
  },
  {
    path: '/events/:id',
    name: 'Event page',
    component: () => import(/* webpackChunkName: "Event page" */ '../views/events/EventProfile')
  },
  {
    path: '/admin',
    name: 'Admin page',
    component: () => import(/* webpackChunkName: "Admin page" */ '../views/Admin')
  },
  {
    path: '/courses',
    name: 'courses page',
    component: () => import(/* webpackChunkName: "courses page" */ '../views/Courses')
  },
]

const router = new VueRouter({
  routes
})

export default router
