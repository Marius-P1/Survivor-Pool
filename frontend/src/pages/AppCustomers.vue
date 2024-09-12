<script setup lang="ts">
    import axios from 'axios';
    import { ref, onMounted } from 'vue';
    import router from '../router/index';
    import checkToken from '../services/TokenService';
    import { useToast } from 'primevue/usetoast';

	const API_URL = process.env.VUE_APP_BACKEND_URL;
    const value = ref("");
    const items = ref([]);
    const customersData = ref([]);
    const customersList : string[] = [];
    const isACustomertSelected = ref(false);
    const token = ref();
    const toast = useToast();

    onMounted(async () => {
		if (!await checkToken()) {
			router.push('/');
			return;
		}
        token.value = localStorage.getItem('token');
        const response = await axios.get(API_URL + '/customers', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        });
        customersData.value = response.data;

        for (let customer of customersData.value) {
            customersList.push(customer.name + " " + customer.surname);
        }
    });

    const hasNoCustomers = async () => {
        if (customersList.length === 0) {
            toast.add({ severity: 'error', summary: 'No customers found', detail: 'No customers assigned to you !\n(Contact your manager so that he can assign you some)', life: 5000 });
        }
    };

    const search = async (event : any) => {
        hasNoCustomers();
        const query = event.query;
        items.value = customersList.filter((customer) => customer.toLowerCase().includes(query.toLowerCase()));
    };

    const name = ref("");
    const surname = ref("");
    const email = ref("");
    const birthdate = ref("");
    const localisation = ref("");
    const userid = ref("");
    const image = ref("");
    const payments = ref([]);
    const meetings = ref([]);

    const getCustomer = async (event : any) => {
        const value = event.value;
        const customer = customersData.value.find((customer) => (customer.name + " " + customer.surname) === value);
        if (!customer) {
            return;
        }
        try {
            var customerInfo = await axios.get(API_URL + '/customers/' + customer.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                }
            });
            name.value = customerInfo.data.name;
            surname.value = customerInfo.data.surname;
            birthdate.value = customerInfo.data.birthdate;
            localisation.value = customerInfo.data.address;
            email.value = customerInfo.data.email;
            userid.value = customerInfo.data.id;
            isACustomertSelected.value = true;
        } catch (error) {
            console.error(error);
        }
        try {
            var customerImage = await axios.get(API_URL + '/customers/' + customer.id + '/image', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                }
            });
            image.value = "data:image/png;base64," + customerImage.data;
        } catch (error) {
            error.response.status === 404 ? image.value = "" : console.error(error);
        }
        try {
            var customerPayments = await axios.get(API_URL + '/customers/' + customer.id + '/payments', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                }
            });
            payments.value = customerPayments.data;
            console.log(payments.value);
        } catch (error) {
            error.response.status === 404 ? payments.value = [] : console.error(error);
        }
        try {
            var customerMeetings = await axios.get(API_URL + '/customers/' + customer.id + '/encounters', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                }
            });
            meetings.value = customerMeetings.data;
            console.log(meetings.value);
        } catch (error) {
            console.error(error);
        }
    };

</script>

<template >
	<AppHeader />
  <div class="px-1 md:px-6">
    <h1>Customer Details</h1>
  </div>
    <div v-if="!isACustomertSelected" class="px-1 md:px-6 w-full justify-content-center">
      <div class="flex justify-content-center flex-wrap">
        <h2>Search for a customer</h2>
      </div>
      <div class="flex justify-content-center flex-wrap">
        <AutoComplete v-model="value" forceSelection dropdown :suggestions="items" @complete="search" @change="getCustomer" class=""/>
      </div>
    </div>
  <div v-if="isACustomertSelected" class="flex md:flex-row flex-column mx-3">
    <div class="customer-card flex flex-column md:w-3 w-full">
      <div class=" customer-card-content w-full h-full flex flex-column align-items-center justify-content-center pb-2">
        <PrimeAvatar v-if="image" :image="image" size="xlarge" shape="circle" />
        <p v-else>No image</p>
        <span class="font-bold mt-3">{{ name }} {{ surname }}</span>
      </div>
      <hr>
      <div class="customer-card-content w-full h-full flex align-items-center justify-content-center">
        <PrimeButton text icon="pi pi-envelope"></PrimeButton>
        <PrimeButton text icon="pi pi-bookmark"></PrimeButton>
      </div>
      <hr>
      <div class="customer-card-content w-full h-full flex align-items-center justify-content-center ">
        <div class="flex flex-column w-3 align-items-center justify-content-center text-center flex-grow-1 gap-5">
          <span class="font-bold ">0</span>
          <span class="sub-text-info">Total encounters</span>
        </div>

        <div class="flex flex-column w-3 align-items-center justify-content-center text-center flex-grow-1 gap-5">
          <span class="font-bold">20</span>
          <span class="sub-text-info">Positive</span>
        </div>
        <div class="flex flex-column w-3 align-items-center justify-content-center text-center flex-grow-1 gap-5">
          <span class="font-bold">20</span>
          <span class="sub-text-info">In progress</span>
        </div>
      </div>
      <hr>
      <div class="flex flex-column customer-card-content my-3">
        <span class="text-detail-title">Short details</span>
        <div class="flex flex-column mt-3 gap-4">
          <span class="sub-text-info">User ID:</span>
          <span class="text-info">U567Y7</span>
        </div>
        <div class="flex flex-column mt-3 gap-4">
          <span class="sub-text-info">Email:</span>
          <span class="text-info">{{ email }}</span>
        </div>
        <div class="flex flex-column mt-3 gap-4">
          <span class="sub-text-info">Adress:</span>
          <span class="text-info">{{ localisation }}</span>
        </div>
        <div class="flex flex-column mt-3 gap-4">
          <span class="sub-text-info">Last activity:</span>
          <span class="text-info">Not registered</span>
        </div>
        <div class="flex flex-column mt-3 gap-4">
          <span class="sub-text-info">Coach:</span>
          <span class="text-info">Nicolas latoure</span>
        </div>
      </div>
    </div>
    <div class="customer-card w-full flex flex-column mr-3 sm:mt-0 mt-3">
      <div v-if="isACustomertSelected">
        <div class="customer-card-content flex flex-column justify-content-evenly pb-4">
            <h5>Recent meetings</h5>
            <PrimeDataTable :value="meetings" showGridlines scrollable scrollHeight="250px" tableStyle="scrollHeight: 5rem">
              <PrimeColumn field="date" header="Date"></PrimeColumn>
              <PrimeColumn field="rating" header="Rating"></PrimeColumn>
              <PrimeColumn field="comment" header="Report"></PrimeColumn>
              <PrimeColumn field="source" header="Source"></PrimeColumn>
            </PrimeDataTable>
          <div v-if="payments">
            <h5>Payments history</h5>
            <PrimeDataTable :value="payments" showGridlines scrollable scrollHeight="250px" tableStyle="max-height: 5rem">
              <PrimeColumn field="date" header="Date"></PrimeColumn>
              <PrimeColumn field="amount" header="Amount"></PrimeColumn>
              <PrimeColumn field="comment" header="Comment"></PrimeColumn>
            </PrimeDataTable>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


  hr {
    border: 0;
    margin: 0;
    width: 100%;
    border-top: 1px solid #e3e7ee;

  }
  .customer-card {
    background-color: #ffffff;
    border: 1px solid #e3e7ee;
    border-radius: 4px;
    border-size: 1px;
    padding: 10px;
  }

  .sub-text-info{
    font-size: 12px;
    color: #6c757d;
  }

  .text-info{
    font-size: 13px;
    color: #5c6c8a;
  }

  .text-detail-title{
    font-size: 14px;
    letter-spacing: 4px;
    color: #5c6c8a;
  }
  .customer-card-content{
    padding: 10px;
  }
</style>
