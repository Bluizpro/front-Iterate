<template>
  <slot></slot>
  <div class="row justify-between">
    <div class="row q-gutter-md q-ml-sm">
      <q-btn @click="irParaForm" rounded color="indigo-14">Cadastrar</q-btn>
      <q-btn @click="irParaCard" rounded color="indigo-14">Voltar</q-btn>
    </div>
    <div class="q-mr-lg">
      <q-btn @click="irParaBaixa" rounded color="indigo-14">baixa</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const $router = useRouter();
const irParaForm = (): void => {
  $router.push('/usuario/Cadastro de Encomendas');
};

const irParaCard = (): void => {
  $router.push('/usuario/Cards Encomendas');
};
const irParaBaixa = (): void => {
  $router.push('/usuario/Dar baixa');
};
</script>
