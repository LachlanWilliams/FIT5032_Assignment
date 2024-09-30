<template>
  <div class="admin-dashboard">
    <nav class="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li @click="setActive('users')">Manage Users</li>
        <li @click="setActive('reports')">View Reports</li>
        <li @click="setActive('settings')">Settings</li>
      </ul>
    </nav>

    <div class="main-content">
      <!-- Manage Users Tab -->
      <div v-if="activeTab === 'users'">
        <h3>Manage Users</h3>
        <p>Here you can view, add, or remove users from the system.</p>

        <h4>Carer Requests</h4>
        <table v-if="carerRequests.length > 0" class="table">
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
      </div>

      <!-- Reports Tab -->
      <div v-if="activeTab === 'reports'">
        <h3>View Reports</h3>
        <p>Here you can view the system's activity and performance reports.</p>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'">
        <h3>Settings</h3>
        <p>Here you can configure application settings.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const db = getFirestore();

const activeTab = ref('users'); // Default to 'users' tab
const carerRequests = ref([]); // To store carer requests
const pendingRequests = ref([]); // To store only pending requests
const acceptedRequests = ref([]); // To store accepted requests
const rejectedRequests = ref([]); // To store rejected requests

// Fetch carer requests from Firestore
const fetchCarerRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'carerRequests'));
  carerRequests.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  
  // Filter accepted and rejected requests
  acceptedRequests.value = carerRequests.value.filter(request => request.status === 'accepted');
  rejectedRequests.value = carerRequests.value.filter(request => request.status === 'rejected');
  pendingRequests.value = carerRequests.value.filter(request => request.status === 'pending');

};

// Update the status of carer requests
const updateRequestStatus = async (request, status) => {
  try {
    const requestRef = doc(db, 'carerRequests', request.id);
    
    // Update request status
    await updateDoc(requestRef, { status });

    // Refresh the list of carer requests
    fetchCarerRequests();
    alert(`Request from ${request.email} has been ${status}.`);
  } catch (error) {
    console.error(`Error updating carer request status to ${status}:`, error);
  }
};

onMounted(() => {
  fetchCarerRequests(); // Fetch the carer requests when the component is mounted
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
  font-size: 1.1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f2f2f2;
}

.btn {
  margin: 5px;
  padding: 5px 10px;
}
</style>
