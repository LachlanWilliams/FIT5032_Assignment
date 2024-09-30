<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { isAuthenticated, role, name } from '@/main';

const auth = getAuth();
const db = getFirestore();

const formData = ref({
  name: '', // Add a field for the user's name
  email: '',
  newPassword: '',
  confirmPassword: '',
  description: '',
  rating: 0 // Default rating
});

const errors = ref({
  email: null,
  password: null,
  confirm: null,
  carerRequest: null
});

const successMessage = ref(null);
const isCarer = ref(false); // Flag to check if the user is a carer

const fetchCarerData = async () => {
  try {
    const user = auth.currentUser;
    const carerRef = doc(db, 'carers', user.uid);
    const carerSnapshot = await getDoc(carerRef);

    if (carerSnapshot.exists()) {
      isCarer.value = true; // Set the flag to true if the user is a carer
      const carerData = carerSnapshot.data();
      formData.value.name = user.displayName || ''; // Fetch the current name
      formData.value.description = carerData.description;
      formData.value.rating = carerData.rating;
    }
  } catch (error) {
    console.log(error);
  }
};

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
const updateUserProfile = async () => {
  try {
    const user = auth.currentUser;

    // Update user name if it has changed
    if (formData.value.name && formData.value.name !== user.displayName) {
      await updateProfile(user, { displayName: formData.value.name });

      await updateDoc(doc(db, 'users', user.uid), { name: formData.value.name });

      name.value = formData.value.name

      successMessage.value = 'Name updated successfully!';
    }

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

    // Update Carer Information if the user is a carer
    if (isCarer.value) {
      const carerRef = doc(db, 'carers', user.uid);
      await updateDoc(carerRef, {
        name: formData.value.name, // Update the carer's name
        description: formData.value.description, // Update description
        rating: formData.value.rating // Update rating if needed (you could make this non-editable if desired)
      });
      successMessage.value = 'Carer profile updated successfully!';
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
    const userName = user.displayName || 'Anonymous'; // Fetch the display name, fallback to 'Anonymous' if not set

    // Add a request to Firestore
    await addDoc(collection(db, 'carerRequests'), {
      userId: user.uid,
      name: userName, // Include the user's name in the request
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

// On component mounted, check if the user is a carer
onMounted(() => {
  if (isAuthenticated.value && role.value === 'carer') {
    fetchCarerData();
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
            <label for="rating" class="form-label">Rating (you can make this readonly)</label>
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
        <button @click="requestCarer" class="btn btn-warning">Request Carer Status</button>
        <div v-if="errors.carerRequest" class="text-danger">{{ errors.carerRequest }}</div>
      </div>

      <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    </div>
  </div>
</template>
