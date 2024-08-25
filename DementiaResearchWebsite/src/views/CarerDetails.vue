<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import carers from '../assets/JSON/carers.json';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import Textarea from 'primevue/textarea';

// allows the user of routing within the file
const route = useRoute();

// gets the carer info based on the name passed in 
const carer = computed(() => {
  return carers.find(c => c.name === route.params.name);
});

// to see if the review form is visible 
const visible = ref(false);

const averageRating = ref(0);

// ran when the review is submitted
const submitReview = () => {
    validateComments(true)
    //validateRating(true)
    if (!errors.value.comments && !errors.value.rating) {
        visible.value = false;
        submittedReviews.value.push({ ...review.value })
        calculateAverage()
        clearReview()
    }
}

const calculateAverage = () => {
    if (submittedReviews.value.length === 0) {
        averageRating.value = 0;
    } else {
        const total = submittedReviews.value.reduce((sum, review) => sum + review.rating, 0);
        averageRating.value = total / submittedReviews.value.length;
    }
};

// value connected to the review form
const review = ref({
    rating: 0,
    comments: "",
})

// keeps any errors
const errors = ref({
    rating: null,
    comments: null,
})

// clears the review 
const clearReview = () => {
    review.value = {
        comments: '',
        rating: 0
    }
}

// the list of submitted reviews
const submittedReviews = ref([])

// validate that the comments are long enough
const validateComments = (blur) => {
    if (review.value.comments.length < 5){
        if (blur) errors.value.comments = 'Comments must be at least 5 characters long'
    } else {
        errors.value.comments = null
    }
}
</script>

<template>
  <div v-if="carer">
    <h1>{{ carer.name }}</h1>
    <h2>{{ carer.role }}</h2>
    <p>{{ carer.description }}</p>
    <Rating v-model="averageRating" readonly/>
    <p>Leave a review</p>
    <Button @click="visible = true" label="Submit review" severity="Primary" outlined />
    
    <div class="row mt-5" v-if="submittedReviews.length">
        <div class="d-flex flex-wrap justify-content-start">
        <div
            v-for="(card, index) in submittedReviews"
            :key="index"
            class="card m-2"
            style="width: 18rem"
        >
            <div class="card-header">Review {{ index + 1 }}</div>
            <ul class="list-group list-group-flush">
            <li class="list-group-item">Rating: {{ card.rating }}</li>
            <li class="list-group-item">Comments: {{ card.comments }}</li>
            </ul>
        </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal>
        <h4>Submit a Review for {{ carer.name }}</h4>
        <div class="spacer">
            <span>Rating</span>
            <Rating v-model="review.rating"/>
            <div v-if="errors.rating" class="text-danger">{{ errors.username }}</div>
        </div>
        <div class="spacer">
            <span>Comments</span>
            <div class="flex items-center gap-4 lg-4">
                <Textarea
                id="username" 
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
        <Button @click="submitReview()" label="Submit" severity="Primary" outlined />
    </Dialog>
  </div>
  <div v-else>
    <p>Carer not found.</p>
  </div>
</template>

<style scoped>
.spacer {
    padding-top: 10px;
    padding-bottom: 10px;
}

</style>