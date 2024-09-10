<script setup lang="ts">

import axios from 'axios';
import Card from 'primevue/card';
import { ref, onMounted } from 'vue';

const tips = ref([]);

const GetTips = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tips', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    tips.value = response.data;
  } catch (error) {
    console.error('Error fetching tips:', error);
  }
};

onMounted(() => {
  GetTips();
});

</script>

<style scoped>

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
}

.p-card-body {
  height: 100%;
  position: relative;
}

.p-card-footer {
  padding: 0;
  position: absolute;
  bottom: 0;
  right: 0;
}

.card-footer {
  text-align: right;
}

.card-date {
  margin: 5px;
}

@media (min-width: 600px) {
  .card-tips {
    width: 45%;
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
}
</style>

<template>
  <div class="px-1 md:px-6">
    <h1>Tips</h1>
  </div>
  <hr />
  <div class="cards-container">
    <div v-for="tip in tips" :key="tip.id" class="card-tips">
      <Card class="card-content">
        <template #title> {{ tip.title }}</template>
        <template #content>
          <p class="m-0"> {{ tip.tip }} </p>
        </template>
        <template #footer>
          <div class="card-footer">
            <p class="card-date">{{ tip.updatedAt.split("T")[0] }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
