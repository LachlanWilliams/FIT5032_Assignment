<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import jsPDF from 'jspdf';

// Firebase setup
const db = getFirestore();
const route = useRoute();

// Reactive variable to hold the research item
const researchItem = ref(null);

// to toggle the review form dialog visibility
const visible = ref(false);

// store average rating and submitted reviews
const averageRating = ref(0);
const submittedReviews = ref([]);

// current review form data
const review = ref({
  rating: 0,
  comments: "",
});

// holds error messages for validation
const errors = ref({
  rating: null,
  comments: null,
});

// Function to fetch the research item from Firestore
const fetchResearchItem = async () => {
  const docRef = doc(db, 'research', route.params.id); // Use id to get document
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    researchItem.value = { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
  }
};

// Call the fetch function on component mount
onMounted(() => {
  fetchResearchItem();
});

// Function to handle review submission
const submitReview = () => {
  validateComments(true);
  if (!errors.value.comments && !errors.value.rating) {
    visible.value = false;
    submittedReviews.value.push({ ...review.value });
    calculateAverage(); // recalculate average rating
    clearReview(); // clear the review form
  }
};

// Recalculate the average rating based on all submitted reviews
const calculateAverage = () => {
  if (submittedReviews.value.length === 0) {
    averageRating.value = 0;
  } else {
    const total = submittedReviews.value.reduce((sum, review) => sum + review.rating, 0);
    averageRating.value = total / submittedReviews.value.length;
  }
};

// Clear the review form fields
const clearReview = () => {
  review.value = {
    rating: 0,
    comments: ''
  };
};

// Validate comment length (at least 5 characters)
const validateComments = (blur) => {
  if (review.value.comments.length < 5) {
    if (blur) errors.value.comments = 'Comments must be at least 5 characters long';
  } else {
    errors.value.comments = null;
  }
};

// Function to export research as PDF
// Function to export research as PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);

  // Ensure the researchItem data exists and is valid
  const title = researchItem.value?.title || 'No Title';
  const publisher = researchItem.value?.publisher || 'Unknown Publisher';
  const date = researchItem.value?.date || 'No Date Available';
  const precontent = researchItem.value?.precontent || '';

  // Adding the title and other details
  doc.text(title, 10, 10);
  doc.setFontSize(14);
  doc.text(`Publisher: ${publisher}`, 10, 20);
  doc.text(`Date published: ${date}`, 10, 30);
  doc.setFontSize(12);
  doc.text(precontent, 10, 40);

  // Add content sections
  let y = 60;
  if (researchItem.value.content && researchItem.value.content.length) {
    doc.text('Research Content:', 10, 50);
    researchItem.value.content.forEach(item => {
      const subtitle = item.subtitle || 'No Subtitle';
      const subcontent = item.subcontent || 'No Content';

      doc.setFontSize(12);
      doc.text(subtitle, 10, y);
      doc.setFontSize(10);
      y += 10;
      doc.text(subcontent, 10, y);
      y += 10;
    });
  }

  // Add related links
  if (researchItem.value.links && researchItem.value.links.length) {
    doc.setFontSize(12);
    doc.text('Related Links:', 10, y);
    y += 10;
    researchItem.value.links.forEach(link => {
      const linkTitle = link || 'No Link';
      doc.setFontSize(10);
      doc.text(linkTitle, 10, y);
      y += 10;
    });
  }

  // Save the PDF
  doc.save('research.pdf');
};

</script>

<template>
  <div v-if="researchItem">
    <h1>{{ researchItem.title }}</h1>
    <h2>Publisher: {{ researchItem.publisher }}</h2>
    <h3>{{ researchItem.precontent }}</h3>

    <!-- Display content with subtitles and subcontents -->
    <div v-if="researchItem.content && researchItem.content.length">
      <h4>Research Content:</h4>
      <div v-for="(item, index) in researchItem.content" :key="index">
        <h4>{{ item.subtitle }}</h4>
        <p>{{ item.subcontent }}</p>
      </div>
    </div>

    <!-- Display list of links -->
    <div v-if="researchItem.links && researchItem.links.length">
      <h4>Related Links:</h4>
      <ul>
        <li v-for="(link, index) in researchItem.links" :key="index">
          <a :href="link" target="_blank">{{ link }}</a>
        </li>
      </ul>
    </div>

    <p>Date published: {{ researchItem.date }}</p>

    <!-- Button to export research as PDF -->
    <Button @click="exportToPDF" label="Export as PDF" severity="Secondary" outlined />

    <!-- Display average rating -->
    <Rating v-model="averageRating" readonly />
    <p v-if="submittedReviews.length">Average Rating: {{ averageRating.toFixed(1) }}</p>

    <!-- Button to submit a review -->
    <p>Leave a review</p>
    <Button @click="visible = true" label="Submit review" severity="Primary" outlined />

    <!-- Submitted reviews list -->
    <div class="row mt-5" v-if="submittedReviews.length">
      <div class="d-flex flex-wrap justify-content-start">
        <div v-for="(card, index) in submittedReviews" :key="index" class="card m-2" style="width: 18rem">
          <div class="card-header">Review {{ index + 1 }}</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Rating: {{ card.rating }}</li>
            <li class="list-group-item">Comments: {{ card.comments }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Review submission dialog -->
    <Dialog v-model:visible="visible" modal>
      <h4>Submit a Review for {{ researchItem.title }}</h4>
      <div class="spacer">
        <span>Rating</span>
        <Rating v-model="review.rating" />
        <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>
      </div>
      <div class="spacer">
        <span>Comments</span>
        <div class="flex items-center gap-4 lg-4">
          <Textarea
            id="comments"
            class="flex-auto"
            autocomplete="off"
            rows="4"
            cols="50"
            @blur="() => validateComments(true)"
            @input="() => validateComments(false)"
            v-model="review.comments"
          />
          <div v-if="errors.comments" class="text-danger">{{ errors.comments }}</div>
        </div>
      </div>
      <Button @click="submitReview" label="Submit" severity="Primary" outlined />
    </Dialog>
  </div>

  <div v-else>
    <p>Research not found.</p>
  </div>
</template>

<style scoped>
.spacer {
  padding-top: 10px;
  padding-bottom: 10px;
}

.text-danger {
  color: red;
}
</style>
