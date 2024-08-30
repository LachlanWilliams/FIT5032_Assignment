<script setup>
//import JSONLab from './components/JSONLab.vue'
import Header from './components/Header.vue'
//import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
import { RouterLink } from 'vue-router';
</script>

<template>
  <router-link to="/">
          <!-- <img src="@/assets/clouds.png" alt="Logo" class="logo-img" /> -->
    <div class="background-image"></div>

   </router-link>

  <header>
    <Header />
  </header>

  <main>
    <!-- <LibraryRegistrationForm /> -->
    <!-- <JSONLab /> -->
     <router-view></router-view>
  </main>
</template>

<style scoped>
.background-image {
  position: absolute; /* Position relative to the nearest positioned ancestor */
  top: 0;
  left: 0;
  width: 200px; /* Adjust the width as needed */
  height: 100px; /* Adjust the height as needed */
  background-image: url('@/assets/Clouds.png'); /* Replace with your image path */
  background-size: cover; /* Ensure the image covers the area */
  background-repeat: no-repeat; /* Prevent repeating the image */
}
</style>
