<script setup>
import { ref } from 'vue';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

const db = getFirestore();
const auth = getAuth();
const router = useRouter();

// Reactive form fields
const title = ref('');
const precontent = ref('');
const content = ref([{ subtitle: '', subcontent: '' }]); // Array for multiple subtitles and subcontents
const links = ref(['']); // Array for multiple links
const publisher = ref('');
const date = ref('');

// Function to add a new subtitle and subcontent
const addContentSection = () => {
  content.value.push({ subtitle: '', subcontent: '' });
};

// Function to add a new link field
const addLinkField = () => {
  links.value.push('');
};

// Function to handle form submission
const submitResearch = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Prepare the research data
      const researchData = {
        title: title.value,
        precontent: precontent.value,
        content: content.value, // This is an array of subtitle and subcontent objects
        links: links.value, // This is an array of links
        publisher: publisher.value,
        date: date.value,
        status: "pending", // Set status to true
        submittedBy: user.uid, // Save the user ID of the person who submitted the research
        submittedAt: new Date(), // Capture the current date
      };

      // Save the research data to Firestore
      await addDoc(collection(db, 'research'), researchData);

      alert('Research submitted for review.');
      router.push({ name: 'Research' }); // Redirect back to research view page
    } catch (error) {
      console.error('Error submitting research:', error);
      alert('There was an error submitting your research.');
    }
  } else {
    alert('You need to be logged in to submit research.');
  }
};
</script>

<template>
  <h1>Submit Research</h1>

  <form @submit.prevent="submitResearch" class="submit-research-form">
    <div>
      <label for="title">Title</label>
      <input v-model="title" type="text" id="title" required />
    </div>

    <div>
      <label for="precontent">Precontent</label>
      <textarea v-model="precontent" id="precontent" required></textarea>
    </div>

    <!-- Content: Subtitle and Subcontent -->
    <div v-for="(section, index) in content" :key="index">
      <label :for="'subtitle-' + index">Subtitle {{ index + 1 }}</label>
      <input v-model="section.subtitle" :id="'subtitle-' + index" type="text" required />

      <label :for="'subcontent-' + index">Subcontent {{ index + 1 }}</label>
      <textarea v-model="section.subcontent" :id="'subcontent-' + index" required></textarea>
    </div>

    <!-- Button to add more content sections -->
    <button type="button" @click="addContentSection">Add Another Section</button>

    <!-- Links -->
    <div v-for="(link, index) in links" :key="index">
      <label :for="'link-' + index">Link {{ index + 1 }}</label>
      <input v-model="links[index]" :id="'link-' + index" type="url" />
    </div>

    <!-- Button to add more link fields -->
    <button type="button" @click="addLinkField">Add Another Link</button>

    <div>
      <label for="publisher">Publisher</label>
      <input v-model="publisher" type="text" id="publisher" required />
    </div>

    <div>
      <label for="date">Date</label>
      <input v-model="date" type="date" id="date" required />
    </div>

    <!-- Submit Button -->
    <button type="submit" class="submit-btn">Submit for Review</button>
  </form>
</template>

<style scoped>

.submit-research-form {
  padding-left: 100px;
  padding-right: 100px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.submit-btn {
  margin-top: 20px;
}
</style>
