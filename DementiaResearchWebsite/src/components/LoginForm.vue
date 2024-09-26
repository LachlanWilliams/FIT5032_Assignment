<script setup>
import { ref } from 'vue';
import { isAuthenticated, name, role } from '@/main';
import router from '../router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore methods

const formData = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: null,
  password: null
});

const submitForm = async () => {
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      formData.value.email, 
      formData.value.password
    );
    
    // Login successful, get user info
    const user = userCredential.user;

    // Retrieve the user's document from Firestore
    const userDocRef = doc(db, 'users', user.uid); // Get reference to the user's document
    const userDocSnap = await getDoc(userDocRef); // Fetch the document

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data(); // Get user data (including the role)

      // Set global authentication state and user's name
      isAuthenticated.value = true;
      name.value = user.displayName || user.email; // Use displayName if available, else fallback to email
      role.value = userData.role
      console.log('User role:', userData.role); // Log user role, for example
      
      // You can set the user's role or use it for conditional navigation
      if (userData.role === 'admin') {
        router.push({ name: 'AdminDashboard' });
      } else {
        router.push({ name: 'Home' }); // Redirect to home page for regular users
      }
    } else {
      console.error('No such user document!');
    }
    
  } catch (error) {
    // Handle Errors
    errors.value.email = 'Invalid credentials';
    errors.value.password = 'Invalid credentials';
  }
};
</script>


<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Login Form</h1>
        <p class="text-center">
          Login with your Email and Password 
        </p>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="email" class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                v-model="formData.email"
              />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn btn-primary me-2" @click="submitForm">Login</button>
            <div v-if="isAuthenticated" class="text-success">Thank you {{ name }} have being been signed in successfully</div>
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
#email:focus,
#password:focus,

.list-group-item {
  padding: 10px;
}
</style>
