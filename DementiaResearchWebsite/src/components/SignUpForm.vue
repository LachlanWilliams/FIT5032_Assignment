<script setup>
import { ref, computed } from 'vue'
import logins from '../assets/JSON/logins.json';
import { isAuthenticated, role } from '../router';


const formData = ref({
  username: '',
  password: '',
  role: ''
})

const submitForm = () => {
  const user = logins.find(
    login => 
      login.username === formData.value.username &&
      login.password === formData.value.password &&
      login.role === formData.value.role
  );
  if (user) {
    isAuthenticated.value = true; // Assuming this updates global/auth state
    role.value = formData.value.role;
  } else {
    errors.value.username = 'Invalid credentials';
    errors.value.password = 'Invalid credentials';
  }
}

const errors = ref({
  username: null,
  password: null,
})
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Sign Up Form</h1>
        <p class="text-center">
          This has hardcoded credentials username: lwil, password: u, role: user
        </p>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-success">{{ errors.username }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-success">{{ errors.password }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4 offset-4">
              <label for="role" class="form-label">Role</label>
              <select class="form-select" id="role" v-model="formData.role" required>
                <option value="user">User</option>
                <option value="carer">Carer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn btn-primary me-2" @click="submitForm">Login</button>
            <div v-if="isAuthenticated" class="text-success">You are authenticated as a {{ role }}</div>
            <!-- <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button> -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}

/* Class selectors */
.form {
  text-align: center;
  margin-top: 50px;
}

/* ID selectors */
#username:focus,
#password:focus,
#isAustralian:focus,

.list-group-item {
  padding: 10px;
}
</style>
