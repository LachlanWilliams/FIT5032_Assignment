<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import  DataTable from 'primevue/datatable';
import  Column from 'primevue/column';

// Firebase setup
const db = getFirestore();
const auth = getAuth();
const router = useRouter();

// Reactive variable to store if the user is a carer
const isCarer = ref(false);

// Reactive variable to store research papers
const researchPapers = ref([]);

// Reactive variable for search filters
const filters = ref({
  title: '',
  publisher: '',
  date: ''
});

// Reactive variable for pagination
const first = ref(0); // starting point of data
const rows = ref(10); // number of rows per page

// Function to navigate to the research details page
const navigateToResearch = (id) => {
  router.push({ name: 'ResearchDetails', params: { id } });
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

// Function to fetch research papers that are under review from Firestore
const fetchResearchPapers = async () => {
  const researchQuery = query(
    collection(db, 'research'), 
    where('status', '==', "approved")
  );
  
  const querySnapshot = await getDocs(researchQuery);
  researchPapers.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Call the functions on component mount
onMounted(() => {
  checkIfCarer();
  fetchResearchPapers(); // Fetch research papers when the component is mounted
});
</script>

<template>
  <h1>Research Page</h1>
  <p>This is our research page</p>
  
  <!-- Conditionally render the "Submit Research" button if the user is a carer -->
  <button v-if="isCarer" @click="router.push({ name: 'SubmitResearch' })" class="submit-research-btn">
    Submit Research
  </button>

  <!-- PrimeVue DataTable with sorting, searching, and pagination -->
  <DataTable
    :value="researchPapers"
    paginator
    :rows="rows"
    :first="first"
    :totalRecords="researchPapers.length"
    :filters="filters"
    @page="first = $event.first"
    class="research-table"
    responsiveLayout="scroll"
  >
    <!-- Searchable column for title -->
    <Column 
      field="title" 
      header="Title" 
      :filter="true" 
      filterPlaceholder="Search by title" 
      :filterValue="filters.title" 
      @filter="filters.title = $event.value"
      sortable 
    />

    <!-- Searchable column for publisher -->
    <Column 
      field="publisher" 
      header="Publisher" 
      :filter="true" 
      filterPlaceholder="Search by publisher" 
      :filterValue="filters.publisher" 
      @filter="filters.publisher = $event.value"
      sortable 
    />

    <!-- Sortable column for date -->
    <Column 
      field="date" 
      header="Date" 
      sortable
    />

    <!-- Action column to navigate to research details -->
    <!-- <Column 
      header="Actions" 
      :body="(_, options) => (
        <button @click='navigateToResearch(options.data.id)'>View</button>
      )" 
    /> -->
  </DataTable>
</template>

<style scoped>
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

.research-table {
  color: white;
  background-color: white;
  margin-top: 20px;
  width: 100%;
}
</style>
