<script setup lang="ts">

import Carousel from 'primevue/carousel';
import Dropdown from 'primevue/dropdown';
import { ref, onMounted } from "vue";
import { ProductService } from './service/ProductService.js';

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '1199px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '767px',
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1,
  }
]);

</script>

<style>
  html, body, #app {
    font-size: 14px;
    height: 100%;
    margin: 5px;
    padding: 0;
  }

  body {
    font-family: var(--font-family);
    font-weight: normal;
    background: var(--surface-ground);
    color: var(--text-color);
    padding: 1rem;
    -webkit-font-smoothing: antialiased;
  }

  .card-carousel {
    background: var(--surface-card);
    border-radius: 10px;
    align-items: center;
    margin-top: 0;
    padding: 0;
    margin-bottom: 1%;
    width: 230px;
  }

  p {
    line-height: 1.75;
  }

  .carousel-item-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .container2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .card {
    margin-bottom: 1%;
  }

</style>

<template>
  <div class="card flex justify-content-center">
    <Dropdown v-model="selectedCountry" :options="countries" optionLabel="name" placeholder="Select a Alban" class="w-full md:w-14rem">
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex align-items-center">
          <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
          <div>{{ slotProps.value.name }}</div>
        </div>
        <span v-else>
                    {{ slotProps.placeholder }}
                </span>
      </template>
      <template #option="slotProps">
        <div class="flex align-items-center">
          <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </Dropdown>
  </div>
  <div class="container2">
    <div class="card-carousel">
      <Carousel :value="products" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="require(`@/assets/${slotProps.data.image}`)" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <div class="card-carousel">
      <Carousel :value="products" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="require(`@/assets/${slotProps.data.image}`)" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <div class="card-carousel">
      <Carousel :value="products" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="require(`@/assets/${slotProps.data.image}`)" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <div class="card-carousel">
      <Carousel :value="products" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="require(`@/assets/${slotProps.data.image}`)" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>
