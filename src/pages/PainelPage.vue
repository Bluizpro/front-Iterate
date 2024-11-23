<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Painel Encomenda</h1>
    <PainelComponente />
  </q-page>
</template>
<script setup>
import { defineComponent } from 'vue';

import PainelComponente from '../components/PainelComponente.vue';

defineComponent({
  components: {
    PainelComponente,
  },
});
</script>
