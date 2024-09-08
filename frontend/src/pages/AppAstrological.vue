<template>
  <div class="zodiac-parent">
    <h2>Zodiac Compatibility Checker</h2>
    <!-- Circular customers Images -->

    <!-- PrimeDropdowns for Selecting Zodiac Signs -->
    <div class="flex flex-row gap-2">
      <div class="flex flex-column flex-1">
        <div class="mx-1">
          <div class="card">
            <PrimePanel toggleable>
              <template #header>
                <div class="flex align-items-center gap-2">
                  <PrimeAvatar v-if="customerImage1" :image="customerImage1" size="large" shape="circle" />
                  <span class="font-bold">{{ selectedCustomer1 ? selectedCustomer1.fullName : 'Customer Name' }}</span>
                </div>
              </template>
              <template #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                  <div class="flex align-items-center gap-2">
                    <PrimeButton icon="pi pi-search" rounded text></PrimeButton>
                  </div>
                  <span class="p-text-secondary" v-if="selectedCustomer1" >Zodiac: {{customerInfo1.astrological_sign}} </span>
                </div>
              </template>
              <p class="m-0" v-if="selectedCustomer1">
                {{ customerInfo1.description }}
              </p>
            </PrimePanel>
          </div>
        </div>
        <PrimeDropdown
            v-model="selectedCustomer1"
            :options="CustomersList"
            optionLabel="fullName"
            placeholder="Select Customer A"
            class=""
        />
      </div>
      <div class="flex flex-column flex-1">
        <div class="">
          <div class="card">
            <PrimePanel toggleable>
              <template #header>
                <div class="flex align-items-center gap-2">
                  <PrimeAvatar :image="customerImage2" size="large" shape="circle" />
                  <span class="font-bold">{{ selectedCustomer2 ? selectedCustomer2.fullName : 'Customer Name' }}</span>
                </div>
              </template>
              <template #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                  <div class="flex align-items-center gap-2">
                    <PrimeButton icon="pi pi-search" rounded text></PrimeButton>
                  </div>
                  <span class="p-text-secondary" v-if="selectedCustomer2">Zodiac: {{customerInfo2.astrological_sign}} </span>
                </div>
              </template>
              <p class="m-0" v-if="selectedCustomer2">
                {{ customerInfo2.description }}
              </p>
            </PrimePanel>
          </div>
        </div>
        <PrimeDropdown
            v-model="selectedCustomer2"
            :options="CustomersList"
            optionLabel="fullName"
            placeholder="Select Customer B"
        />
      </div>
    </div>
    <PrimeButton label="Check Compatibility" class="mt-4" @click="this.calculateCompatibility()"/>

    <!-- Compatibility Percentage -->
    <div v-if="selectedCustomer1 && selectedCustomer2" class="mt-4">
      <h3>Compatibility: {{ compatibilityPercentage }}%</h3>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import PrimePanel from "@/main";
import PrimeAvatar from "@/main";
import defaultAvatar from '@/assets/default-avatar.jpg';

export default {
  components: {PrimeAvatar, PrimePanel},
  data() {
    return {
      selectedCustomer1: null,
      selectedCustomer2: null,
      customerImage1: null,
      customerImage2: null,
      compatibilityPercentage: 0,
      CustomersList: [],
      customerInfo1: {},
      customerInfo2: {}
    };
  },
  watch: {
    selectedCustomer1(newCustomer) {
      if (newCustomer) {
        this.getCustomerInfo(newCustomer.id, 'customerInfo1');
        this.getCustomerImage(newCustomer, 'customerImage1');
      }
    },
    selectedCustomer2(newCustomer) {
      if (newCustomer) {
        this.getCustomerInfo(newCustomer.id, 'customerInfo2');
        this.getCustomerImage(newCustomer, 'customerImage2');
      }
    }
  },
  methods: {
    async getCustomerImage(customer, infoProp) {
      if(!customer) {
        this[infoProp] = defaultAvatar;
      }
      try {
        const response = await axios.get(`http://localhost:3000/customers/${customer.id}/image`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this[infoProp] = "data:image/png;base64," + response.data;
      } catch (error) {
        console.error('Error fetching customer image:', error);
      }
    },
    async getCustomerInfo(id, infoProp) {
      try {
        const response = await axios.get(`http://localhost:3000/customers/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this[infoProp] = response.data;
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    },
    calculateCompatibility() {
      if (this.selectedCustomer1 && this.selectedCustomer2) {
        this.compatibilityPercentage = Math.floor(Math.random() * 100) + 1;
      } else {
        this.compatibilityPercentage = 0;
      }
    },
    async GetCustomers() {
      try {
        const response = await axios.get('http://localhost:3000/customers', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.CustomersList = response.data.map(customer => ({
          ...customer,
          fullName: `${customer.name} ${customer.surname}`
        }));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }
  },
  mounted() {
    this.GetCustomers();
    this.getCustomerImage(this.selectedCustomer1, 'customerImage1');
    this.getCustomerImage(this.selectedCustomer2, 'customerImage2');
  }
};
</script>

<style scoped>
  @import "../assets/css/Astrological.css";
</style>