<template>
  <q-page padding>
    <FormVisitante v-if="store.formularioAtual == 'visitante'" />
    <FormCondomino v-if="store.formularioAtual == 'condômino'" />
    <CardButao :lista-de-dados="pessoas" v-if="store.formularioAtual == ''" />
  </q-page>
</template>

<script setup lang="ts">
import CardButao from 'src/components/CardButao.vue';
import { ref } from 'vue';
import { useStore } from '../stores/example-store';
import { listData } from '../components/Imodels';
import FormVisitante from 'src/components/Formulario/FormVisitante.vue';
import FormCondomino from 'src/components/Formulario/FormCondomino.vue';

const store = useStore();

const pessoas = ref<listData>({
  imagem: ['/imagem/visitante.png', '/imagem/condomino.png'],

  tipo: ['visitante', 'condômino'],
});
</script>
