<script setup>
import { ref } from 'vue'
import { isAuthenticated, name } from '@/main';
import router from '../router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Import Firebase Authentication

const formData = ref({
  email: '',
  password: '',
  confirm: '',
  name: ''
})

const errors = ref({
  email: null,
  password: null,
  confirm: null,
  name: null,
})

const validateName = (blur) => {
  if (formData.value.name.length < 5) {
    if (blur) errors.value.name = 'Name must be at least 5 characters'
  } else {
    errors.value.name = null
  }
}

const validateEmail = (blur) => {
  // TODO: validtae emailwith @ and . something 
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  const confirm = formData.value.confirm
  const password = formData.value.password

  if (confirm !== password) {
    if (blur) errors.value.confirm = 'Confirm password must be the same as the password.'
  } else {
    errors.value.confirm = null
  }
}

const submitForm = async () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (!errors.value.email && !errors.value.password && !errors.value.confirm) {
    const auth = getAuth(); // Initialize Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password);
      const user = userCredential.user;

      // Optionally update the user's display name
      await updateProfile(user, {
        displayName: formData.value.name // or you can use the email
      });

      // Set global authentication state
      isAuthenticated.value = true;
      name.value = formData.value.name;

      // Redirect to home page
      router.push({ name: 'Home' });
    } catch (error) {
      console.error('Error signing up:', error);
      errors.value.email = 'Error signing up. Please try again.';
    }
  }
}
</script>


<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Sign Up Form</h1>
        <p class="text-center">
          Please enter the required information
        </p>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
                <label for="name" class="form-label">Name</label>
                <input
                    type="text"
                    class="form-control"
                    id="name"
                    @blur="() => validateName(true)"
                    @input="() => validateName(false)"
                    v-model="formData.name"
                />
                <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="email" class="form-label">Email</label>
                <input
                    type="text"
                    class="form-control"
                    id="email"
                    @blur="() => validateEmail(true)"
                    @input="() => validateEmail(false)"
                    v-model="formData.email"
                />
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    @blur="() => validatePassword(true)" 
                    @input="() => validatePassword(false)"
                    v-model="formData.password"
                />
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
                <label for="confirmpassword" class="form-label">Confirm Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    @input="() => validateConfirmPassword(false)"
                    @blur="() => validateConfirmPassword(true)"
                    v-model="formData.confirm"
                />
                <div v-if="errors.confirm" class="text-danger">{{ errors.confirm }}</div>
            </div>
            </div>
          <div class="text-center">
            <button type="button" class="btn btn-primary me-2" @click="submitForm">Sign Up</button>
            <div v-if="isAuthenticated" class="text-success">Thank you {{ name }} you have successfully signed up</div>
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
#isAustralian:focus,

.list-group-item {
  padding: 10px;
}
</style>
