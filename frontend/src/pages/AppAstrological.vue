<template>
  <div class="zodiac-parent">
    <h2>Zodiac Compatibility Checker</h2>
    <!-- Circular customers Images -->


    <!-- PrimeDropdowns for Selecting Zodiac Signs -->
    <div class="flex flex-row gap-8">
      <div class="flex flex-column">
        <div class="mx-1">
          <img
              :src="getZodiacImage(selectedSign1)"
              class="zodiac-image"
              alt="Sign 1"
          />
        </div>
        <PrimeDropdown
            v-model="selectedSign1"
            :options="zodiacSigns"
            optionLabel="name"
            placeholder="Select Zodiac 1"
            class=""
        />
      </div>
      <div class="flex flex-column">
        <div class="">
          <img
              :src="getZodiacImage(selectedSign2)"
              class="zodiac-image"
              alt="Sign 2"
          />
        </div>
        <PrimeDropdown
            v-model="selectedSign2"
            :options="zodiacSigns"
            optionLabel="name"
            placeholder="Select Zodiac 2"
        />
      </div>
    </div>

    <!-- Compatibility Percentage -->
    <div v-if="selectedSign1 && selectedSign2" class="mt-4">
      <h3>Compatibility: {{ compatibilityPercentage }}%</h3>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSign1: null,
      selectedSign2: null,
      compatibilityPercentage: 0,
      zodiacSigns: [
        { name: 'Aries', image: 'https://picsum.photos/200/300' },
        { name: 'Taurus', image: 'https://picsum.photos/200/300' },
        { name: 'Gemini', image: 'https://picsum.photos/200/300' },
        { name: 'Cancer', image: 'https://picsum.photos/200/300' },
        { name: 'Leo', image: 'https://picsum.photos/200/300' },
        { name: 'Virgo', image: 'https://picsum.photos/200/300' },
        { name: 'Libra', image: 'https://picsum.photos/200/300' },
        { name: 'Scorpio', image: 'https://picsum.photos/200/300' },
        { name: 'Sagittarius', image: 'https://picsum.photos/200/300' },
        { name: 'Capricorn', image: 'https://picsum.photos/200/300' },
        { name: 'Aquarius', image: 'https://picsum.photos/200/300' },
        { name: 'Pisces', image: 'https://picsum.photos/200/300' }
      ]
    };
  },
  watch: {
    selectedSign1() {
      this.calculateCompatibility();
    },
    selectedSign2() {
      this.calculateCompatibility();
    }
  },
  methods: {
    getZodiacImage(sign) {
      if (!sign) {
        return require('../assets/default_customer.jpg');
      }
      const zodiac = this.zodiacSigns.find(zodiac => zodiac.name === sign.name);
      return zodiac ? zodiac.image : require('../assets/default_customer.jpg');
    },
    calculateCompatibility() {
      if (this.selectedSign1 && this.selectedSign2) {
        this.compatibilityPercentage = Math.floor(Math.random() * 100) + 1;
      } else {
        this.compatibilityPercentage = 0;
      }
    }
  }
};

</script>

<style scoped>
  @import "../assets/css/Astrological.css";
</style>
