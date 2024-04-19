<template>
  <div class="row q-gutter-sm items-center q-pl-xl q-ml-xl q-mr-sm">
    <q-item-label>{{ nome }}</q-item-label>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usuarioStore } from '../stores/example-store';
const store = usuarioStore();

onMounted(() => {
  const nomeUsuario = localStorage.getItem('usuarioLogado');
  if (nomeUsuario) {
    store.nomeUsuario = nomeUsuario;
  }
});

const nome = computed(() => {
  const nomeUsuario = store.nomeUsuario;

  if (nomeUsuario) {
    return nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1);
  }

  return 'Usuário não encontrado';
});
</script>
