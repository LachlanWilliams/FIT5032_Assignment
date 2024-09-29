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
            <tr v-for="request in carerRequests" :key="request.id">
              <td>{{ request.email }}</td>
              <td>{{ request.requestDate.toDate().toLocaleString() }}</td>
              <td>{{ request.status }}</td>
              <td>
                <button @click="approveRequest(request)" class="btn btn-success">Approve</button>
                <button @click="rejectRequest(request)" class="btn btn-danger">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No carer requests at the moment.</p>
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
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const activeTab = ref('users'); // Default to 'users' tab
const carerRequests = ref([]); // To store carer requests

// Fetch carer requests from Firestore
const fetchCarerRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'carerRequests'));
  carerRequests.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Approve carer request: Update the user's role to 'carer' and delete the request
const approveRequest = async (request) => {
  try {
    const userRef = doc(db, 'users', request.userId); // Assuming user information is stored in 'users' collection

    // Update the user's role to 'carer'
    await updateDoc(userRef, { role: 'carer' });

    // Create a new document in the 'carers' collection
    const carerData = {
      userId: request.userId,        // The user's ID
      name: request.name,            // Assuming 'name' is part of the request
      roleDesc: 'Carer',             // Default role description
      rating: 0,                     // Initial rating
      description: "I'm new here!!", // Default description
    };
    
    await setDoc(doc(db, 'carers', request.userId), carerData); // Add a document with the user's ID in the 'carers' collection

    // Delete the carer request from the 'carerRequests' collection
    await deleteDoc(doc(db, 'carerRequests', request.id));

    alert(`Approved and role updated for ${request.email}, carer profile created.`);
    fetchCarerRequests(); // Refresh the list of carer requests
  } catch (error) {
    console.error("Error approving carer request:", error);
  }
};

// Reject carer request: Simply delete the request
const rejectRequest = async (request) => {
  try {
    await deleteDoc(doc(db, 'carerRequests', request.id)); // Delete the request
    alert(`Rejected request from ${request.email}`);
    fetchCarerRequests(); // Refresh the list
  } catch (error) {
    console.error("Error rejecting carer request:", error);
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
