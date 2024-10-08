<template>
  <div class="admin-dashboard">
    <nav class="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li @click="setActive('users')">Manage Users</li>
        <li @click="setActive('research')">Review Research</li>
        <li @click="setActive('settings')">Settings</li>
      </ul>
    </nav>

    <div class="main-content">
      <!-- Manage Users Tab -->
      <div v-if="activeTab === 'users'">
        <h3>Manage Users</h3>
        <p>Here you can view, add, or remove users from the system.</p>

        <h4>Carer Requests</h4>
        <table v-if="pendingRequests.length > 0" class="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in pendingRequests" :key="request.id">
              <td>{{ request.email }}</td>
              <td>{{ request.requestDate.toDate().toLocaleString() }}</td>
              <td>{{ request.status }}</td>
              <td>
                <button @click="updateRequestStatus(request, 'accepted')" class="btn btn-success">Approve</button>
                <button @click="updateRequestStatus(request, 'rejected')" class="btn btn-danger">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No carer requests at the moment.</p>

        <h4>Accepted Requests</h4>
        <table v-if="acceptedRequests.length > 0" class="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Request Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in acceptedRequests" :key="request.id">
              <td>{{ request.email }}</td>
              <td>{{ request.requestDate.toDate().toLocaleString() }}</td>
              <td>{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No accepted carer requests at the moment.</p>

        <h4>Rejected Requests</h4>
        <table v-if="rejectedRequests.length > 0" class="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Request Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in rejectedRequests" :key="request.id">
              <td>{{ request.email }}</td>
              <td>{{ request.requestDate.toDate().toLocaleString() }}</td>
              <td>{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No rejected carer requests at the moment.</p>

      </div>

      <!-- Review Research Tab -->
      <div v-if="activeTab === 'research'">
        <h3>Review Research</h3>
        <p>Here you can view and approve or reject research papers submitted for review.</p>

        <h4>Pending Research</h4>
        <table v-if="pendingResearch.length > 0" class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Publisher</th>
          <th>Submission Date</th>
          <th>Actions</th>
          <th>View</th> <!-- New column for View button -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="research in pendingResearch" :key="research.id">
          <td>{{ research.title }}</td>
          <td>{{ research.publisher }}</td>
          <td>{{ research.submittedAt.toDate().toLocaleString() }}</td>
          <td>
            <button @click="updateResearchStatus(research, 'approved')" class="btn btn-success">Approve</button>
            <button @click="updateResearchStatus(research, 'rejected')" class="btn btn-danger">Reject</button>
          </td>
          <td>
            <!-- Router-link to the researchDetails page with the research ID -->
            <router-link :to="{ name: 'ResearchDetails', params: { id: research.id } }">
              <button class="btn btn-info">View</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
        <p v-else>No pending research papers at the moment.</p>

        <h4>Approved Research</h4>
        <table v-if="approvedResearch.length > 0" class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Publisher</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="research in approvedResearch" :key="research.id">
              <td>{{ research.title }}</td>
              <td>{{ research.publisher }}</td>
              <td>{{ research.submittedAt.toDate().toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No approved research papers at the moment.</p>

        <h4>Rejected Research</h4>
        <table v-if="rejectedResearch.length > 0" class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Publisher</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="research in rejectedResearch" :key="research.id">
              <td>{{ research.title }}</td>
              <td>{{ research.publisher }}</td>
              <td>{{ research.submittedAt.toDate().toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No rejected research papers at the moment.</p>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'">
        <h3>Settings</h3>
        <h4>Carer count</h4>
        <button @click="getStats">Get Stats</button>
        <p v-if="carerCount != 0">Total number of Carers: {{ carerCount }}</p>
        <p v-if="carerCount != 0">{{ carerCountError }}</p>
        <p v-if="userCount != 0">Total number of User: {{ userCount }}</p>
        <p v-if="userCount != 0">{{ userCountError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

const db = getFirestore();

const activeTab = ref('users'); // Default to 'users' tab

const carerRequests = ref([]);
const pendingRequests = ref([]);
const acceptedRequests = ref([]);
const rejectedRequests = ref([]);

const pendingResearch = ref([]);
const approvedResearch = ref([]);
const rejectedResearch = ref([]);

const carerCount = ref(null);
const carerCountError = ref(null);
const userCount = ref(null);
const userCountError = ref(null);

// Fetch carer requests from Firestore
const fetchCarerRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'carerRequests'));
  carerRequests.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  pendingRequests.value = carerRequests.value.filter(request => request.status === 'pending');
  acceptedRequests.value = carerRequests.value.filter(request => request.status === 'accepted');
  rejectedRequests.value = carerRequests.value.filter(request => request.status === 'rejected');
};


// Fetch research papers from Firestore
const fetchResearch = async () => {
  const querySnapshot = await getDocs(collection(db, 'research'));
  const researchPapers = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  pendingResearch.value = researchPapers.filter(research => research.status === 'pending');
  approvedResearch.value = researchPapers.filter(research => research.status === 'approved');
  rejectedResearch.value = researchPapers.filter(research => research.status === 'rejected');
};

// Update the status of carer requests
const updateRequestStatus = async (request, status) => {
  try {
    const requestRef = doc(db, 'carerRequests', request.id);
    await updateDoc(requestRef, { status });

    if (status === 'accepted') {
      // Send email to the accepted carer
      await axios.post('http://localhost:3000/send-acceptance-email', {
        email: request.email,
        name: request.name,  // Assuming request contains the carer's name
      });
    }

    fetchCarerRequests(); // Refresh the list of requests
    alert(`Request from ${request.email} has been ${status}.`);
  } catch (error) {
    console.error(`Error updating request status to ${status}:`, error);
  }
};

// Update the status of research papers
const updateResearchStatus = async (research, status) => {
  try {
    const researchRef = doc(db, 'research', research.id);
    await updateDoc(researchRef, { status });
    fetchResearch();
    alert(`Research titled "${research.title}" has been ${status}.`);
  } catch (error) {
    console.error(`Error updating research status to ${status}:`, error);
  }
};

const getCarerCount = async () => {
  try {
    const response = await axios.get('https://countcarers-hereasb4ba-uc.a.run.app');
    carerCount.value = response.data.count;
    carerCountError.value = null;
  } catch (error){
    console.error('Error fetching Carer count: ', error);
    carerCountError.value = error;
    carerCount.value = null
  }
}

const getUserCount = async () => {
  try {
    const response = await axios.get('https://countusers-hereasb4ba-uc.a.run.app');
    userCount.value = response.data.count;
    userCountError.value = null;
  } catch (error){
    console.error('Error fetching User count: ', error);
    userCountError.value = error;
    userCount.value = null
  }
}

const getStats = async () => {
    getUserCount()
    getCarerCount()
}

onMounted(() => {
  fetchCarerRequests(); // Fetch carer requests
  fetchResearch(); // Fetch research papers
});

const setActive = (tab) => {
  activeTab.value = tab;
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar h2 {
  color: #ecf0f1;
  text-align: center;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  padding: 10px;
  cursor: pointer;
  color: #bdc3c7;
}

.sidebar ul li:hover {
  background-color: #34495e;
  color: white;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}

.main-content h3 {
  margin-top: 0;
}

.main-content p {
  font-size: 1.2em;
}

.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f2f2f2;
  text-align: left;
}

.table tr:hover {
  background-color: #f1f1f1;
}

.btn {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin-right: 5px;
}

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}
</style>
