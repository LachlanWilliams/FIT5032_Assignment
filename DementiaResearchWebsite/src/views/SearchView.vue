<template>
  <div class="search-page">
    <h2>Search</h2>
    <div class="search-bar-container">
      <input 
        v-model="searchQuery" 
        placeholder="Search for research or carers" 
        class="search-bar"
      />
      <button @click="performSearch" class="search-button">Search</button>
    </div>

    <div v-if="filteredResearch.length > 0">
      <h3>Research Papers</h3>
      <ResearchCard
        v-for="researchItem in filteredResearch"
        :key="researchItem.id"
        :title="researchItem.title"
        :publisher="researchItem.publisher"
        :date="researchItem.date"
        @click="navigateToResearch(researchItem.id)"
        class="clickable-card"
      />
    </div>
    
    <div v-if="filteredCarers.length > 0">
      <h3>Carers</h3>
      <CarerCard
        v-for="carer in filteredCarers"
        :key="carer.id"
        :name="carer.name"
        :role="carer.roleDesc"
        :description="carer.description"
        @click="navigateToCarer(carer.id)"
        class="clickable-card"
      />
    </div>

    <p v-if="filteredResearch.length === 0 && filteredCarers.length === 0">No results found.</p>
  </div>
</template>


  
<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CarerCard from '@/components/CarerCard.vue';
import ResearchCard from '@/components/ResearchCard.vue';

// Router setup 
const router = useRouter();

// Firebase setup
const db = getFirestore();

// Data
const searchQuery = ref('');
const researchPapers = ref([]);
const carers = ref([]);
const filteredResearch = ref([]);
const filteredCarers = ref([]);

// Fetch research papers and carers on page load
const fetchResearchAndCarers = async () => {
  const researchSnapshot = await getDocs(collection(db, 'research'));
  researchPapers.value = researchSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const carersSnapshot = await getDocs(collection(db, 'carers'));
  carers.value = carersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  filteredResearch.value = researchPapers.value;
  filteredCarers.value = carers.value;
};

// Perform search when the search query is updated
const performSearch = () => {
  const query = searchQuery.value.toLowerCase();
  
  filteredResearch.value = researchPapers.value.filter(research =>
    research.title.toLowerCase().includes(query) ||
    research.publisher.toLowerCase().includes(query)
  );
  
  filteredCarers.value = carers.value.filter(carer =>
    carer.name.toLowerCase().includes(query) ||
    carer.roleDesc.toLowerCase().includes(query) ||
    carer.description.toLowerCase().includes(query)
  );
};

// Navigation methods
const navigateToResearch = (id) => {
  router.push({ name: 'ResearchDetails', params: { id } });
};

const navigateToCarer = (id) => {
  // Implement the navigation to carer detail page using the carer id
  router.push({ name: 'CarerDetails', params: { id } });
};

// Load data on page mount
onMounted(() => {
  fetchResearchAndCarers();
});
</script>

  
<style scoped>
.search-page {
  padding: 20px;
}

.search-bar-container {
  display: flex;
  align-items: center;
}

.search-bar {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}

.search-button {
  padding: 10px 20px;
  margin-left: 10px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}

h3 {
  margin-top: 20px;
}

.clickable-card {
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
