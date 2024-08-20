import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResearchView from '../views/ResearchView.vue'
import LoginView from '../views/LoginView.vue'
import GetInvolvedView from '@/views/GetInvolvedView.vue'
import CarersView from '@/views/CarersView.vue'
import SearchView from '@/views/SearchView.vue'
import { ref, reactive } from 'vue'

import { isAuthenticated } from '@/main'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/research',
    name: 'Research',
    component: ResearchView
  },  
  {
    path: '/getinvolved',
    name: 'Get Involved',
    component: GetInvolvedView
  },
  {
    path: '/carers',
    name: 'Carers',
    component: CarersView
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Perform logic before every route change
  if (!isAuthenticated.value && to.name !== 'login') {
    // For example, redirect to home if trying to access any other route
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
