<template style="height:100%;" class="stats">
  <AppHeader></AppHeader>
  <div class="px-1 md:px-6">
    <h1>Statistics</h1>
  </div>
  <div class="flex flex-row gap-2 flex-wrap justify-content-center">
    <PrimePanel v-for="coach in coachList" :key="coach.id" class="w-6 md:w-4 xl:w-3 flex-grow-1 card h-full" style="box-shadow: 5px 5px 10px 2px rgb(0 0 0 / .2);">

      <!-- Header -->
      <template #header>
        <div class="flex w-full align-items-center flex-grow-1 gap-2">
          <PrimeAvatar :image="coach.image" size="large" shape="circle" />
          <span class=" font-bold">{{coach.name}} </span>
          <div class="flex justify-content-end gap-3 ml-auto">
            <span class="p-text-secondary flex ">{{coach.customer_nb}} customers</span>
          </div>
        </div>
      </template>

      <!-- Content -->
      <div class="flex flex-column align-items-center justify-content-center gap-0">

        <!-- Event type -->
        <div class="w-full h-full flex align-items-center justify-content-center pb-2 ">
          <PrimeChart type="radar" :data="eventChartData[coach.id]" :options="eventChartOptions" :width="300" :height="210" class="flex align-items-center" />
        </div>

        <!-- Statistics client nb/ meetings / events -->
        <div class="flex px-3 justify-content-center md:flex-row gap-4 mb-5 w-full">
          <PrimeCard :class="[getCardBgClass(coach.event_nb), 'flex', 'justify-content-center', 'w-6']">
            <template #content>
              <h6 class="flex justify-content-center align-items-center m-0 pb-1">
                {{coach.event_nb}} Events
              </h6>
            </template>
          </PrimeCard>
          <PrimeCard :class="[getCardBgClass(coach.meeting_nb), 'flex', 'justify-content-center', 'w-6']">
            <template #content>
              <h6 class="flex justify-content-center align-items-center m-0 pb-1">
                {{coach.meeting_nb}} Meetings
              </h6>
            </template>
          </PrimeCard>
        </div>

        <!-- Statistics of the payment realised by the coach by month -->
        <div class=" w-full h-full flex align-items-center ">
          <PrimeChart type="line" :data="paymentChartData[coach.id]" :options="paymentChartOptions" class="h-10rem w-full" />
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-content-end gap-3">
          <span class="p-text-secondary flex ">Last event: 2 hours ago</span>
        </div>
      </template >

    </PrimePanel>

  </div>

</template>

<script lang="ts">
import { ref, onMounted, defineComponent, computed} from "vue";
import axios from "axios";
import checkToken from "@/services/TokenService";
import router from "@/router";
import AppHeader from "@/components/AppHeader.vue";

const API_URL = process.env.VUE_APP_BACKEND_URL;
const token = ref('');

export default defineComponent({
  components: {AppHeader},
  setup() {
    const eventChartData = ref<{ [key: number]: any }>({});
    const eventChartOptions = ref();
    const paymentChartData = ref<{ [key: number]: any }>({});
    const paymentChartOptions = ref();
    const coachList = ref<{ id: number, name: string, image: string, customer_nb: number, event_nb: number, meeting_nb: number}[]>([]);
    const eventsData = ref<any[]>([]);
    const paymentData = ref<any[]>([]);
    const customerClientId = ref<any[]>([]);

    interface Event {
      id: number;
      createdAt: string;
      updatedAt: string;
      name: string;
      date: string;
      max_participants: number;
      location_x: string;
      location_y: string;
      type: string;
      employee_id: number;
      location_name: string;
      duration: number;
    }

    onMounted(async () => {
      if (!await checkToken()) {
        router.push('/');
        return;
      }
      token.value = localStorage.getItem('token') || '';
      await getCoachList();
      await getEventsData();

      await Promise.all(coachList.value.map(async (coach) => {
        eventChartData.value[coach.id] = setEventChartData(coach);
        paymentChartData.value[coach.id] = await setPaymentChartData(coach);
      }));

      eventChartOptions.value = setEventChartOptions();
      paymentChartOptions.value = setPaymentChartOptions();
    });

    async function getCoachList() {
      try {
        const response = await axios.get(`${API_URL}/employee`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        });

        // Ensure response.data is always an array
        const employees = Array.isArray(response.data) ? response.data : [response.data];
        const coaches = employees.filter((employee: { work: string }) => employee.work === 'Coach');

        for (const coach of coaches) {
          const image = await getEmployeeImage(coach.id);
          await getCustomerIdByCoach(coach.id);
          const meeting = await getMeetingNumberByCoach(coach.id);
          coachList.value.push({
            id: coach.id,
            name: coach.name + ' ' + coach.surname,
            image: image,
            customer_nb: customerClientId.value[coach.id] ? customerClientId.value[coach.id].length : 0,
            event_nb: 0,
            meeting_nb: meeting
          });
          coachList.value.sort((a, b) => b.customer_nb - a.customer_nb);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    }

    async function getMeetingNumberByCoach(employeeId: number) {
      try {
        const response = await axios.get(`${API_URL}/employee/${employeeId}/encounter/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        });
        console.log(response.data)
        return response.data.encounters;
      } catch (error) {
        console.error('Error fetching meetings:', error);
        return 0;
      }
    }

    async function getCustomerIdByCoach(employeeId: number) {
      try {
        const response = await axios.get(`${API_URL}/employee/${employeeId}/customersList/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        });
        for (const customer of response.data) {
          if (!customerClientId.value[employeeId]) {
            customerClientId.value[employeeId] = [];
          }
          customerClientId.value[employeeId].push(customer.id);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }

    async function getEmployeeImage(employeeId: number): Promise<string> {
      try {
        const response = await axios.get(`${API_URL}/employee/${employeeId}/image`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        });
        return "data:image/png;base64," + response.data;
      } catch (error) {
        console.error('Error fetching employee image:', error);
        return ''; // Return an empty string or a default image URL in case of an error
      }
    }

    async function getPaymentData(employeeId: number) {
      try {
        const response = await axios.get(`${API_URL}/employee/${employeeId}/stats`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        });

        const payments = response.data;
        const monthlySums = new Array(12).fill(0);

        payments.forEach((payment: { amount: number; date: string }) => {
          const monthIndex = new Date(payment.date).getMonth();
          monthlySums[monthIndex] += payment.amount;
        });

        return monthlySums;
      } catch (error) {
        console.error('Error fetching payment data:', error);
        return new Array(12).fill(0);
      }
    }

    const setPaymentChartData = async (coach: { id: number; name: string }) => {
      const documentStyle = getComputedStyle(document.documentElement);

      const data = await getPaymentData(coach.id);
      console.log(data)

      return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'august', 'september', 'october', 'november', 'december'],
        datasets: [
          {
            label: 'Dataset 2',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--gray-500'),
            yAxisID: 'y',
            tension: 0.4,
            data: data
          }
        ]
      };
    };

    const setPaymentChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      return {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y1: {
            type: 'linear',
            display: false,
            position: 'right',
            ticks: {
              color: textColorSecondary
            },
            grid: {
              drawOnChartArea: false,
              color: surfaceBorder
            }
          }
        }
      };
    };

    async function getEventsData() {
      try {
        const response = await axios.get(`${API_URL}/events`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        });

        const events: Event[] = response.data;

        // Group events by employee and count occurrences of each event type
        const employeeEvents: { [key: number]: { [key: string]: number } } = {};

        events.forEach((event: Event) => {
          coachList.value.forEach(coach => {
            if (coach.id === event.employee_id) {
              coach.event_nb++;
            }
          });
          if (!employeeEvents[event.employee_id]) {
            employeeEvents[event.employee_id] = {};
          }
          if (!employeeEvents[event.employee_id][event.type]) {
            employeeEvents[event.employee_id][event.type] = 0;
          }
          employeeEvents[event.employee_id][event.type]++;
        });

        // Format the result
        const result = Object.keys(employeeEvents).map(employeeId => {
          const types = Object.keys(employeeEvents[parseInt(employeeId)]).map(type => ({
            type,
            count: employeeEvents[parseInt(employeeId)][type]
          }));

          return {
            employee_id: parseInt(employeeId),
            types
          };
        });

        eventsData.value = result; // Store the result in the reactive variable
        return result;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }



    const setEventChartData = (coach: { id: number; name: string }) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const coachEvents = eventsData.value.find(event => event.employee_id === coach.id);

      return {
        labels: coachEvents ? coachEvents.types.map((event: { type: string; count: number }) => event.type) : [],
        datasets: [
          {
            label: '',
            borderColor: documentStyle.getPropertyValue('--pink-300'),
            pointBackgroundColor: documentStyle.getPropertyValue('--pink-400'),
            pointBorderColor: documentStyle.getPropertyValue('--pink-500'),
            pointHoverBackgroundColor: textColor,
            pointHoverBorderColor: documentStyle.getPropertyValue('--pink-600'),
            data: coachEvents ? coachEvents.types.map((event: { type: string; count: number }) => event.count) : []
          }
        ]
      };
    };

    const setEventChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

      return {
        responsive: false,
        plugins: {
          datalabels: false,
          legend: {
            display: false,
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          r: {
            suggestedMin: 0,
            grid: {
              color: textColorSecondary
            }
          }
        }
      };
    };

    const getCardBgClass = (eventNb: number) => {
      if (eventNb > 5) return 'bg-green-300';
      if (eventNb > 2) return 'bg-yellow-300';
      return 'bg-red-300';
    };

    return { eventChartData, eventChartOptions, paymentChartData, paymentChartOptions, coachList, getCardBgClass };
  }
});
</script>

<style scoped>

</style>
