<script setup>
import Header from './components/Header.vue';
import { RouterLink } from 'vue-router';
import { isOnline } from '@/main'; // Adjust the path as necessary
import { computed } from 'vue';

// Computed property to display online/offline status
const onlineStatus = computed(() => (isOnline.value ? 'Online' : 'Offline'));
</script>

<template>
  <div class="app-container">
    <router-link to="/">
      <div class="buffer">
        <div class="background-image"></div>
      </div>
    </router-link>

    <div v-if="!isOnline" class="status-banner">
      You are currently offline. Some features may be unavailable.
    </div>
    <header>
      <Header />
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.buffer { 
  padding-left: 10px;
  padding-top: 10px;
}
.background-image {
  top: 0;
  left: 0;
  width: 60px; /* Adjust the width as needed */
  height: 50px; /* Adjust the height as needed */
  /*background-image: url('@/assets/logo.png'); /* Replace with your image path */
  background-size: cover; /* Ensure the image covers the area */
  background-repeat: no-repeat; /* Prevent repeating the image */
}

.app-container {
  background-repeat: no-repeat; /* Avoid repeating the image */
  background-attachment: fixed; /* Keeps the background fixed while scrolling */
  min-height: 100vh;
}

/* Styles for the status banner */
.status-banner {
  background-color: #ffcccb; /* Light red background */
  color: #d8000c; /* Dark red text */
  padding: 10px;
  text-align: center;
  font-weight: bold;
}
</style>
