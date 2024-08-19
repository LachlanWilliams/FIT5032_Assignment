<script setup>
//import JSONLab from './components/JSONLab.vue'
import Header from './components/Header.vue'
//import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
</script>

<template>
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
</style>
