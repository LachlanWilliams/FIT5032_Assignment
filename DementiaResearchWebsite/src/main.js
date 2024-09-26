import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css' // Import your custom stylesheet

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ref } from 'vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Firebase imports
import { initializeApp } from "firebase/app";

// Firebase configuration (you should store these in your .env file)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "dementiaresearchwebsite.firebaseapp.com",
    projectId: "dementiaresearchwebsite",
    storageBucket: "dementiaresearchwebsite.appspot.com",
    messagingSenderId: "317100823817",
    appId: "1:317100823817:web:6890326690760ca301efd8"
  };

// Initialize Firebase app (this must happen before using Firebase services)
initializeApp(firebaseConfig);

export const isAuthenticated = ref(false); 
export const name = ref('');
export const role = ref('user');

const app = createApp(App)
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});
app.use(router)

app.mount('#app')
