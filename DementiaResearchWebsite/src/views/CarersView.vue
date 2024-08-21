<script setup>
import carers from '../assets/JSON/carers.json'
import CarerCard from '@/components/CarerCard.vue';
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
      />
    </div>
    <div>
    </div>
</template>
  
  <style>
  </style>