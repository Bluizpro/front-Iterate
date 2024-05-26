<template>
  <q-page>
    <lista-funcionario />
  </q-page>
</template>
<script setup>
import { defineComponent } from 'vue';
import ListaFuncionario from '../components/ListaFuncionario.vue';

defineComponent({
  components: {
    ListaFuncionario,
  },
});
</script>
