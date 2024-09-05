<script lang="ts">
import { ref, defineComponent } from 'vue';
import InputText from 'primevue/inputtext';

export default defineComponent({
  components: {
    InputText
  },
  setup() {
    const useremail = ref('');
    const userpassword = ref('');
    return { useremail, userpassword };
  }
});
</script>

<template>
  <div class="container">
    <span class="p-float-label" style="margin-right:1rem">
      <InputText id="email" v-model="useremail" />
      <label for="email">Enter your e-mail</label>
    </span>
    <span class="p-float-label" style="margin-right:1rem">
      <InputText id="password" v-model="userpassword" />
      <label for="password">Enter your password</label>
    </span>
    <PrimeButton label="Login" @click="Login" icon="pi pi-user" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}
</style>
