<script setup>
import { ref } from 'vue'
import { isAuthenticated } from '@/router';

const formData = ref({
  username: '',
  password: '',
})

const credentials = ref({
    username: 'lwil',
    password: 'p',
    isAuthenticated: false
})

const submitForm = () => {
//   validateName(true)
//   validatePassword(true)
  if (formData.value.password == credentials.value.password && formData.value.username == credentials.value.username){
    credentials.value.isAuthenticated = true
    isAuthenticated.value = true
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
  }
}

const errors = ref({
  username: null,
  password: null,
})

const validateName = (blur) => {
  if (formData.value.username == credentials.value.username) {
    if (blur) errors.value.username = 'You got the name correct'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  
  if (password == credentials.value.password) {
    if (blur) errors.value.password = 'You got the password correct'
  } else {
    errors.value.password = null
  }
}
</script>

<template>
  <!-- 🗄️ W3. Library Registration Form -->
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Library Login Form</h1>
        <p class="text-center">
          This has hardcoded credentials username: lwil, password: p
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
              <div v-if="errors.username" class="text-success">{{ errors.username }}</div>
            </div>
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
              <div v-if="errors.password" class="text-success">{{ errors.password }}</div>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn btn-primary me-2" @click="submitForm">Submit</button>
            <div v-if="credentials.isAuthenticated" class="text-success">You are authenticated</div>
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
