<template>
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
