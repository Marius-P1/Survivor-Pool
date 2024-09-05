<script lang="ts">
import { ref, defineComponent } from 'vue';
import axios from 'axios';
import {useRouter} from "vue-router";

export default defineComponent({
  setup() {
    const useremail = ref('');
    const userpassword = ref('');
    const router = useRouter();

    const SignOut = async () => {
      localStorage.removeItem("token");
      await router.push('/');
    };

    const Login = async () => {
      const body = {
      };

      try {
        const responseLogin = await axios.post('http://localhost:3000/login', body, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            email: useremail.value,
            password: userpassword.value
          }
        });
        localStorage.setItem("token", responseLogin.data.token);
        await router.push('/dashboard');
      } catch (error) {
        console.error('Error logging in:', error);
        localStorage.removeItem("token");
      }
    };
    return { useremail, userpassword, Login, SignOut};
  }
});
</script>

<template>
  <div class="container">
    <!-- Login Form -->
    <div class="login-form">
      <span class="p-float-label mb-4">
        <InputText id="email" v-model="useremail" />
        <label for="email">Enter your e-mail</label>
      </span>
      <span class="p-float-label mb-4">
        <PrimePassword v-model="userpassword" :feedback="false" />
        <label>Password</label>
      </span>
      <PrimeButton class="mb-4 w-1" label="Login" @click="Login" icon="pi pi-user" />
      <PrimeButton class="w-1" label="Sign out" severity="danger" @click="SignOut" icon="pi pi-times" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}
</style>