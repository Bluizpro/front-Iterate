<template>
  <div>
    <q-toggle
      v-model="destinatario"
      checked-icon="check"
      color="green"
      label="O Destinatario não veio receber"
      unchecked-icon="clear"
      @click="abilitarDestinatario"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const destinatario = ref<boolean>(false);

const emit = defineEmits(['abilitar-destinatario']);

const abilitarDestinatario = () => {
  emit('abilitar-destinatario', destinatario.value);
};
</script>
