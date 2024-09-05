<template>
  <AppSidebar v-model:visible="visible" />
</template>

<script setup>
import { ref } from "vue";
import AppSidebar from "@/components/AppSidebar.vue";

const visible = ref(false);
</script>
