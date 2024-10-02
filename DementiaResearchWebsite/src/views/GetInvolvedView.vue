<template>
  <div class="about">
    <h1>Get Involved</h1>
    <p>
      Dementia Australia is the leading national provider of dementia care services, education, and advocacy for people impacted by dementia.
    </p>

    <!-- Search input for location -->
    <input type="text" v-model="searchQuery" @keydown.enter="searchLocation" placeholder="Search location" />

    <!-- Button to find route -->
    <button @click="findRoute">Find Route to Monash Clayton</button>

    <!-- Map container for displaying the Mapbox map -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import mapboxgl from "mapbox-gl";
import axios from "axios";

// API keys and Monash University Clayton coordinates
const mapboxApiKey = import.meta.env.VITE_MAP_BOX_API_KEY;
const monashCoordinates = [145.1346, -37.9105]; // Coordinates of Monash University Clayton

// Refs to hold search query, map object, and start location
const searchQuery = ref("");
const map = ref(null);
const startCoordinates = ref(null);

// Initialize the map
onMounted(() => {
  map.value = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: monashCoordinates,
    zoom: 15,
    accessToken: mapboxApiKey,
  });

  // Add navigation controls to the map
  map.value.addControl(new mapboxgl.NavigationControl());
});

// Function to search for a location using Mapbox Geocoding API
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
    
    if (response.data.features.length > 0) {
      startCoordinates.value = response.data.features[0].geometry.coordinates;
      map.value.flyTo({
        center: startCoordinates.value,
        zoom: 14,
      });
    } else {
      alert("Location not found.");
    }
  } catch (error) {
    console.error("Error searching location:", error);
  }
};

// Function to find a route from the searched location to Monash University Clayton
const findRoute = async () => {
  if (!startCoordinates.value) {
    alert("Please search for a starting location first.");
    return;
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates.value.join(",")};${monashCoordinates.join(",")}`,
      {
        params: {
          access_token: mapboxApiKey,
          geometries: "geojson",
        },
      }
    );

    const route = response.data.routes[0].geometry;

    // Add route line to the map
    if (map.value.getSource("route")) {
      map.value.getSource("route").setData(route);
    } else {
      map.value.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: route,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
        },
      });
    }
  } catch (error) {
    console.error("Error finding route:", error);
  }
};
</script>

<style>
.about {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.map-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
