<template>
  <q-page>
    <ListaDeEncomendas v-if="storeForm.formularioAtual == 'interno'">
      <h1 class="q-heading text-h5 text-weight-medium text-center">
        Encomendas Internas
      </h1>
      <BotoesCadastrarEBaixa />
    </ListaDeEncomendas>

    <ListaDeEncomendas v-if="storeForm.formularioAtual == 'sedex'">
      <h1 class="q-heading text-h5 text-weight-medium text-center">
        Encomendas sedex
      </h1>
      <BotoesCadastrarEBaixa />
    </ListaDeEncomendas>

    <ListaDeEncomendas v-if="storeForm.formularioAtual == 'externo'">
      <h1 class="q-heading text-h5 text-weight-medium text-center">
        Encomendas externas
      </h1>
      <BotoesCadastrarEBaixa />
    </ListaDeEncomendas>
  </q-page>
</template>

<script setup lang="ts">
import ListaDeEncomendas from 'src/components/ListaDeEncomendas.vue';
import { useStore } from '../stores/example-store';
import BotoesCadastrarEBaixa from 'src/components/BotoesCadastrarEBaixa.vue';

const storeForm = useStore();

// // Filtrar as encomendas do tipo interno
// const encomendasInterno = computed(() => {
//   const tipo = 'interno';
//   return useCondiminos.condominos.reduce((acc: Delivery[], condomino) => {
//     acc.push(
//       ...condomino.encomendas.filter((encomenda) => encomenda.tipo === tipo)
//     );
//     return acc;
//   }, []);
// });

// // Filtrar as encomendas do tipo sedex
// const encomendasSedex = computed(() => {
//   const tipo = 'sedex';
//   return useCondiminos.condominos.reduce((acc: Delivery[], condomino) => {
//     acc.push(
//       ...condomino.encomendas.filter((encomenda) => encomenda.tipo === tipo)
//     );
//     return acc;
//   }, []);
// });

// // Filtrar as encomendas do tipo externo
// const encomendasExterno = computed(() => {
//   const tipo = 'externo';
//   return useCondiminos.condominos.reduce((acc: Delivery[], condomino) => {
//     acc.push(
//       ...condomino.encomendas.filter((encomenda) => encomenda.tipo === tipo)
//     );
//     return acc;
//   }, []);
// });
</script>
