<script setup>
import { ref } from 'vue'
import { isAuthenticated, role } from '@/main';
import router from '../router';


const formData = ref({
  username: '',
  password: '',
  confirm: '',
  role: ''
})

const errors = ref({
  username: null,
  password: null,
  confirm: null,
  role: null,
})

const validateName = (blur) => {
  if (formData.value.username.length < 5) {
    if (blur) errors.value.username = 'Name must be at least 5 characters'
  } else {
    errors.value.username = null
  }
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
    if (blur) errors.value.confirm = 'Confirm password must be the same a the password.'
  } else {
    errors.value.confirm = null
  }
}

const validateRole = (blur) => {
    const role = formData.value.role

    if (role == '' || role == null){
        if (blur) errors.value.role = "Select a role."
    } else {
        errors.value.role = null
    }
}

const submitForm = () => {
    validateName(true)
    validatePassword(true)
    validateConfirmPassword(true)
    validateRole(true)

  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword && !errors.value.role) {
    isAuthenticated.value = true; // Assuming this updates global/auth state
    role.value = formData.value.role;
    router.push({name: 'Home'});
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
                <label for="username" class="form-label">Username</label>
                <input
                    type="text"
                    class="form-control"
                    id="username"
                    @blur="() => validateName(true)"
                    @input="() => validateName(false)"
                    v-model="formData.username"
                />
                <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
                <label for="role" class="form-label">Role</label>
              <select class="form-select" id="role" @blur="() => validateRole(true)" @input="() => validateRole(false)" v-model="formData.role" required>
                <option value="user">User</option>
                <option value="carer">Carer</option>
              </select>
              <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
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
