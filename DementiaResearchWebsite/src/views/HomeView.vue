<script setup>
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1>Dementia Research Australia</h1>
      <p>Your source for dementia research and care, raising awareness to make a difference.</p>
      <router-link to="/Research" class="btn btn-primary">Explore Research</router-link>
    </div>
  </section>

  <section class="about-section">
    <h2>About Dementia</h2>
    <p>
      Dementia affects nearly half a million Australians. It impacts memory, thinking, and behavior.
      Our mission is to provide research-backed information and support for those affected.
    </p>
    <router-link to="/getinvolved" class="btn btn-primary">Get Involved</router-link>
  </section>

  <section class="featured-section">
    <h2>Carer Highlights</h2>
    <p>Check out our carers! Read about who might be a good fit to help you out.</p>
    <router-link to="/Carers" class="btn btn-primary">Read More</router-link>
  </section>
</template>

<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
  padding: 6rem 0;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.about-section, .featured-section {
  padding: 3rem 1.5rem;
  text-align: center;
}

.about-section h2, .featured-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1rem;
}

.btn-primary {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-outline-primary {
  color: #0056b3;
  border-color: #0056b3;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

</style>
