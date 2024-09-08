<template>
  <div class="zodiac-parent">
    <h2>Zodiac Compatibility Checker</h2>
    <!-- Circular customers Images -->

    <!-- PrimeDropdowns for Selecting Zodiac Signs -->
    <div class="flex flex-row gap-8">
      <div class="flex flex-column">
        <div class="mx-1">
          <div class="card">
            <PrimePanel toggleable>
              <template #header>
                <div class="flex align-items-center gap-2">
                  <PrimeAvatar :image="selectedCustomer1 ? getCustomerImage(selectedCustomer1) : 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" size="large" shape="circle" />
                  <span class="font-bold">{{ selectedCustomer1 ? selectedCustomer1.fullName : 'Customer Name' }}</span>
                </div>
              </template>
              <template #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                  <div class="flex align-items-center gap-2">
                    <PrimeButton icon="pi pi-user" rounded text></PrimeButton>
                    <PrimeButton icon="pi pi-bookmark" severity="secondary" rounded text></PrimeButton>
                  </div>
                  <span class="p-text-secondary">Updated 2 hours ago</span>
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
      <div class="flex flex-column">
        <div class="">
          <div class="card">
            <PrimePanel toggleable>
              <template #header>
                <div class="flex align-items-center gap-2">
                  <PrimeAvatar :image="selectedCustomer2 ? getCustomerImage(selectedCustomer2) : 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" size="large" shape="circle" />
                  <span class="font-bold">{{ selectedCustomer2 ? selectedCustomer2.fullName : 'Customer Name' }}</span>
                </div>
              </template>
              <template #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                  <div class="flex align-items-center gap-2">
                    <PrimeButton icon="pi pi-user" rounded text></PrimeButton>
                    <PrimeButton icon="pi pi-bookmark" severity="secondary" rounded text></PrimeButton>
                  </div>
                  <span class="p-text-secondary">Updated 2 hours ago</span>
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
    <PrimeButton label="Check Compatibility" class="mt-4" @click="GetCustomers"/>

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

export default {
  components: {PrimeAvatar, PrimePanel},
  data() {
    return {
      selectedCustomer1: null,
      selectedCustomer2: null,
      compatibilityPercentage: 0,
      CustomersList: [],
      customerInfo1: {},
      customerInfo2: {}
    };
  },
  watch: {
    selectedCustomer1(newCustomer) {
      this.calculateCompatibility();
      if (newCustomer) {
        this.getCustomerInfo(newCustomer.id, 'customerInfo1');
      }
    },
    selectedCustomer2(newCustomer) {
      this.calculateCompatibility();
      if (newCustomer) {
        this.getCustomerInfo(newCustomer.id, 'customerInfo2');
      }
    }
  },
  methods: {
    getCustomerImage(customer) {
      if (!customer) {
        return require('../assets/default_customer.jpg');
      }
      return `data:image/png;base64,http://localhost:3000/customers/${customer.id}/image`;
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
  }
};
</script>

<style scoped>
  @import "../assets/css/Astrological.css";
</style>