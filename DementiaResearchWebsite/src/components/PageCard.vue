<script setup>
import Card from 'primevue/card';
import { defineProps } from 'vue';

// Define props to accept `title` and `content`
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});
</script>

<template>
    <div class="full-page">
        <Card class="custom-card">
            <template #title>{{ title }}</template>
            <template #content>{{ content }}
            </template>
        </Card>
    </div>
</template>

<style scoped>
.custom-card {
  background-color: #f5f5f5;
  color: black;
}
.full-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
}

</style>