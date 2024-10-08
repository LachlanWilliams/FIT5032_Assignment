<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase setup
const db = getFirestore();
const auth = getAuth();
const router = useRouter();

// Reactive variables
const isCarer = ref(false);
const researchPapers = ref([]); // Research papers data
const searchQuery = ref(""); // Search query for all columns
const currentPage = ref(1); // Pagination: Current page
const rowsPerPage = 10; // Pagination: Rows per page
const sortColumn = ref(""); // Column to sort by
const sortOrder = ref("asc"); // Sort order ('asc' or 'desc')

// Function to check if the user is a carer
const checkIfCarer = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid)); // Fetch user data
    if (userDoc.exists() && userDoc.data().role === 'carer') {
      isCarer.value = true;
    }
  }
};

// Function to fetch research papers that are approved
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

// Sorting function
const sortTable = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortOrder.value = "asc";
  }
};

// Computed property to handle sorting and pagination
const sortedAndPaginatedPapers = computed(() => {
  let filteredPapers = researchPapers.value;

  // Search filter
  if (searchQuery.value) {
    const lowerSearchQuery = searchQuery.value.toLowerCase();
    filteredPapers = filteredPapers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(lowerSearchQuery) ||
        paper.publisher.toLowerCase().includes(lowerSearchQuery) ||
        paper.date.toLowerCase().includes(lowerSearchQuery)
    );
  }

  // Sorting
  if (sortColumn.value) {
    filteredPapers.sort((a, b) => {
      const valueA = a[sortColumn.value];
      const valueB = b[sortColumn.value];
      if (sortOrder.value === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  // Pagination
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return filteredPapers.slice(start, end);
});

// Function to navigate to research details
const navigateToResearch = (id) => {
  router.push({ name: 'ResearchDetails', params: { id } });
};

// Call the functions on component mount
onMounted(() => {
  checkIfCarer();
  fetchResearchPapers(); // Fetch research papers when the component is mounted
});
</script>


<template>
  <h1>Research Page</h1>
  <p>This is our research page!</p>
  <p>Search for a paper or sort by title publisher or date.</p>
  <p>Click on a row to view the whole paper</p>

  <!-- Conditionally render the "Submit Research" button if the user is a carer -->
  <button v-if="isCarer" @click="router.push({ name: 'SubmitResearch' })" class="submit-research-btn">
    Submit Research
  </button>

  <!-- Search input -->
  <div>
    <input type="text" v-model="searchQuery" placeholder="Search research papers" class="search-input" />
  </div>

  <!-- Table -->
  <table class="research-table">
    <thead>
      <tr>
        <th @click="sortTable('title')">Title</th>
        <th @click="sortTable('publisher')">Publisher</th>
        <th @click="sortTable('date')">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="researchItem in sortedAndPaginatedPapers" :key="researchItem.id" @click="navigateToResearch(researchItem.id)" class="clickable-row">
        <td>{{ researchItem.title }}</td>
        <td>{{ researchItem.publisher }}</td>
        <td>{{ researchItem.date }}</td>
      </tr>
    </tbody>
  </table>

  <!-- Pagination Controls -->
  <div class="pagination">
    <button @click="currentPage--" :disabled="currentPage === 1">Previous</button>
    <span>Page {{ currentPage }} of {{ Math.ceil(researchPapers.length / rowsPerPage) }}</span>
    <button @click="currentPage++" :disabled="currentPage >= Math.ceil(researchPapers.length / rowsPerPage)">Next</button>
  </div>
</template>


<style scoped>
.clickable-row {
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

.research-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white; /* Set table background to white */
}

.research-table th, .research-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  cursor: pointer;
  background-color: white; /* Set table header and cells background to white */
}

.research-table th {
  background-color: #f4f4f4; /* Light gray background for headers */
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.search-input {
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}
</style>

