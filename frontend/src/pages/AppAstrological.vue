<template>
	<AppHeader />

  <div class="px-1 md:px-6">
    <h1>Zodiac Compatibility Checker</h1>
  </div>
  <hr />
  <div class="zodiac-parent astro">
    <!-- Circular customers Images -->

    <ProgressSpinner v-if="CustomersList === null" />
    <!-- PrimeDropdowns for Selecting Zodiac Signs -->
    <div class="flex lg:flex-row flex-column justify-content-center align-items-stretch sm:gap-6 lg:gap-4 w-full">
      <div class="flex flex-column align-items-stretch w-12 lg:w-4 gap-1 lg:gap-3 gap-1">
        <div class="sm:mx-1 h-full">
          <div class="card h-full">
            <PrimePanel toggleable class="h-full">
              <template #header>
                <div class="flex flex-wrap align-items-center gap-2">
                  <PrimeAvatar v-if="customerImage1" :image="customerImage1" size="large" shape="circle" />
                  <span class="font-bold">{{ selectedCustomer1 ? selectedCustomer1.fullName : 'Select a customer' }}</span>
                </div>
              </template>
              <template v-if="selectedCustomer1" #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                  <div class="flex align-items-center gap-2">
                    <PrimeButton icon="pi pi-search" rounded text @click="openWikipedia(customerInfo1)"></PrimeButton>
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
      <div class="flex flex-column align-items-stretch w-12 lg:w-4 gap-1 lg:gap-3 sm:mt-0 mt-4">
        <div class="mx-1 h-full">
          <div class="card h-full">
            <PrimePanel toggleable class="h-full">
              <template #header>
                <div class="flex flex-wrap align-items-center gap-2">
                  <PrimeAvatar :image="customerImage2" size="large" shape="circle" />
                  <span class="font-bold">{{ selectedCustomer2 ? selectedCustomer2.fullName : 'Select a customer' }}</span>
                </div>
              </template>
              <template v-if="selectedCustomer2" #footer>
                <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                  <div class="flex align-items-center gap-2">
                    <PrimeButton icon="pi pi-search" rounded text @click="openWikipedia(customerInfo2)"></PrimeButton>
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
    <PrimeButton  severity="help" label="Check Compatibility" class="mt-4" @click="this.calculateCompatibility()"/>

    <!-- Compatibility Percentage -->

    <div v-if="selectedCustomer1 && selectedCustomer2  && isClicked" class="sm:mt-8 mt-6 flex flex-column justify-content-center">
      <div class="flex justify-content-center">
        <PrimeKnob v-model="compatibilityPercentage" readonly :size="200" valueColor="pink" />
      </div>
      <div class="flex justify-content-center">
        <h3>{{customerInfo1.astrological_sign}} & {{customerInfo2.astrological_sign}}</h3>
      </div>
      <div class="text-center flex align-items-center justify-content-center">
        <h4>{{ zodiacCompatibilityDescription }}</h4>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import PrimePanel from "@/main";
import PrimeAvatar from "@/main";
import defaultAvatar from '@/assets/default-avatar.jpg';
import zodiacCompatibilityPairs from '@/assets/zodiac_compatibility_pairs.json';


export default {
  components: {PrimeAvatar, PrimePanel},
  data() {
    return {
      selectedCustomer1: null,
      selectedCustomer2: null,
      customerImage1: null,
      customerImage2: null,
      zodiacCompatibilityDescription: null,
      compatibilityPercentage: 0,
      isClicked: false,
      CustomersList: null,
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
        return;
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
    openWikipedia(customerInfo) {
      const sign = customerInfo.astrological_sign;
      const url = `https://en.wikipedia.org/wiki/${sign}_(astrology)`;
      window.open(url, '_blank');
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
        const zodiacPair = `${this.customerInfo1.astrological_sign} & ${this.customerInfo2.astrological_sign}`;
        const compatibility = zodiacCompatibilityPairs.find(pair => pair.Zodiacs === zodiacPair);
        this.zodiacCompatibilityDescription = compatibility.Description;
        this.isClicked = true;
        if (compatibility) {
          this.compatibilityPercentage = parseInt(compatibility.Percentage);
        } else {
          this.compatibilityPercentage = 0;
        }
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
        this.CustomersList = null;
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
  .zodiac-parent {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 2rem;
  }

  .astro {
    font-size: 20px !important;
    font-weight: normal;
    color: var(--text-color);
    padding: 1rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }


  @media (max-width: 600px) {
    .astro {
      padding: 0;
      font-size: 17px !important;
    }
    .zodiac-parent {
      margin: 0;
    }
    .card {
      border-radius: 0px;
      padding: 0;
      margin: 0;
    }
  }
  .card {
    background: var(--surface-card);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.75;
  }
</style>
