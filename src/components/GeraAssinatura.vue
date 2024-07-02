<!-- <template>
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

<script setup lang="ts">
import { defineProps, defineEmits, ref, Ref } from 'vue';
import VueSignaturePad from 'vue-signature-pad';
import { useAssinaturaStore } from '../stores/assinatura';

const props = defineProps(['exibirModal']);
const emit = defineEmits(['update:exibirModal', 'assinaturaGerada']);
const signaturePad: Ref<InstanceType<typeof VueSignaturePad> | null> =
  ref(null);
const store = useAssinaturaStore();

const updateExibirModal = (value: any) => {
  emit('update:exibirModal', value);
};

const salvarAssinatura = async () => {
  const { isEmpty, data } = signaturePad.value?.saveSignature();
  if (!isEmpty) {
    await store.salvarAssinatura(data);
    emit('assinaturaGerada', store.currentAssinatura);
  }
};
</script>

<style scoped lang="scss">
.assinatura-container {
  width: 100%; /* Ajuste a largura para 100% */
  height: 100%; /* Ajuste a altura para 100% */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
}

.dialog-button {
  margin: 0 2px; /* Adicione margem aos botões */
  border-radius: 2rem;
}
</style> -->

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
import { useAssinaturaStore } from '../stores/assinatura';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  width: 100%; /* Ajuste a largura para 100% */
  height: 100%; /* Ajuste a altura para 100% */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
}

.dialog-button {
  margin: 0 2px; /* Adicione margem aos botões */
  border-radius: 2rem;
}
</style>
