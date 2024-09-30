<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CarerCard from '@/components/CarerCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const db = getFirestore();
const carers = ref([]); // Reactive variable to store fetched carers

const fetchCarers = async () => {
  try {
    const carersCollection = collection(db, 'carers');
    const carerSnapshot = await getDocs(carersCollection);
    
    // Map through the documents and push the data into the reactive array
    carers.value = carerSnapshot.docs.map(doc => ({
      id: doc.id, // Store the document ID if needed
      ...doc.data() // Spread the carer data
    }));
  } catch (error) {
    console.error("Error fetching carers:", error);
  }
};

const navigateToCarer = (id) => {
  router.push({ name: 'CarerDetails', params: { id } });
};

// Fetch carers when the component is mounted
onMounted(() => {
  fetchCarers();
});
</script>

<template>
  <h1>Carers Page</h1>
  <p>Below is a list of all the carers</p>
  <div>
    <CarerCard
      v-for="carer in carers"
      :key="carer.id" 
      :name="carer.name"
      :role="carer.roleDesc"
      :description="carer.description"
      @click="navigateToCarer(carer.id)"
      class="clickable-card"
    />
  </div>
</template>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>
