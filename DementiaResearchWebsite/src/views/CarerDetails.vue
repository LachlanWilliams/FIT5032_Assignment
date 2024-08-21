<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import carers from '../assets/JSON/carers.json';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import Textarea from 'primevue/textarea';

const route = useRoute();

const carer = computed(() => {
  return carers.find(c => c.name === route.params.name);
});

const visible = ref(false);

const submitReview = () => {
    visible.value = false;
    alert(review.value.rating)
}

const review = ref({
    rating: 0,
    comments: "",
})

</script>

<template>
  <div v-if="carer">
    <h1>{{ carer.name }}</h1>
    <h2>{{ carer.role }}</h2>
    <p>{{ carer.description }}</p>
    <Rating v-model="carer.rating" readonly/>
    <p>Leave a review</p>
    <Button @click="visible = true" label="Submit review" severity="Primary" outlined />
    <Dialog v-model:visible="visible" modal>
        <!-- <span>Submit a Review for {{ carer.name }}</span>
        <InputText></InputText> -->
        <h4>Submit a Review for {{ carer.name }}</h4>
        <div class="spacer">
            <span>Rating</span>
            <Rating v-model="review.rating"/>
        </div>
        <div class="spacer">
            <span>Comments</span>
            <div class="flex items-center gap-4 lg-4">
                <Textarea v-model="review.comments" id="username" class="flex-auto" autocomplete="off" rows="4" cols="50"/>
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