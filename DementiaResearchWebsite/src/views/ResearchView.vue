<script setup>
// No script needed for now
import research from "../assets/JSON/research.json";
import ResearchCard from "@/components/ResearchCard.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToResearch = (title) => {
  router.push({ name: 'ResearchDetails', params: { title } });
};

</script>

<template>
  <h1>Rearch Page</h1>
  <p>This is our research page</p>
  <div>
    <ResearchCard
      v-for="researchitem in research"
      :key="researchitem.titles"
      :title="researchitem.title"
      :publisher="researchitem.publisher"
      :date="researchitem.date"
      @click="navigateToResearch(researchitem.title)"
      class="clickable-card"
    />
  </div>
</template>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>