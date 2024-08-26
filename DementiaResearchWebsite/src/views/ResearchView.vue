<script setup>
// No script needed for now
import research from "../assets/JSON/research.json";
import ResearchCard from "@/components/ResearchCard.vue";
</script>

<template>
  <h1>Reearch Page</h1>
  <p>This is our research page</p>
  <div>
    <ResearchCard
      v-for="researchitem in research"
      :key="researchitem.title"
      :title="researchitem.title"
      :publisher="researchitem.publisher"
      :date="researchitem.date"
      class="clickable-card"
    />
  </div>
</template>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>