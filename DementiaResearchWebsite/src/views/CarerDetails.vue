<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

const route = useRoute();
const db = getFirestore();

// Reactive variable to store carer details
const carer = ref(null);
const visible = ref(false);
const averageRating = ref(0);
const submittedReviews = ref([]);
const review = ref({
    rating: 0,
    comments: "",
});
const errors = ref({
    rating: null,
    comments: null,
});

// Fetch the specific carer data and their reviews from Firestore
const fetchCarerDetails = async () => {
    try {
        const carerRef = doc(db, 'carers', route.params.id); // Use ID from route params
        const carerSnapshot = await getDoc(carerRef);
        
        if (carerSnapshot.exists()) {
            carer.value = carerSnapshot.data();
            fetchCarerReviews(); // Fetch associated reviews after fetching carer details
        } else {
            console.error("Carer not found");
        }
    } catch (error) {
        console.error("Error fetching carer details:", error);
    }
};

// Fetch reviews for the specific carer
const fetchCarerReviews = async () => {
    try {
        const reviewsRef = collection(db, 'reviews'); // Assume reviews are stored in a 'reviews' collection
        const q = query(reviewsRef, where('carerId', '==', route.params.id)); // Filter by carer ID
        const querySnapshot = await getDocs(q);
        
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push(doc.data());
        });

        submittedReviews.value = reviews;
        calculateAverage(); // Recalculate average rating
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
};

// Submit a new review to Firestore
const submitReview = async () => {
    validateComments(true);
    if (!errors.value.comments) {
        try {
            const newReview = {
                carerId: route.params.id,
                rating: review.value.rating,
                comments: review.value.comments,
                timestamp: new Date(),
            };

            await addDoc(collection(db, 'reviews'), newReview);
            submittedReviews.value.push(newReview); // Update the local review list
            calculateAverage();
            clearReview();
            visible.value = false; // Close the modal
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }
};

const calculateAverage = () => {
    if (submittedReviews.value.length === 0) {
        averageRating.value = 0;
    } else {
        const total = submittedReviews.value.reduce((sum, review) => sum + review.rating, 0);
        averageRating.value = total / submittedReviews.value.length;
    }
};

const clearReview = () => {
    review.value = {
        comments: '',
        rating: 0
    };
};

const validateComments = (blur) => {
    if (review.value.comments.length < 5) {
        if (blur) errors.value.comments = 'Comments must be at least 5 characters long';
    } else {
        errors.value.comments = null;
    }
};

// Run the fetch function when the component is mounted
onMounted(() => {
    fetchCarerDetails();
});
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
