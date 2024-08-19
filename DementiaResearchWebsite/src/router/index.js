import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import { ref } from 'vue'


export const isAuthenticated = ref(false); 

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    beforeEnter: (to, from, next) => {
      // Perform logic before entering the About route
      if (isAuthenticated.value) {
        next();
      } else {
        next({ name: 'login' }); // Redirect to the login page
      }
    }
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Perform logic before every route change
  if (!isAuthenticated && to.name !== 'login') {
    // For example, redirect to home if trying to access any other route
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
