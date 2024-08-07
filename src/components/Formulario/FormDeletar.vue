<template>
  <q-page v-if="encomenda">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          class="q-mr-md"
          :text="encomenda?.destinatario.charAt(0).toUpperCase()"
          color="secondary"
        />
        <div>
          <div class="text-h6">{{ encomenda?.destinatario }}</div>
          <div class="text-subtitle1">Encomenda: {{ encomenda?.conteudo }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Deletar" color="negative" @click="deletarEncomenda" />
      </q-card-actions>
    </q-card>
  </q-page>
  <q-page v-else>
    <div>Encomenda não encontrada</div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useEncomendasStore } from '../../stores/encomendaStore';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const encomendasStore = useEncomendasStore();

const encomendaId = Number(router.currentRoute.value.params.id);
const encomenda = encomendasStore.encomendas.find(
  (e: { id: number }) => e.id === encomendaId
);

const deletarEncomenda = () => {
  if (encomenda) {
    encomendasStore.deletarEncomenda(encomenda.id);
    $q.notify({
      type: 'positive',
      message: 'Encomenda deletada com sucesso',
    });
    router.push('/');
  } else {
    $q.notify({
      type: 'negative',
      message: 'Encomenda não encontrada',
    });
    router.push('/');
  }
};
</script>
