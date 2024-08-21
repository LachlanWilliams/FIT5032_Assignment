<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import carers from '../assets/JSON/carers.json';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

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
    <Rating v-model="carer.rating" readonly/>
    <p>Leave a review</p>
    <Button label="Submit review" severity="Primary" outlined />
  </div>
  <div v-else>
    <p>Carer not found.</p>
  </div>
</template>
