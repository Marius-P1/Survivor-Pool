<script setup lang="ts">
    import axios from 'axios';
    import { ref, onMounted } from 'vue';

    const value = ref("");
    const items = ref([]);
    const customersData = ref([]);
    const customersList : string[] = [];
    const isACustomertSelected = ref(false);

    onMounted(async () => {
        const response = await axios.get('http://localhost:3000/customers');
        customersData.value = response.data;

        for (let customer of customersData.value) {
            customersList.push(customer.name + " " + customer.surname);
        }
    });

    const search = async (event : any) => {
        const query = event.query;
        items.value = customersList.filter((customer) => customer.toLowerCase().includes(query.toLowerCase()));
    };

    const name = ref("");
    const surname = ref("");
    const birthdate = ref("");
    const localisation = ref("");
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
            var customerInfo = await axios.get('http://localhost:3000/customers/' + customer.id);
            name.value = customerInfo.data.name;
            surname.value = customerInfo.data.surname;
            birthdate.value = customerInfo.data.birthdate;
            localisation.value = customerInfo.data.address;
            isACustomertSelected.value = true;
        } catch (error) {
            console.error(error);
        }
        try {
            var customerImage = await axios.get('http://localhost:3000/customers/' + customer.id + '/image');
            image.value = "data:image/png;base64," + customerImage.data;
        } catch (error) {
            error.response.status === 404 ? image.value = "" : console.error(error);
        }
        try {
            var customerPayments = await axios.get('http://localhost:3000/customers/' + customer.id + '/payments');
            payments.value = customerPayments.data;
            console.log(payments.value);
        } catch (error) {
            error.response.status === 404 ? payments.value = [] : console.error(error);
        }
        try {
            var customerMeetings = await axios.get('http://localhost:3000/customers/' + customer.id + '/encounters');
            meetings.value = customerMeetings.data;
            console.log(meetings.value);
        } catch (error) {
            console.error(error);
        }
    };

</script>

<template>
    <div>
        <div class="px-1 md:px-6">
            <h1>Customers</h1>
        </div>
        <hr />
        <div>
            <div v-if="!isACustomertSelected" class="px-1 md:px-6 w-full justify-content-center">
                <div class="flex justify-content-center flex-wrap">
                    <h2>Search for a customer</h2>
                </div>
                <div class="flex justify-content-center flex-wrap">
                    <AutoComplete v-model="value" forceSelection dropdown :suggestions="items" @complete="search" @change="getCustomer" class=""/>
                </div>
            </div>
            <div v-else class="flex flex-column justify-content-between px-1 md:px-6 md:flex-row">
                <div class="flex flex-column justify-content-evenly">
                    <div>
                        <AutoComplete v-model="value" forceSelection dropdown :suggestions="items" @complete="search" @change="getCustomer" />
                    </div>
                    <div>
                        <div class="flex flex-row gap-1 md:gap-4">
                            <PrimeAvatar icon="pi pi-user" class="align-self-center"/>
                            <h1 class="align-items-center">{{ name }} {{ surname }}</h1>
                        </div>
                        <div class="flex flex-row gap-1 md:gap-4">
                            <PrimeAvatar icon="pi pi-calendar" class="align-self-center"/>
                            <h2 class="align-items-center">{{ birthdate }}</h2>
                        </div>
                        <div class="flex flex-row gap-1 md:gap-4">
                            <PrimeAvatar icon="pi pi-map" class="align-self-center"/>
                            <h2 class="align-items-center">{{ localisation }}</h2>
                        </div>
                    </div>
                </div>

                <div class="">
                    <img v-if="image" :src="image" alt="image" class="max-w-full" />
                    <p v-else>No image</p>
                </div>
            </div>
        </div>
        <div v-if="isACustomertSelected">
            <hr />
            <div class="flex flex-column justify-content-evenly pb-4 md:flex-row">
                <div v-if="payments">
                    <h2>Payments</h2>
                    <PrimeDataTable :value="payments" showGridlines scrollable scrollHeight="400px" tableStyle="max-width: 40rem">
                        <PrimeColumn field="date" header="Date"></PrimeColumn>
                        <PrimeColumn field="amount" header="Amount"></PrimeColumn>
                        <PrimeColumn field="comment" header="Comment"></PrimeColumn>
                    </PrimeDataTable>
                </div>
                <div>
                    <h2>Meetings</h2>
                    <PrimeDataTable :value="meetings" showGridlines scrollable scrollHeight="400px" tableStyle="max-width: 60rem">
                        <PrimeColumn field="date" header="Date"></PrimeColumn>
                        <PrimeColumn field="rating" header="Rating"></PrimeColumn>
                        <PrimeColumn field="comment" header="Report"></PrimeColumn>
                        <PrimeColumn field="source" header="Source"></PrimeColumn>
                    </PrimeDataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .user-info {

    }
</style>
