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
  const meetingSum = ref(0);

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

  const getMeetingsSum = async () => {
    let sum = 0;
    meetings.value.forEach(meeting => {
      sum += meeting.numberOfEncounters;
    });
    return sum;
  }

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
    radarData.value = setRadarData();
    radarOptions.value = setRadarOptions();
    meetingSum.value = await getMeetingsSum();
  });

  const radarData = ref();
  const radarOptions = ref(null);

  const setRadarData = () => {

    return {
      labels: meetings.value.map(meeting => meeting.source),
      datasets: [
        {
          data: meetings.value.map(meeting => meeting.numberOfEncounters),
        }
      ]
    };
  };

  const setRadarOptions = () => {
    return {
      plugins: {
        legend: false,
      }
    };
  };

</script>


<style scoped>
  .p-card {
    background-color: #00be82;
  }

  .header {
    align-items: end;
    margin-left: 2rem;
    margin-right: 2rem;
    padding: 0;
  }

  .dashboard-title {
    margin-left: 2rem;
    margin-right: 2rem;
  }

  .dashboard-btn {
    margin-left: 10px;
    margin-right: 10px;
  }

  .report-btn {
    border: none;
    background-color: #007ad9;
  }

  .last-days-btn {
    background-color: #ffffff;
    color: #1b1c37;
  }

  .dashboard-info-boxes {
    background-color: #007ad9;
    color: #ffffff;
  }

  .meetings-chart {
    background-color: #ffffff;
    border-radius: 15px;
    padding: 30px;
  }

</style>


<template>
	<AppHeader />

	<div>
		<h1 class="dashboard-title"> Dashboard</h1>
    <div class="header">
      <h4> Welcome !</h4>
    </div>
	</div>
	<div class="flex flex-column md:gap-4 px-3 lg:px-5 pt-3 lg:pt-5">
		<div class="flex flex-column justify-content-center md:flex-row gap-4 p-2 lg:px-8">
			<PrimeCard class="dashboard-info-boxes flex justify-content-center md:w-6">
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

			<PrimeCard class="dashboard-info-boxes flex justify-content-center md:w-6">
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

      <PrimeCard class="dashboard-info-boxes flex justify-content-center md:w-6">
        <template #title>
          <h1 class="flex justify-content-center align-items-center m-0">
            {{ meetingSum }}
          </h1>
        </template>
        <template #content>
          <h1 class="flex justify-content-center align-items-center m-0 pb-1">
            MEETINGS
          </h1>
        </template>
      </PrimeCard>

			<PrimeCard class="dashboard-info-boxes flex justify-content-center md:w-6">
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

    <div class="meetings-chart">
      <h2 class="flex justify-content-center font-bold text-2xl md:text-4xl m-3">Meetings by Source</h2>
      <div class="card flex justify-content-center">
        <PrimeChart type="radar" :data="radarData" :options="radarOptions" class="w-full md:w-30rem" />
      </div>
    </div>
	</div>
</template>
