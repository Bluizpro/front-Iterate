<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Anotacões</h1>
    <div class="border">
      <div class="note-container">
        <AnotacaoComponent />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AnotacaoComponent from '../components/AnotacaoComponent.vue';
</script>
<style scoped lang="scss">
.border {
  border: 1px solid #000 !important;
  margin-left: 1rem;
  margin-top: 1rem;
  margin-right: 2rem;
  background-color: rgb(235 208 208 / 20%);
}
</style>

