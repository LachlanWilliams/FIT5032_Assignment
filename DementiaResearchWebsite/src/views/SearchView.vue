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

    <!-- Only display if searchQuery is not empty -->
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
    
    <!-- Only display if searchQuery is not empty -->
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

    <!-- Show no results found if there is a search query but no results -->
    <p v-if="hasPerformedSearch && filteredResearch.length === 0 && filteredCarers.length === 0">
      No results found.
    </p>

    <!-- ChatGPT Section - Visible only to carers or admins -->
    <div v-if="role === 'carer' || role === 'admin'" class="chat-section">
      <h3>Ask ChatGPT</h3>
      <div class="chat-container">
        <input 
          v-model="chatQuestion" 
          placeholder="Ask ChatGPT a question" 
          class="chat-input"
        />
        <button @click="askChatGPT" class="chat-button">Ask</button>
      </div>
      <p v-if="chatResponse">Response: {{ chatResponse }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import OpenAI from 'openai';
import CarerCard from '@/components/CarerCard.vue';
import ResearchCard from '@/components/ResearchCard.vue';
import { role } from '@/main';  // Import role from main.js

// Router setup 
const router = useRouter();

// Firebase setup
const db = getFirestore();

// OpenAi setup 
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Data
const searchQuery = ref('');
const researchPapers = ref([]);
const carers = ref([]);
const filteredResearch = ref([]);
const filteredCarers = ref([]);
const chatQuestion = ref('');  // State for ChatGPT question
const chatResponse = ref('');  // State for ChatGPT response
const hasPerformedSearch = ref(false);

// Fetch research papers and carers on page load
const fetchResearchAndCarers = async () => {
  // Fetch research papers
  const researchSnapshot = await getDocs(collection(db, 'research'));
  researchPapers.value = researchSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Fetch carers
  const carersSnapshot = await getDocs(collection(db, 'carers'));
  carers.value = carersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Perform search when the search query is updated
const performSearch = () => {
  hasPerformedSearch.value = true;
  const query = searchQuery.value.toLowerCase();

  // Filter research papers by search query and status 'approved'
  filteredResearch.value = researchPapers.value
    .filter(research =>
      research.status === 'approved' && (
        research.title.toLowerCase().includes(query) ||
        research.publisher.toLowerCase().includes(query) || 
        research.precontent.toLowerCase().includes(query)
      )
    );

  // Filter carers by search query
  filteredCarers.value = carers.value
    .filter(carer =>
      carer.name.toLowerCase().includes(query) ||
      carer.roleDesc.toLowerCase().includes(query) ||
      carer.description.toLowerCase().includes(query)
    );
};

// Method to ask ChatGPT
const askChatGPT = async () => {
  if (!chatQuestion.value) {
    chatResponse.value = "Please enter a question.";
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {"role": "user", "content": chatQuestion.value}
        ]
    });
    chatResponse.value = completion.choices[0].message.content

  } catch (error) {
    chatResponse.value = "Error occurred while communicating with ChatGPT.";
    console.error(error);
  }
};

// Navigation methods
const navigateToResearch = (id) => {
  router.push({ name: 'ResearchDetails', params: { id } });
};

const navigateToCarer = (id) => {
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

/* ChatGPT section styles */
.chat-section {
  margin-top: 30px;
}

.chat-container {
  display: flex;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
}

.chat-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.chat-button:hover {
  background-color: #45a049;
}
</style>
