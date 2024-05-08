<template>
  <router-view />
  <q-page
    class="row items-center justify-evenly"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <q-icon
      class="absolute-top-right q-ma-md cursor-pointer"
      :name="isDarkMode ? 'light_mode' : 'dark_mode'"
      color="primary"
      @click="toggleDarkMode"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>
<style scoped>
.dark-mode {
  background-color: #2e2929;
}
</style>
