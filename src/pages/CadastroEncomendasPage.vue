<template>
  <q-page>
    <FormExterno v-if="formStore.formularioAtual == 'externo'" />
    <FormInterno v-if="formStore.formularioAtual == 'interno'" />
    <FormSedex v-if="formStore.formularioAtual == 'correio'" />
  </q-page>
</template>
<script setup>
import FormExterno from 'src/components/Formulario/FormExterno.vue';
import FormInterno from 'src/components/Formulario/FormInterno.vue';
import FormSedex from 'src/components/Formulario/FormSedex.vue';
import { useStore } from '../stores/example-store';

const formStore = useStore();
</script>
