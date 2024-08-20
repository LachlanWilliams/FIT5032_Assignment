<script setup>
import { ref } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import SignUpForm from '@/components/SignUpForm.vue';

const showLogin = ref(true);

const toggleForm = () => {
  showLogin.value = !showLogin.value;
};

</script>

<template>
 <div class="container">
    <div v-if="showLogin">
      <LoginForm />
    </div>
    <div v-else>
      <SignUpForm />
    </div>
    <div class="text-center mt-3">
      <button class="btn btn-secondary" @click="toggleForm">
        {{ showLogin ? 'Go to Sign Up' : 'Go to Login' }}
      </button>
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
