<template>
  <q-page padding>
    <CardButao :listaDeDados="tipoDeEntrega" />
  </q-page>
</template>

<script setup lang="ts">
import CardButao from 'src/components/CardButao.vue';
import { ref } from 'vue';
import { listData } from '../components/Imodels';

const tipoDeEntrega = ref<listData>({
  imagem: ['/imagem/interno.png', '/imagem/externo.png', '/imagem/sedex.png'],

  tipo: ['interno', 'externo', 'sedex'],
});
</script>
