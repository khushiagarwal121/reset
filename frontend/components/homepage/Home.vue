<template>
  <div>
    <!-- top banner  -->
    <Banner />

    <!-- slidbar for dishes  -->
    <div
      width="100%"
      class="hello mt-7 d-flex flex-column align-center justify-center"
      color="primary"
    >
      <div class="text-h5 mb-5 mt-4 font-weight-bold">
        Eat what makes you happy
      </div>
      <SlideBar :items="dishes" />
    </div>

    <!-- slidebar for top brands   -->
    <div
      width="100%"
      class="hello mt-7 d-flex flex-column align-center justify-center"
      color="primary"
    >
      <div class="text-h5 mb-5 mt-4 font-weight-bold">Top brands</div>
      <SlideBar :items="topBrands" />
    </div>
    <div class="mt-15 d-flex flex-column align-center justify-center">
      <div class="text-h4 font-weight-bold">Top Restaurant Near You</div>

      <!-- restaurant section  -->
      <v-container fluid class="d-flex flex-wrap justify-center">
        <v-col
          v-for="restaurant in restaurants"
          class="ma-4"
          md="3"
          sm="4"
          cols="12"
          :key="restaurant"
        >
          <RestaurantCard :restaurant="restaurant" />
        </v-col>
      </v-container>
    </div>
  </div>
</template>

<script>
import Banner from "./Banner.vue";
import RestaurantCard from "./RestaurantCard.vue";
import SlideBar from "./SlideBar.vue";

export default {
  components: { Banner, RestaurantCard, SlideBar },
  data() {
    return {
      dishes: [
        {
          title: "Burger",
        },
        {
          title: "Biryani",
        },
        {
          title: "Cake",
        },
        {
          title: "Sandwich",
        },
        {
          title: "Momos",
        },
        {
          title: "Noodles",
        },
        {
          title: "Paneer",
        },
        {
          title: "Thali",
        },
        {
          title: "Rolls",
        },
        {
          title: "Veg Meal",
        },
        {
          title: "North Indian",
        },
        {
          title: "Pizza",
        },
      ],

      topBrands: [
        {
          title: "McDonald's",
        },
        {
          title: "KFC",
        },
        {
          title: "Pizza Hut",
        },
        {
          title: "Subway",
        },
        {
          title: "Domino's Pizza",
        },
        {
          title: "Starbucks",
        },
        {
          title: "Burger King",
        },
        {
          title: "Dunkin'",
        },
        {
          title: "Chipotle",
        },
        {
          title: "Panda Express",
        },
        {
          title: "Taco Bell",
        },
      ],
      restaurants: [
        { id: 1, name: "The Spice House", cuisine: ["North Indian", "Burger"] },
        { id: 2, name: "Green Garden Cafe", cuisine: ["South Indian"] },
        { id: 3, name: "Sunset Grill" },
        { id: 4, name: "The Pasta Place" },
        { id: 5, name: "Grill and Chill" },
        { id: 6, name: "Sushi Corner" },
        { id: 7, name: "The Burger Joint" },
        { id: 8, name: "Farm to Table" },
        { id: 9, name: "Taste of India" },
        { id: 10, name: "Ocean's Catch" },
        { id: 11, name: "BBQ Nation" },
        { id: 12, name: "Pasta Palace" },
      ],
    };
  },
};
</script>
