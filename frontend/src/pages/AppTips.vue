<script setup lang="ts">

import axios from 'axios';
import Card from 'primevue/card';
import { ref, onMounted } from 'vue';
import router from '../router/index';
import checkToken from '../services/TokenService';

const API_URL = process.env.VUE_APP_BACKEND_URL;
const tips = ref([]);
const token = ref();

const GetTips = async () => {
  try {
    const response = await axios.get(API_URL + '/tips', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    });
    tips.value = response.data;
  } catch (error) {
    console.error('Error fetching tips:', error);
  }
};

onMounted(async () => {
  if (!await checkToken()) {
    router.push('/');
    return;
  }
  token.value = localStorage.getItem('token');
  await GetTips();
});

</script>

<style scoped>

  .p-card {
    height: 100%;
  }

  .card-tips {
    display: grid;
    border-radius: 30px;
    width: 100%;
    margin: 10px;
    padding: 0;
  }

  .cards-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .card-content {
    overflow: auto;
    width: 100%;
    position: relative;
  }

  .card-footer {
    text-align: right;
    padding: 0;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .card-date {
    margin: 5px;
  }

  .left-padding {
    padding-left: 3rem;
  }

  .right-padding {
    padding-right: 3rem;
  }

  @media (min-width: 600px) {
    .card-tips {
      width: 45%;
    }
    .left-padding {
      padding-left: 2rem;
    }
    .right-padding {
      padding-right: 2rem;
    }
  }

  @media (max-width: 600px) {
    .left-padding {
      padding-left: 1rem;
    }
    .right-padding {
      padding-right: 1rem;
    }
  }

  @media (min-width: 900px) {
    .card-tips {
      width: 30%;
    }
  }

  @media (min-width: 1200px) {
    .card-tips {
      width: 22%;
    }
  }

  @media (min-width: 1500px) {
    .card-tips {
      width: 18%;
    }
    .left-padding {
      padding-left: 3rem;
    }
    .right-padding {
      padding-right: 3rem;
    }
  }

  .header-bar {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  
</style>

<style>

  .p-accordion-content {
    padding: 10px;
    margin-top: 2px;
    margin-bottom: 5px;
    border-radius: 5px;
  }

</style>

<template>
	<AppHeader />

  <div class="left-padding header-bar">
    <h1>Tips for Coaches</h1>
  </div>
  <div class="left-padding right-padding">
    <PrimeAccordion :multiple="true">
      <PrimeAccordionTab v-for="tip in tips" :key="tip.id" :header="tip.title">
        <span>
          {{ tip.tip }}
        </span>
      </PrimeAccordionTab>
    </PrimeAccordion>
  </div>
</template>
