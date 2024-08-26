<script setup>
import Card from 'primevue/card';
import { defineProps } from 'vue';

// Define props to accept `title` and `content`
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});
</script>

<template>
    <div class="card-container">
        <Card class="custom-card">
            <template #title>{{ title }}</template>
            <template #content>
                <div>
                    <p>Publisher: {{ publisher }}</p>
                    <span>Date: {{ date }}</span>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.custom-card {
  background-color: #f5f5f5;
  color: black;

}
.card-container {
  padding-bottom: 1rem; /* Adjust padding as needed */
}
</style>