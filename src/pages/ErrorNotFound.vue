<template>
  <div
    class="fullscreen text-white text-center q-pa-md flex flex-center bg-robot"
  >
    <div>
      <q-btn
        class="q-mt-xxl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg-robot {
  background: url('../assets/robo-erro.png') no-repeat center center fixed,
    rgb(123, 123, 236);
  -webkit-background-size: 50%; /* Ajuste este valor */
  -moz-background-size: 50%; /* Ajuste este valor */
  -o-background-size: 50%; /* Ajuste este valor */
  background-size: 50%; /* Ajuste este valor */
}
</style>

<script setup lang="ts"></script>
