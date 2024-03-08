<template>
  <q-page v-if="encomenda" padding>
    <q-card>
      <q-card-section>
        <q-input v-model="encomendaEditada.destinatario" label="Destinatario" />

        <q-input
          v-if="encomenda.tipo === 'interno'"
          v-model="encomendaEditada.remetente"
          label="Remetente"
        />

        <q-input
          v-if="encomenda.tipo === 'sedex'"
          v-model="encomendaEditada.notaFiscal"
          label="Nota Fiscal"
        />
        <q-input
          v-if="encomenda.tipo === 'externo'"
          v-model="encomendaEditada.recebedor"
          label="Recebedor"
        />
        <q-input
          v-if="encomenda.tipo === 'externo'"
          v-model="encomendaEditada.local"
          label="Local"
        />
        <q-input v-model="encomendaEditada.conteudo" label="Conteúdo" />
        <q-input
          v-if="encomenda.tipo === 'interno'"
          v-model="encomendaEditada.empresa"
          label="Empresa"
        />
        <!-- Adicione mais campos conforme necessário -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Salvar" color="primary" @click="salvarEncomenda" />
      </q-card-actions>
    </q-card>
  </q-page>
  <q-page v-else>
    <div>Encomenda não encontrada</div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCondominosStore } from '../stores/condominos-store';
import { useQuasar } from 'quasar';
import {
  Delivery,
  EncomendaSedex,
  EncomendaInterno,
  EncomendaExterno,
} from '../components/Imodels';

const $router = useRouter();
const $q = useQuasar();

const encomendaId = Number($router.currentRoute.value.params.id);
const useCondominos = useCondominosStore();
const encomenda = useCondominos.condominos
  .flatMap((condomino) => condomino.encomendas)
  .find((encomenda) => encomenda.id === encomendaId);

let encomendaEditada: Delivery = { ...encomenda } as
  | EncomendaSedex
  | EncomendaInterno
  | EncomendaExterno;

const salvarEncomenda = () => {
  // Se encomenda for indefinida, retorna
  if (!encomenda) {
    return;
  }

  // Atualizar a encomenda no store
  useCondominos.atualizarEncomenda(encomenda.id, encomendaEditada);

  // Exibir notificação
  $q.notify({
    type: 'positive',
    message: 'Encomenda atualizada com sucesso',
  });

  // Redirecionar para a página de lista de encomendas
  $router.push('/usuario/Lista de Encomendas');
};
</script>
