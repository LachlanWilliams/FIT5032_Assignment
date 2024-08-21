<script setup>
import carers from '../assets/JSON/carers.json';
import CarerCard from '@/components/CarerCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToCarer = (name) => {
  router.push({ name: 'CarerDetails', params: { name } });
};
</script>

<template>
  <h1>Carers Page</h1>
  <p>Below is a list of all the carers</p>
  <div>
    <CarerCard
      v-for="carer in carers"
      :key="carer.name"
      :name="carer.name"
      :role="carer.role"
      :description="carer.description"
      @click="navigateToCarer(carer.name)"
      class="clickable-card"
    />
  </div>
</template>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>