<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import carers from '../assets/JSON/carers.json';

const route = useRoute();

const carer = computed(() => {
  return carers.find(c => c.name === route.params.name);
});
</script>

<template>
  <div v-if="carer">
    <h1>{{ carer.name }}</h1>
    <h2>{{ carer.role }}</h2>
    <p>{{ carer.description }}</p>
    <p>Rating: {{ carer.rating }}/5</p>
  </div>
  <div v-else>
    <p>Carer not found.</p>
  </div>
</template>
