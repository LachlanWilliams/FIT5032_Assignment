<script setup>
import research from "../assets/JSON/research.json";
import ResearchCard from "@/components/ResearchCard.vue";
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase setup
const db = getFirestore();
const auth = getAuth();
const router = useRouter();

// Reactive variable to store if the user is a carer
const isCarer = ref(false);

// Function to navigate to the research details page
const navigateToResearch = (title) => {
  router.push({ name: 'ResearchDetails', params: { title } });
};

// Function to check if the user is a carer
const checkIfCarer = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid)); // Fetch user data
    if (userDoc.exists() && userDoc.data().role === 'carer') {
      isCarer.value = true; // Set isCarer to true if the user's role is carer
    }
  }
};

// Call the function on component mount
onMounted(() => {
  checkIfCarer();
});
</script>

<template>
  <h1>Research Page</h1>
  <p>This is our research page</p>
  
  <!-- Conditionally render the "Submit Research" button if the user is a carer -->
  <button v-if="isCarer" @click="router.push({ name: 'SubmitResearch' })" class="submit-research-btn">
    Submit Research
  </button>

  <div>
    <ResearchCard
      v-for="researchitem in research"
      :key="researchitem.title"
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

.submit-research-btn {
  margin: 10px 0;
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-research-btn:hover {
  background-color: #45a049;
}
</style>
