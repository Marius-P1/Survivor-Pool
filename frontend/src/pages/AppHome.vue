<script setup lang="ts">
	import axios from 'axios';
	import { ref, onMounted } from 'vue';
	import router from '../router/index';
	import checkToken from '../services/TokenService';

	const API_URL = process.env.VUE_APP_BACKEND_URL;
	const sales = ref(0);
	const customers = ref(0);
	const encounters = ref(0);
	const meetings = ref([]);
	const token = ref();

	const getSales = async () => {
		const response = await axios.get(API_URL + '/statistics/totalrevenue', {
			headers : {
				Authorization: `Bearer ${token.value}`
			}
		});
		sales.value = response.data.totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	};

	const getCustomers = async () => {
		const response = await axios.get(API_URL + '/statistics/totalcustomers', {
				headers : {
					Authorization: `Bearer ${token.value}`
				}
			});
		customers.value = response.data.totalCustomers;
	};

	const getEncounters = async () => {
		const response = await axios.get(API_URL + '/statistics/totalevents', {
			headers : {
				Authorization: `Bearer ${token.value}`
			}
		});
		encounters.value = response.data.totalEvents;
	};

	const getMeetings = async () => {
		const response = await axios.get(API_URL + '/statistics/encountersbysource', {
			headers : {
				Authorization: `Bearer ${token.value}`
			}
		});
		meetings.value = response.data;
	};

	onMounted(async () => {
		if (!await checkToken()) {
			router.push('/');
			return;
		}
		token.value = localStorage.getItem('token');
		await getSales();
		await getCustomers();
		await getEncounters();
		await getMeetings();
	});


</script>

<template>
	<AppHeader />

	<div>
		<h1 class="flex justify-content-center font-bold text-4xl md:text-7xl lg:text-8xl m-0">SOUL CONNECTION</h1>
		<h1 class="flex justify-content-center ont-medium text-3xl md:text-7xl m-0"> Dashboard</h1>
	</div>
	<hr />

	<div class="flex flex-column md:gap-4 px-3 lg:px-5 pt-3 lg:pt-5">
		<div class="flex flex-column justify-content-center md:flex-row gap-4 p-2 lg:px-8">
			<PrimeCard class="flex justify-content-center md:w-6">
				<template #title>
					<h1 class="flex justify-content-center align-items-center m-0">
						{{ sales }} €
					</h1>
				</template>
				<template #content>
					<h1 class="flex justify-content-center align-items-center m-0 pb-1">
						SALES
					</h1>
				</template>
			</PrimeCard>

			<PrimeCard class="flex justify-content-center md:w-6">
				<template #title>
					<h1 class="flex justify-content-center align-items-center m-0">
						{{ customers }}
					</h1>
				</template>
				<template #content>
					<h1 class="flex justify-content-center align-items-center m-0 pb-1">
						CUSTOMERS
					</h1>
				</template>
			</PrimeCard>

			<PrimeCard class="flex justify-content-center md:w-6">
				<template #title>
					<h1 class="flex justify-content-center align-items-center m-0">
						{{ encounters }}
					</h1>
				</template>
				<template #content>
					<h1 class="flex justify-content-center align-items-center m-0 pb-1">
						EVENTS
					</h1>
				</template>
			</PrimeCard>
		</div>


		<div class="pb-5 lg:pb-0">
			<h2 class="flex justify-content-center font-bold text-2xl md:text-4xl m-3">Our Customers Meetings</h2>
			<PrimeDataTable :value="meetings" showGridlines scrollable scrollHeight="400px" class="text-base md:text-xl">
				<PrimeColumn field="source" header="Source" headerStyle="background-color: #3e5468" headerClass="text-lg md:text-2xl"></PrimeColumn>
				<PrimeColumn field="avgRating" header="Average Encounters Rating" headerStyle="background-color: #3e5468" headerClass="text-lg md:text-2xl"></PrimeColumn>
				<PrimeColumn field="numberOfEncounters" header="Number of Encounters" headerStyle="background-color: #3e5468" headerClass="text-lg md:text-2xl"></PrimeColumn>
			</PrimeDataTable>
		</div>
	</div>
</template>

<style scoped>
	.p-card {
		background-color: #00be82;
	}
</style>
