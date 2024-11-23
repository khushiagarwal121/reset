<template>
  <div class="section-toggle-container">
    <!-- Headings -->
    <div class="headings">
      <h3
        :class="{ active: currentSection === 'menu' }"
        @click="currentSection = 'menu'"
      >
        Menu Section
      </h3>
      <h3
        :class="{ active: currentSection === 'cuisine' }"
        @click="currentSection = 'cuisine'"
      >
        Cuisine Section
      </h3>
    </div>

    <!-- Content Box -->
    <div class="content">
      <div class="box" v-if="currentSection === 'menu'">
        <p>View the menu items and their details here.</p>
      </div>
      <div class="box" v-if="currentSection === 'cuisine'">
        <restaurantCuisineSection></restaurantCuisineSection>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentSection: "menu", // Default section to display
    };
  },
};
</script>
<style scoped>
.section-toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.headings {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.headings h3 {
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  padding: 10px 20px;
  border-radius: 8px;
  transition: color 0.3s ease, background-color 0.3s ease;
  margin-top: 30px;
}

.headings h3.active {
  background-color: #000000;
  color: #fff;
}

.headings h3:hover {
  background-color: #ccc; /* Light grey background on hover */
  color: #000; /* Optional: Darken text color on hover */
}

.content {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.box {
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: block;
}
</style>
