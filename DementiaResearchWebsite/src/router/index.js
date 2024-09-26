import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResearchView from '../views/ResearchView.vue';
import LoginView from '../views/LoginView.vue';
import GetInvolvedView from '@/views/GetInvolvedView.vue';
import CarersView from '@/views/CarersView.vue';
import SearchView from '@/views/SearchView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';

import { isAuthenticated, role } from '@/main';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
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
  {
    path: '/carer/:name',
    name: 'CarerDetails',
    component: () => import('@/views/CarerDetails.vue'),
    props: true
  },
  {
    path: '/research/:title',
    name: 'ResearchDetails',
    component: () => import('@/views/ResearchDetails.vue'),
    props: true
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAdmin: true } // Admin only route
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // Check if the user is authenticated
  if (!isAuthenticated.value && to.name !== 'login') {
    // Redirect to login if not authenticated and trying to access a protected route
    next({ name: 'login' });
  } 
  // Check if the route requires admin privileges
  else if (to.meta.requiresAdmin && role.value !== 'admin') {
    // Redirect to home or some other page if the user is not an admin
    next({ name: 'Home' });
  } 
  // If authenticated and authorized, proceed
  else {
    next();
  }
});

export default router;
