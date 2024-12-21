<template>
  <h1 style="font-size: 1.5em; text-align: center">
    Lista Correspondencia Externos
  </h1>
  <q-page>
    <lista-correspondencia />
  </q-page>
</template>

<script setup>
import { defineComponent } from 'vue';
import ListaCorrespondencia from '../components/listaDeCorrespondencia.vue';

defineComponent({
  components: {
    ListaCorrespondencia,
  },
});
</script>
