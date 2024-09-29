<script setup>
import { ref } from 'vue';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { isAuthenticated, role } from '@/main';

const auth = getAuth();
const db = getFirestore();

const formData = ref({
  email: '',
  newPassword: '',
  confirmPassword: ''
});

const errors = ref({
  email: null,
  password: null,
  confirm: null,
  carerRequest: null
});

const successMessage = ref(null);

// Validate Password Function
const validatePassword = (blur) => {
  const password = formData.value.newPassword;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.';
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.';
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.';
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.';
  } else {
    errors.value.password = null;
  }
};

// Validate Confirm Password Function
const validateConfirmPassword = (blur) => {
  const confirmPassword = formData.value.confirmPassword;
  const password = formData.value.newPassword;

  if (confirmPassword !== password) {
    if (blur) errors.value.confirm = 'Confirm password must be the same as the password.';
  } else {
    errors.value.confirm = null;
  }
};

// Update Profile Function
const updateProfile = async () => {
  try {
    const user = auth.currentUser;

    // Check if email needs updating
    if (formData.value.email && formData.value.email !== user.email) {
      await updateEmail(user, formData.value.email);
      successMessage.value = 'Email updated successfully!';
    }

    // Check if password needs updating and validate it
    if (formData.value.newPassword && !errors.value.password && !errors.value.confirm) {
      await updatePassword(user, formData.value.newPassword);
      successMessage.value = 'Password updated successfully!';
    } else {
      if (formData.value.newPassword) {
        validatePassword(true); // Trigger validation for password
        validateConfirmPassword(true); // Trigger validation for confirm password
      }
    }

  } catch (error) {
    console.error(error);
    errors.value.email = 'Failed to update email.';
    errors.value.password = 'Failed to update password.';
  }
};

// Request to be a carer
const requestCarer = async () => {
  try {
    const user = auth.currentUser;

    // Add a request to Firestore
    await addDoc(collection(db, 'carerRequests'), {
      userId: user.uid,
      email: user.email,
      requestDate: new Date(),
      status: 'pending'
    });

    successMessage.value = 'Carer request submitted successfully!';
  } catch (error) {
    console.error(error);
    errors.value.carerRequest = 'Failed to submit carer request.';
  }
};

</script>

<template>
  <div class="container mt-5">
    <h1>Profile Page</h1>

    <div v-if="isAuthenticated">
      <form @submit.prevent="updateProfile">
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

        <button type="submit" class="btn btn-primary">Update Profile</button>
      </form>

      <hr v-if="role == 'user' " />

      <div v-if="role == 'user' ">
        <h3>Request to be a Carer</h3>
        <p>Click the button below to request to become a carer:</p>
        <button @click="requestCarer" class="btn btn-warning">Request to be a Carer</button>
        <div v-if="errors.carerRequest" class="text-danger">{{ errors.carerRequest }}</div>
      </div>

      <div v-if="successMessage" class="text-success mt-3">{{ successMessage }}</div>
    </div>

    <div v-else>
      <p>Please log in to view your profile.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>
