<!-- <template>
  <div class="q-mr-xl">
    <q-chip
      dense
      :color="getChipColor(quantidadeEncomendasInterno)"
      text-color="white"
    >
      <span class="centered-text">Interno:</span>
      <q-badge
        :color="getChipColor(quantidadeEncomendasInterno)"
        text-color="white"
        class="text-subtitle2"
        >{{ quantidadeEncomendasInterno }}</q-badge
      >
    </q-chip>
    <q-chip
      dense
      :color="getChipColor(quantidadeEncomendasExterno)"
      text-color="white"
    >
      <span class="centered-text">Externo:</span>
      <q-badge
        :color="getChipColor(quantidadeEncomendasExterno)"
        text-color="white"
        class="text-subtitle2"
        >{{ quantidadeEncomendasExterno }}</q-badge
      >
    </q-chip>
    <q-chip
      dense
      :color="getChipColor(quantidadeEncomendasSedex)"
      text-color="white"
    >
      <span class="centered-text">Sedex:</span>
      <q-badge
        :color="getChipColor(quantidadeEncomendasSedex)"
        text-color="white"
        class="text-subtitle2"
        >{{ quantidadeEncomendasSedex }}</q-badge
      >
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEncomendasStore } from '../stores/encomendaStore';

const store = useEncomendasStore();

const quantidadeEncomendasInterno = computed(
  () => store.getQuantidadeEncomendasInterno
);
const quantidadeEncomendasSedex = computed(
  () => store.getQuantidadeEncomendasSedex
);
const quantidadeEncomendasExterno = computed(
  () => store.getQuantidadeEncomendasExterno
);

const getChipColor = (quantidade: number) => {
  if (quantidade < 10) {
    return 'green-6';
  } else if (quantidade < 25) {
    return 'yellow-6';
  } else {
    return 'red-6';
  }
};
</script>

<style scoped>
.centered-text {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
</style>
 -->

<template>
  <div class="q-mr-xl">
    <q-chip dense :class="getChipClass(quantidadeEncomendasInterno)">
      <span class="centered-text">Interno:</span>
      <q-badge
        :class="getBadgeClass(quantidadeEncomendasInterno)"
        class="text-subtitle2"
        >{{ quantidadeEncomendasInterno }}</q-badge
      >
    </q-chip>
    <q-chip dense :class="getChipClass(quantidadeEncomendasExterno)">
      <span class="centered-text">Externo:</span>
      <q-badge
        :class="getBadgeClass(quantidadeEncomendasExterno)"
        class="text-subtitle2"
        >{{ quantidadeEncomendasExterno }}</q-badge
      >
    </q-chip>
    <q-chip dense :class="getChipClass(quantidadeEncomendasSedex)">
      <span class="centered-text">Sedex:</span>
      <q-badge
        :class="getBadgeClass(quantidadeEncomendasSedex)"
        class="text-subtitle2"
        >{{ quantidadeEncomendasSedex }}</q-badge
      >
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEncomendasStore } from '../stores/encomendaStore';

const store = useEncomendasStore();

const quantidadeEncomendasInterno = computed(
  () => store.getQuantidadeEncomendasInterno
);
const quantidadeEncomendasSedex = computed(
  () => store.getQuantidadeEncomendasSedex
);
const quantidadeEncomendasExterno = computed(
  () => store.getQuantidadeEncomendasExterno
);

const getChipClass = (quantidade: number) => {
  if (quantidade < 10) {
    return 'chip-blue';
  } else if (quantidade < 25) {
    return 'chip-orange';
  } else {
    return 'chip-purple';
  }
};

const getBadgeClass = (quantidade: number) => {
  if (quantidade < 10) {
    return 'badge-blue';
  } else if (quantidade < 25) {
    return 'badge-orange';
  } else {
    return 'badge-purple';
  }
};
</script>

<style scoped>
.centered-text {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.chip-blue {
  background-color: #0905e6 !important;
  color: white;
}

.badge-blue {
  background-color: #0905e6 !important;
  color: white;
}
</style>
