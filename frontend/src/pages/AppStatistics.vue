<template style="height:100%;" class="stats">
  <div class="px-1 md:px-6">
    <h1>Statistics</h1>
  </div>
  <hr />
  <div class="flex flex-row gap-2 flex-wrap justify-content-center">
    <PrimePanel v-for="coach in coachList" :key="coach.id" class="w-6 md:w-4 xl:w-3 flex-grow-1 card h-full" style="box-shadow: 5px 5px 10px 2px rgb(0 0 0 / .2);">

      <!-- Header -->
      <template #header>
        <div class="flex w-full align-items-center flex-grow-1 gap-2">
          <PrimeAvatar :image="coach.image" size="large" shape="circle" />
          <span class=" font-bold">{{coach.name}} </span>
          <div class="flex justify-content-end gap-3 ml-auto">
            <span class="p-text-secondary flex ">{{coach.client_nb}} customers</span>
          </div>
        </div>
      </template>

      <!-- Content -->
      <div class="flex flex-column align-items-center justify-content-center gap-0">

        <!-- Event type -->
        <div class="w-full h-full flex align-items-center justify-content-center pb-2 ">
          <PrimeChart type="radar" :data="eventChartData[coach.id]" :options="eventChartOptions" :width="300" :height="210" class="flex align-items-center" />        </div>

        <!-- Statistics client nb/ meetings / events -->
        <div class="flex px-3 justify-content-center md:flex-row gap-4 mb-5 w-full">
          <PrimeCard :class="[getCardBgClass(coach.event_nb), 'flex', 'justify-content-center', 'w-6']">
            <template #content>
              <h5 class="flex justify-content-center align-items-center m-0 pb-1">
                Events
              </h5>
              <h6 class="flex justify-content-center align-items-center m-0 pb-1">
                {{coach.event_nb}} Events
              </h6>
            </template>
          </PrimeCard>
          <PrimeCard class="bg-gray-300 flex justify-content-center w-6">
            <template #content>
              <h6 class="flex justify-content-center align-items-center m-0 pb-1">
                Meetings
              </h6>
            </template>
          </PrimeCard>
        </div>

        <!-- Statistics of the payment realised by the coach by month -->
        <div class=" w-full h-full flex align-items-center ">
          <PrimeChart type="line" :data="paymentChartData" :options="paymentChartOptions" class="h-10rem w-full" />
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
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const eventChartData = ref();
    const eventChartOptions = ref();
    const paymentChartData = ref();
    const paymentChartOptions = ref();

    onMounted(() => {
      eventChartData.value = setEventChartData();
      eventChartOptions.value = setEventChartOptions();
      paymentChartData.value = setPaymentChartData();
      paymentChartOptions.value = setPaymentChartOptions();

    });

    const setPaymentChartData = () => {
      const documentStyle = getComputedStyle(document.documentElement);

      return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Dataset 1',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--cyan-500'),
            yAxisID: 'y',
            tension: 0.4,
            data: [65, 59, 80, 81, 56, 55, 10]
          },
          {
            label: 'Dataset 2',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--gray-500'),
            yAxisID: 'y1',
            tension: 0.4,
            data: [28, 48, 40, 19, 86, 27, 90]
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
            display: true,
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
    }

    const setEventChartData = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      return {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
          {
            label: 'My First dataset',
            borderColor: documentStyle.getPropertyValue('--bluegray-400'),
            pointBackgroundColor: documentStyle.getPropertyValue('--bluegray-400'),
            pointBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
            pointHoverBackgroundColor: textColor,
            pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
            data: [65, 59, 90, 81, 56, 55, 40]
          },
          {
            label: 'My Second dataset',
            borderColor: documentStyle.getPropertyValue('--pink-400'),
            pointBackgroundColor: documentStyle.getPropertyValue('--pink-400'),
            pointBorderColor: documentStyle.getPropertyValue('--pink-400'),
            pointHoverBackgroundColor: textColor,
            pointHoverBorderColor: documentStyle.getPropertyValue('--pink-400'),
            data: [28, 48, 40, 19, 96, 27, 100]
          }
        ]
      };
    };

    const setEventChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

      return {
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          r: {
            grid: {
              color: textColorSecondary
            }
          }
        }
      };
    };
    return { eventChartData, eventChartOptions, paymentChartData, paymentChartOptions };
  }
});
</script>

<style scoped>

.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
</style>