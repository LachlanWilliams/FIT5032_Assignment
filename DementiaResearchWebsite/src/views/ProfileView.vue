<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { isAuthenticated, role, name } from '@/main';

const auth = getAuth();
const db = getFirestore();

const formData = ref({
  name: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
  description: '',
  rating: 0
});

const errors = ref({
  email: null,
  password: null,
  confirm: null,
  carerRequest: null
});

const successMessage = ref(null);
const isCarer = ref(false); // Flag to check if the user is already a carer
const hasRequestedCarer = ref(false); // Flag to check if the user has already requested to be a carer

// Fetch carer data if the user is already a carer
const fetchCarerData = async () => {
  try {
    const user = auth.currentUser;
    const carerRef = doc(db, 'carers', user.uid);
    const carerSnapshot = await getDoc(carerRef);

    if (carerSnapshot.exists()) {
      isCarer.value = true;
      const carerData = carerSnapshot.data();
      formData.value.name = user.displayName || '';
      formData.value.description = carerData.description;
      formData.value.rating = carerData.rating;
    }
  } catch (error) {
    console.log(error);
  }
};

// Check if the user has already sent a carer request
const checkExistingCarerRequest = async () => {
  try {
    const user = auth.currentUser;
    const carerRequestQuery = query(
      collection(db, 'carerRequests'),
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const carerRequestSnapshot = await getDocs(carerRequestQuery);

    if (!carerRequestSnapshot.empty) {
      hasRequestedCarer.value = true;
    }
  } catch (error) {
    console.error('Error checking for existing carer request:', error);
  }
};

// Request to be a carer
const requestCarer = async () => {
  if (hasRequestedCarer.value) {
    errors.value.carerRequest = 'You have already submitted a carer request.';
    return;
  }

  try {
    const user = auth.currentUser;
    const userName = user.displayName || 'Anonymous';

    // Add a request to Firestore
    await addDoc(collection(db, 'carerRequests'), {
      userId: user.uid,
      name: userName,
      email: user.email,
      requestDate: new Date(),
      status: 'pending'
    });

    successMessage.value = 'Carer request submitted successfully!';
    hasRequestedCarer.value = true; // Mark that the request has been submitted
  } catch (error) {
    console.error('Error submitting carer request:', error);
    errors.value.carerRequest = 'Failed to submit carer request.';
  }
};

// On component mounted, check if the user is a carer or has already requested carer status
onMounted(() => {
  if (isAuthenticated.value && role.value === 'carer') {
    fetchCarerData();
  } else {
    checkExistingCarerRequest();
  }
});
</script>

<template>
  <div class="container mt-5">
    <h1>Profile Page</h1>

    <div v-if="isAuthenticated">
      <form @submit.prevent="updateUserProfile">
        
        <!-- New Name Field -->
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="formData.name" 
            placeholder="Update your name" 
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">New Email</label>
          <input 
            type="email" 
            class="form-control" 
            v-model="formData.email" 
            placeholder="Update your email" 
          />
          <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label for="newPassword" class="form-label">New Password</label>
          <input 
            type="password" 
            class="form-control" 
            v-model="formData.newPassword" 
            @blur="validatePassword(true)" 
            placeholder="Update your password" 
          />
          <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm New Password</label>
          <input 
            type="password" 
            class="form-control" 
            v-model="formData.confirmPassword" 
            @blur="validateConfirmPassword(true)" 
            placeholder="Confirm your password" 
          />
          <div v-if="errors.confirm" class="text-danger">{{ errors.confirm }}</div>
        </div>

        <!-- Carer Section: Allow updating description and rating -->
        <div v-if="isCarer">
          <div class="mb-3">
            <label for="description" class="form-label">Carer Description</label>
            <textarea 
              class="form-control" 
              v-model="formData.description" 
              placeholder="Update your carer description"></textarea>
          </div>

          <div class="mb-3">
            <label for="rating" class="form-label">Rating</label>
            <input 
              type="number" 
              class="form-control" 
              v-model="formData.rating" 
              readonly 
            />
          </div>
        </div>

        <button type="submit" class="btn btn-primary">Update Profile</button>
      </form>

      <hr v-if="!isCarer && role == 'user'" />

      <!-- Request Carer Section for non-carers -->
      <div v-if="!isCarer && role == 'user'">
        <h3>Request to be a Carer</h3>
        <button 
          @click="requestCarer" 
          class="btn btn-warning"
          :disabled="hasRequestedCarer"
        >
          Request Carer Status
        </button>
        <div v-if="errors.carerRequest" class="text-danger">{{ errors.carerRequest }}</div>
        <div v-if="hasRequestedCarer && !errors.carerRequest" class="text-info">
          You have already submitted a carer request. It is pending approval.
        </div>
      </div>

      <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    </div>
  </div>
</template>
