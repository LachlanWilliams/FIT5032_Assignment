<script setup>
import Card from 'primevue/card';
import { defineProps } from 'vue';

// Define props to accept `title` and `content`
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});
</script>

<template>
    <div>
        <Card class="custom-card">
            <template #title>{{ name }}</template>
            <template #content>
                <div>
                    <p>{{ role }}</p>
                    <span>{{ description }}</span>
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
</style>