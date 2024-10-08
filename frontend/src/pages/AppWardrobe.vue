<script setup lang="ts">

import Carousel from 'primevue/carousel';
import AutoComplete from 'primevue/autocomplete';
import { ref, onMounted } from "vue";
import axios from 'axios';
import router from '../router/index';
import checkToken from '../services/TokenService';
import { useToast } from 'primevue/usetoast';

const API_URL = process.env.VUE_APP_BACKEND_URL;
const selectedCustomer = ref();
const selectedCustomerImage = ref("");
const customers = ref([]);
const isACustomerSelected = ref(false);
const items = ref([]);
const customerClothes = ref({
  hat: [],
  top: [],
  bottom: [],
  shoes: []
});
const token = ref();
const toast = useToast();

const GetCustomers = async () => {
  try {
    const response = await axios.get(API_URL + '/customers', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    });
    return response.data.map(customer => ({
      ...customer,
      fullName: `${customer.name} ${customer.surname}`
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

const GetCustomerImage = async () => {
  try {
    const response = await axios.get(API_URL + '/customers/' + selectedCustomer.value.id + '/image', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    });
    isACustomerSelected.value = true;
    selectedCustomerImage.value = "data:image/png;base64," + response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    isACustomerSelected.value = false;
  }
};

const GetCustomerClothes = async () => {
  try {
    if (!selectedCustomer.value) {
      return;
    }
    const response = await axios.get(API_URL + '/customers/' + selectedCustomer.value.id + '/clothes', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    });
    isACustomerSelected.value = true;
    const clothes = {
      hat: [],
      top: [],
      bottom: [],
      shoes: []
    };
    for (const clothe of response.data) {
      clothe.image = "data:image/png;base64," + clothe.image;
      const typeToCategory = {
        'hat/cap': 'hat',
        'top': 'top',
        'bottom': 'bottom',
        'shoes': 'shoes'
      };

      const category = typeToCategory[clothe.type];
      if (category) {
        clothes[category].push(clothe);
      }
    }
    customerClothes.value = clothes;
  } catch (error) {
    isACustomerSelected.value = false;
    console.error('Error fetching clothes:', error);
  }
};

onMounted(async () => {
  if (!await checkToken()) {
    router.push('/');
    return;
  }
  token.value = localStorage.getItem('token');
  customers.value = await GetCustomers();
  await GetCustomerClothes();
})

const handleCustomerChange = async () => {
  await GetCustomerClothes();
  await GetCustomerImage();
};

const hasNoCustomers = async () => {
  if (customers.value.length === 0) {
    toast.add({ severity: 'error', summary: 'No customers found', detail: 'No customers assigned to you !\n(Contact your manager so that he can assign you some)', life: 5000 });
  }
};

const search = async (event) => {
  hasNoCustomers();
  const query = event.query;
  items.value = customers.value.filter((customer) => {
    const fullName = customer.fullName || '';
    return fullName.toLowerCase().includes(query.toLowerCase());
  });
  for (let customer of items.value) {
    console.log(customer.fullName);
  }
};

</script>

<style scoped>
  html, body {
    font-size: 14px;
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
    width: 200px;
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

  .container {
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
	<AppHeader />

  <div class="px-1 md:px-6">
    <h1>Wardrobe</h1>
  </div>
  <div v-if="!isACustomerSelected" class="px-1 md:px-6 w-full justify-content-center">
    <div class="flex justify-content-center flex-wrap">
      <h2>Search for a customer</h2>
    </div>
  </div>
  <PrimeToast />
  <div class="card flex justify-content-center">
    <AutoComplete v-model="selectedCustomer" forceSelection dropdown :suggestions="items" optionLabel="fullName" @complete="search" @change="handleCustomerChange"/>
  </div>
  <div v-if="isACustomerSelected" class="container">
    <div class="card-carousel">
      <Carousel :value="customerClothes.hat" :numVisible="1" :numScroll="1" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <div class="card-carousel">
      <img v-if="selectedCustomerImage" :src="selectedCustomerImage" alt="Customer Image" class="w-full border-round" />
    </div>
    <div class="card-carousel">
      <Carousel :value="customerClothes.top" :numVisible="1" :numScroll="1" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <div class="card-carousel">
      <Carousel :value="customerClothes.bottom" :numVisible="1" :numScroll="1" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <div class="card-carousel">
      <Carousel :value="customerClothes.shoes" :numVisible="1" :numScroll="1" :circular="true" :showIndicators="false" >
        <template #item="slotProps">
          <div class="carousel-item-container">
            <div class="border-1 surface-border border-round m-2 p-2">
              <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full border-round" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>
