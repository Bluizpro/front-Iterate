<template>
  <q-expansion-item icon="menu_open" label="Cadastrar">
    <EssentialLink
      class="q-ml-lg"
      v-for="(person, idx) in peopleLinks"
      :key="idx"
      v-bind="person"
      @click="store.resetFormularioAtual()"
    />
  </q-expansion-item>
</template>
<script setup lang="ts">
import EssentialLink from './EssentialLink.vue';
import { useStore } from 'src/stores/example-store';
const store = useStore();

const peopleLinks = [
  {
    title: 'Pessoas',
    icon: 'person_add',
    link: 'Pessoas',
  },
  {
    title: 'Encomendas',
    icon: 'unarchive',
    link: 'cardsEncomendas',
  },
];
</script>
