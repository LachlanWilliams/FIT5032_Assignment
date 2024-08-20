<script setup>
import { isAuthenticated, role } from '@/main';
import { RouterLink } from 'vue-router';
</script>

<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <div class="col-12 col-sm-10">
        <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/Research" class="nav-link" active-class="active">Research</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/getinvolved" class="nav-link" active-class="active">Get involved</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/carers" class="nav-link" active-class="active">Our Carers</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/search" class="nav-link" active-class="active">Search</router-link>
        </li>
      </ul>
      </div>
      <div class="col-12 col-sm-1">
          <p>hello</p>
      </div>
      <div class="col-12 col-sm-1">
        <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
      </div>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}

.right-element {
  margin-left: auto;
}

.left-element {
  margin-right: auto;
}
</style>
