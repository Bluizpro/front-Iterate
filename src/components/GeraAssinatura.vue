<template>
  <q-dialog
    :model-value="exibirModal"
    :update:model-value="updateExibirModal"
    persistent
    no-click-outside
  >
    <div class="q-dialog__inner" style="width: 1200px; height: 600px">
      <div class="q-dialog__content row items-center">
        <div class="assinatura-container">
          <VueSignaturePad ref="signaturePad" />
        </div>
      </div>
      <div class="q-dialog__actions">
        <q-btn
          label="Cancelar"
          color="negative"
          v-close-popup
          class="dialog-button"
        />
        <q-btn
          label="Salvar"
          color="primary"
          v-close-popup
          v-on:click="salvarAssinatura"
          class="dialog-button"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { VueSignaturePad } from 'vue-signature-pad';
import { uploadSignature, saveAssinatura } from '../services/assinaturaApi'; // Importa o serviço de upload

const props = defineProps(['exibirModal']);
const emit = defineEmits(['update:exibirModal', 'salvarAssinatura']);
const signaturePad = ref(null);
const assinaturaUrl = ref(null); // Crie uma ref para armazenar a URL da assinatura

const updateExibirModal = (value) => {
  emit('update:exibirModal', value);
};

const salvarAssinatura = async () => {
  const { isEmpty, data } = signaturePad.value.saveSignature();
  if (!isEmpty) {
    try {
      const response = await uploadSignature(data); // Chama o serviço de upload
      assinaturaUrl.value = response.url; // Armazena a URL da assinatura

      // Chama o serviço de salvar a assinatura no backend
      const assinatura = {
        url: assinaturaUrl.value, // Adiciona a URL da assinatura
      };
      await saveAssinatura(assinatura); // Envia a URL ao backend
    } catch (error) {
      console.error('Erro ao salvar a assinatura:', error);
    }
  }
  emit('salvarAssinatura', assinaturaUrl.value); // Emite a URL da assinatura ao fechar o modal
};
</script>

<style scoped lang="scss">
.assinatura-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
}

.dialog-button {
  margin: 0 2px;
  border-radius: 2rem;
}
</style>
