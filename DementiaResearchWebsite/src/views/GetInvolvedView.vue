<template>
  <div class="about">
    <h1>Get Involved</h1>
    <p>
      Dementia Australia is the leading national provider of dementia care services, education, and advocacy for people impacted by dementia.
    </p>

    <p>Use our map to find the fastest route to get to the Dementia Australia center</p>

    <!-- Search input for location -->
    <input type="text" v-model="searchQuery" @keydown.enter="searchLocation" placeholder="Search location" />

    <!-- Button to find route -->
    <button @click="findRoute">Find Route</button>

    <!-- Map container for displaying the Mapbox map -->
    <div id="mapContainer" ref="mapContainer" class="map-container" style="height: 400px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl'; // Mapbox GL JS
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const mapboxApiKey = import.meta.env.VITE_MAP_BOX_API_KEY;
const dementiaAustraliaCoords = [145.035, -37.824]; // Hawthorn, Victoria coordinates

// Refs and state variables
const map = ref(null);
const searchQuery = ref('');
const userLocation = ref(null);

// Initialize the map
onMounted(() => {
  mapboxgl.accessToken = mapboxApiKey;
  map.value = new mapboxgl.Map({
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/streets-v11', // Mapbox style
    center: dementiaAustraliaCoords, // Initial center at Dementia Australia Hawthorn
    zoom: 14,
  });

  // Add navigation controls (zoom in/out)
  map.value.addControl(new mapboxgl.NavigationControl());
  new mapboxgl.Marker().setLngLat(dementiaAustraliaCoords).addTo(map.value);
});

// Function to search for a location
const searchLocation = async () => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json`,
      {
        params: {
          access_token: mapboxApiKey,
          limit: 1,
        },
      }
    );
    const [longitude, latitude] = response.data.features[0].geometry.coordinates;
    userLocation.value = [longitude, latitude];

    // Set the new center to user's searched location
    map.value.flyTo({
      center: userLocation.value,
      essential: true,
      zoom: 14,
    });

    // Add marker at the user's searched location
    new mapboxgl.Marker().setLngLat(userLocation.value).addTo(map.value);
  } catch (error) {
    console.error('Error searching location:', error);
  }
};

// Function to find a route from user's location to Dementia Australia Hawthorn
const findRoute = async () => {
  if (!userLocation.value) {
    alert('Please search for a location first.');
    return;
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.value[0]},${userLocation.value[1]};${dementiaAustraliaCoords[0]},${dementiaAustraliaCoords[1]}`,
      {
        params: {
          access_token: mapboxApiKey,
          geometries: 'geojson',
        },
      }
    );

    const route = response.data.routes[0].geometry;

    // Add the route to the map as a layer
    if (map.value.getSource('route')) {
      map.value.getSource('route').setData(route);
    } else {
      map.value.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: route,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
        },
      });
    }
  } catch (error) {
    console.error('Error finding route:', error);
  }
};
</script>

<style>
.map-container {
  width: 100%;
  height: 400px;
}
</style>
