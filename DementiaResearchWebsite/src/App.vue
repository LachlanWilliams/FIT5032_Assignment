<script setup>
import Header from './components/Header.vue'
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <router-link to="/">
      <div class="buffer">
        <div class="background-image"></div>
      </div>
    </router-link>

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
  /* position: absolute; Position relative to the nearest positioned ancestor */
  top: 0;
  left: 0;
  width: 60px; /* Adjust the width as needed */
  height: 50px; /* Adjust the height as needed */
  /*background-image: url('@/assets/logo.png'); /* Replace with your image path */
  background-size: cover; /* Ensure the image covers the area */
  background-repeat: no-repeat; /* Prevent repeating the image */
}

.app-container {
  /* Set the background image */
  /*background-image: url('@/assets/Clouds.png');
  background-size: 300px; /* Ensure the image covers the entire container */
  /* background-position: center; Center the background image */
  background-repeat: no-repeat; /* Avoid repeating the image */
  background-attachment: fixed; /* Keeps the background fixed while scrolling */
  
  /* Take the full height of the viewport */
  min-height: 100vh;
}
</style>
