<script>

import axios from 'axios';
import 'primeicons/primeicons.css';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const GetEvents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/events', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.map(event => ({
      start: event.date,
      end: event.date,
      title: event.name,
      class: 'test',
      background: false,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const events = await GetEvents();

export default {
  components: { VueCal },
  data() {
    return {
      events: events,
      visible: false,
      newName: "",
      newDate: "",
      newMaxParticipants: "",
      newLocation: "",
      AddEvent() {
        // Add an event to the database
      }
    }
  },
};

</script>

<style scoped>

  .left-padding {
    padding-left: 3rem;
  }

  .right-padding {
    padding-right: 3rem;
  }

  .header-bar {
    display: flex;
    justify-content: space-between;
    margin: 0;
  }

  .calendar-container {
    padding-bottom: 1rem;
  }

  .event-calendar {
    background: white;
  }

  .map-box {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .event-map {
    padding: 20px;
    background: white;
  }

  .event-btn {
    background-color: #007ad9;
    border: none;
  }

  @media (max-width: 600px) {
    .left-padding {
      padding-left: 1rem;
    }
    .right-padding {
      padding-right: 1rem;
    }
  }

  @media (min-width: 600px) {
    .left-padding {
      padding-left: 2rem;
    }
    .right-padding {
      padding-right: 2rem;
    }
  }

  @media (min-width: 1500px) {
    .left-padding {
      padding-left: 3rem;
    }
    .right-padding {
      padding-right: 3rem;
    }
  }

</style>

<style>

  .vuecal__title-bar {
    background-color: white;
  }

  .vuecal__event.test {
    background-color: rgb(25, 128, 230);
    border: 1px solid rgb(20, 102, 184);
    color: #f8f8f8;
  }

  .vuecal__cell-content {
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: flex-start;
  }

  .vuecal__cell-date {
    align-self: flex-start;
    position: absolute;
    top: 0;
    margin: 5px;
  }

  .vuecal__cell-events {
    margin-top: 20px;
  }

</style>

<template>
  <div class="header-bar left-padding">
    <h1>Events</h1>
    <!-- Add Event Button (commented since the "AddEvent" function isn't completed) -->
    <!--<PrimeButton label="Add Event" icon="pi pi-plus" class="m-4 event-btn" @click="visible = true"/>--->
    <PrimeDialog v-model:visible="visible" modal header="Add an Event" :style="{ width: '25rem' }">
      <span class="p-text-secondary block mb-5">Custom your event information.</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="name" class="font-semibold w-6rem">Name</label>
        <InputText id="name" class="flex-auto" autocomplete="off" v-model="newName" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="date" class="font-semibold w-6rem">Date</label>
        <InputText id="date" class="flex-auto" autocomplete="off" v-model="newDate" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="location" class="font-semibold w-6rem">Location</label>
        <InputText id="location" class="flex-auto" autocomplete="off" v-model="newLocation" />
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <label for="max_participants" class="font-semibold w-6rem">Max participants</label>
        <InputText id="max_participants" class="flex-auto" autocomplete="off" v-model="newMaxParticipants" />
      </div>
      <div class="flex justify-content-end gap-2">
        <PrimeButton type="button" label="Cancel" severity="secondary" @click="visible = false"></PrimeButton>
        <PrimeButton type="button" label="Save" @click="visible = false ; AddEvent()"></PrimeButton>
      </div>
    </PrimeDialog>
  </div>
  <div class="calendar-container left-padding right-padding">
    <vue-cal
        style="height: 500px"
        class="event-calendar"
        active-view="month"
        :disable-views="['years', 'week', 'day']"
        today-button
        :events="events"
        events-on-month-view="short">
    </vue-cal>
  </div>
  <div class="map-box right-padding left-padding">
    <img src="../assets/temporary_map.jpg" alt="event" class="event-map w-full"/>
  </div>
</template>
