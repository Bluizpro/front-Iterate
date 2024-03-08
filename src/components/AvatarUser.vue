<template>
  <div class="row q-gutter-sm items-center q-pl-xl q-ml-xl q-mr-sm">
    <q-item-label>{{ nome }}</q-item-label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usuarioStore } from '../stores/example-store';
const store = usuarioStore();

const nome = computed(() => {
  const nomeUsuario = store.nomeUsuario;

  // Verifica se o nome do usuário existe
  if (nomeUsuario) {
    // Capitaliza a primeira letra e concatena com o restante do nome
    return nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1);
  }

  // Caso o nome do usuário não exista, retorna uma string vazia ou uma mensagem padrão
  return 'Usuário não encontrado';
});
</script>
