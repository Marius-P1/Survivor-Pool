<script setup lang="ts">

import Carousel from 'primevue/carousel';
import Dropdown from 'primevue/dropdown';
import { ref, onMounted } from "vue";
import { ProductService } from './service/ProductService.js';

const selectedCustomer = ref();
  ProductService.getProductsSmall().then((data) => (products.value = data.slice(0, 9)));
const customers = ref([]);
const customerClothes = ref({
  hat: [],
  top: [],
  bottom: [],
  shoes: [],
});

const GetCustomers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/customers', {
      headers: {
        'Content-Type': 'application/json'
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
    const response = await axios.get('http://localhost:3000/customers/' + selectedCustomer.value.id + '/image', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    selectedCustomerImage.value = "data:image/png;base64," + response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

const GetCustomerClothes = async () => {
  try {
    if (!selectedCustomer.value) {
      return;
    }
    const response = await axios.get('http://localhost:3000/customers/' + selectedCustomer.value.id + '/clothes', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const clothes = {
      hat: [],
      top: [],
      bottom: [],
      shoes: []
    };
    for (const clothe of response.data) {
      clothe.image = "data:image/png;base64," + clothe.image;
      if (clothe.type === 'hat/cap') {
        clothes.hat.push(clothe);
      } else if (clothe.type === 'top') {
        clothes.top.push(clothe);
      } else if (clothe.type === 'bottom') {
        clothes.bottom.push(clothe);
      } else if (clothe.type === 'shoes') {
        clothes.shoes.push(clothe);
      }
    }
    customerClothes.value = clothes;
  } catch (error) {
    console.error('Error fetching clothes:', error);
  }
};

onMounted(async () => {
  customers.value = await GetCustomers();
  await GetCustomerClothes();
})

watch(selectedCustomer, async (newCustomer, oldCustomer) => {
  console.log(`Customer changed from ${oldCustomer} to ${newCustomer.name} with id ${newCustomer.id}`);
  await GetCustomerClothes();
  await GetCustomerImage();
});

</script>

<style>
  html, body {
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
    <Dropdown v-model="selectedCustomer" :options="customers" optionLabel="fullName" placeholder="Select a Customer" class="w-full md:w-14rem">
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex align-items-center">
          <div>{{ slotProps.value.fullName }}</div>
        </div>
        <span v-else>
                    {{ slotProps.placeholder }}
                </span>
      </template>
      <template #option="slotProps">
        <div class="flex align-items-center">
          <div>{{ slotProps.option.fullName }}</div>
        </div>
      </template>
    </Dropdown>
  </div>
  <div class="container2">
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
