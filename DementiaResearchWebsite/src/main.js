import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ref } from 'vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

export const isAuthenticated = ref(true); 
export const role = ref('');

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
