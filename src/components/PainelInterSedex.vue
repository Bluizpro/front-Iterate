<template>
  <div class="q-mr-xl">
    <q-chip dense color="indigo-14" text-color="white">
      Interno:
      <q-badge color="indigo-14" text-color="white" class="text-subtitle2">{{
        quantidadeEncomendasInterno
      }}</q-badge>
    </q-chip>
    <q-chip dense color="indigo-14" text-color="white">
      Externo:
      <q-badge color="indigo-14" text-color="white" class="text-subtitle2">{{
        quantidadeEncomendasExterno
      }}</q-badge>
    </q-chip>
    <q-chip dense color="indigo-14" text-color="white">
      Sedex:
      <q-badge color="indigo-14" text-color="white" class="text-subtitle2">{{
        quantidadeEncomendasSedex
      }}</q-badge>
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCondominosStore } from '../stores/condominos-store';

const store = useCondominosStore();

const quantidadeEncomendasInterno = computed(
  () => store.getQuantidadeEncomendasInterno
);
const quantidadeEncomendasSedex = computed(
  () => store.getQuantidadeEncomendasSedex
);

const quantidadeEncomendasExterno = computed(
  () => store.getQuantidadeEncomendasExterno
);
</script>
