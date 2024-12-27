import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/components/Login.vue'; // Correct import path for Login component
import UserRegister from '@/components/Register.vue'; // Correct import path for Register component
import UserDashboard from '@/components/Dashboard.vue'; // Correct import path for Dashboard component

// Create the router instance and pass in the routes
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Default base URL
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: UserLogin // The component for login page
    },
    {
      path: '/register',
      name: 'Register',
      component: UserRegister // The component for registration page
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: UserDashboard // The component for the dashboard page
    },
    {
      path: '/',
      redirect: '/login', // Default route, redirects to the login page
    },
  ]
});

export default router;
