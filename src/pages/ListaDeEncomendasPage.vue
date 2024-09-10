<template>
  <q-page>
    <ListaDeEncomendas
      v-if="storeForm.formularioAtual === 'interno'"
      tipo="interno"
    >
      <h1 style="font-size: 1.5em; text-align: center">Encomendas Internas</h1>
      <BotoesCadastrarEBaixa />
    </ListaDeEncomendas>

    <ListaDeEncomendas
      v-if="storeForm.formularioAtual === 'externo'"
      tipo="externo"
    >
      <h1 style="font-size: 1.5em; text-align: center">Encomendas Externas</h1>
      <BotoesCadastrarEBaixa />
    </ListaDeEncomendas>
    <ListaDeEncomendas
      v-if="storeForm.formularioAtual === 'sedex'"
      tipo="sedex"
    >
      <h1 style="font-size: 1.5em; text-align: center">Encomendas Sedex</h1>
      <BotoesCadastrarEBaixa />
    </ListaDeEncomendas>
  </q-page>
</template>

<script setup lang="ts">
import ListaDeEncomendas from 'src/components/ListaDeEncomendas.vue';
import { useStore } from '../stores/example-store';
import BotoesCadastrarEBaixa from 'src/components/BotoesCadastrarEBaixa.vue';

const storeForm = useStore();
</script>
