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
        <div v-if="activeTab === 'users'">
          <h3>Manage Users</h3>
          <!-- User Management Content -->
          <p>Here you can view, add, or remove users from the system.</p>
        </div>
  
        <div v-if="activeTab === 'reports'">
          <h3>View Reports</h3>
          <!-- Reports Content -->
          <p>Here you can view the system's activity and performance reports.</p>
        </div>
  
        <div v-if="activeTab === 'settings'">
          <h3>Settings</h3>
          <!-- Settings Content -->
          <p>Here you can configure application settings.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const activeTab = ref('users'); // Default to 'users' tab
  
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
  </style>
  