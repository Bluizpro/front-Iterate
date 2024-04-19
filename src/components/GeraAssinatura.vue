<template>
  <q-dialog
    :model-value="exibirModal"
    :update:model-value="updateExibirModal"
    persistent
    no-click-outside
  >
    <div class="q-dialog__inner">
      <div class="q-dialog__content row items-center">
        <div class="assinatura-container">
          <VueSignaturePad ref="signaturePad" />
        </div>
      </div>
      <div class="q-dialog__actions">
        <q-btn label="Cancelar" color="negative" v-close-popup />
        <q-btn
          label="Salvar"
          color="primary"
          v-close-popup
          v-on:click="salvarAssinatura"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { VueSignaturePad } from 'vue-signature-pad';
import { useAssinaturaStore } from '../stores/assinatura';

const props = defineProps(['exibirModal']);
const emit = defineEmits(['update:exibirModal', 'salvarAssinatura']);
const signaturePad = ref(null);
const store = useAssinaturaStore();

const updateExibirModal = (value) => {
  emit('update:exibirModal', value);
};

const salvarAssinatura = async () => {
  // Adicione a palavra-chave async
  const { isEmpty, data } = signaturePad.value.saveSignature();
  if (!isEmpty) {
    // Armazena a assinatura na loja Pinia
    await store.salvarAssinatura(data); // Adicione a palavra-chave await
    console.log('URL da assinatura:', store.url);
  }
  emit('salvarAssinatura');
};
</script>

<style scoped lang="scss">
.assinatura-container {
  width: 800px; /* Defina a largura desejada para aumentar a caixa para os lados */
  height: 600px;
  /* Defina a altura desejada */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
}
</style>
