<template>
  <q-page v-if="encomenda" padding>
    <h1 style="font-size: 1.5em; text-align: center">Atualizar encomenda</h1>
    <q-card>
      <q-card-section>
        <q-form>
          <q-input v-model.lazy="form.destinatario" label="Destinatário" lazy />

          <q-input
            v-if="encomenda.tipo === 'interno'"
            v-model="form.remetente"
            label="Remetente"
            lazy
          />

          <q-input
            v-if="encomenda.tipo === 'sedex'"
            v-model="form.notaFiscal"
            label="Nota Fiscal"
            lazy
          />
          <q-input
            v-if="encomenda.tipo === 'externo'"
            v-model="form.recebedor"
            label="Recebedor"
            lazy
          />
          <q-input
            v-if="encomenda.tipo === 'externo'"
            v-model="form.local"
            label="Local"
            lazy
          />
          <q-input v-model="form.conteudo" label="Conteúdo" lazy />
          <q-input
            v-if="encomenda.tipo === 'interno'"
            v-model="form.empresa"
            label="Empresa"
            lazy
          />
        </q-form>
        <!-- Adicione mais campos conforme necessário -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          class="float-right"
          rounded
          label="Cancelar"
          color="white"
          text-color="indigo-14"
          :to="{ name: 'listaDeEncomendas' }"
        />
        <q-btn
          label="Salvar"
          color="indigo-14"
          @click="salvarEncomenda"
          rounded
        />
      </q-card-actions>
    </q-card>
  </q-page>
  <q-page v-else>
    <div>Encomenda não encontrada</div>
  </q-page>
</template>

<!-- <script setup lang="ts">
import { useRouter } from 'vue-router';
import { useEncomendasStore } from '../stores/encomendaStore'; // Atualizado para useEncomendasStore
import { useQuasar } from 'quasar';
import { onBeforeUnmount } from 'vue';

import {
  Delivery,
  EncomendaSedex,
  EncomendaInterno,
  EncomendaExterno,
} from '../components/Imodels';
import { ref } from 'vue';

let timer: NodeJS.Timeout | null = null;
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});

const showLoading = () => {
  $q.loading.show();
};
const hideLoading = () => {
  $q.loading.hide();
};

const $router = useRouter();
const $q = useQuasar();

const encomendaId = Number($router.currentRoute.value.params.id);
const useEncomendas = useEncomendasStore(); // Atualizado para useEncomendas

//capturando encomenda pelo id
const encomenda = useEncomendas.encomendas // Atualizado para useEncomendas.encomendas
  .find((encomenda) => encomenda.id === encomendaId);

let encomendaEditada: Delivery = { ...encomenda } as
  | EncomendaSedex
  | EncomendaInterno
  | EncomendaExterno;

const form = ref<Partial<Delivery>>({
  destinatario: encomendaEditada.destinatario,
  remetente: encomendaEditada.remetente,
  notaFiscal: encomendaEditada.notaFiscal,
  empresa: encomendaEditada.empresa,
  local: encomendaEditada.local,
  recebedor: encomendaEditada.recebedor,
  conteudo: encomendaEditada.conteudo,
});

const salvarEncomenda = async () => {
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Se encomenda for indefinida, retorna
  if (!encomenda) {
    return;
  }

  const newEncomendaEditada: Partial<Delivery> = {
    ...encomendaEditada,
    ...form.value,
  };

  // Verificar se todas as propriedades essenciais estão presentes
  if (
    'id' in newEncomendaEditada &&
    'data' in newEncomendaEditada &&
    'hora' in newEncomendaEditada &&
    'conjunto' in newEncomendaEditada &&
    'destinatario' in newEncomendaEditada &&
    'conteudo' in newEncomendaEditada &&
    'tipo' in newEncomendaEditada &&
    'notaFiscal' in newEncomendaEditada
  ) {
    encomendaEditada = newEncomendaEditada as Delivery;

    // Atualizar a encomenda no store
    useEncomendas.atualizarEncomenda(encomenda.id, encomendaEditada); // Atualizado para useEncomendas.atualizarEncomenda
    hideLoading();
    // Exibir notificação
    $q.notify({
      type: 'positive',
      message: 'Encomenda atualizada com sucesso',
    });

    // Redirecionar para a página de lista de encomendas
    $router.push('/usuario/Lista-de-Encomendas');
  } else {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos obrigatórios',
    });
  }
};
</script>
 -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useEncomendasStore } from '../stores/encomendaStore';
import { useQuasar } from 'quasar';
import { onBeforeUnmount } from 'vue';

import {
  Delivery,
  EncomendaSedex,
  EncomendaInterno,
  EncomendaExterno,
} from '../components/Imodels';
import { ref } from 'vue';

let timer: NodeJS.Timeout | null = null;
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});

const showLoading = () => {
  $q.loading.show();
};
const hideLoading = () => {
  $q.loading.hide();
};

const $router = useRouter();
const $q = useQuasar();

const encomendaId = Number($router.currentRoute.value.params.id);
const useEncomendas = useEncomendasStore();

// Capturando a encomenda pelo id
const encomenda = useEncomendas.encomendas.find(
  (encomenda) => encomenda.id === encomendaId
);

let encomendaEditada: Delivery = { ...encomenda } as
  | EncomendaSedex
  | EncomendaInterno
  | EncomendaExterno;

const form = ref<Partial<Delivery>>({
  destinatario: encomendaEditada.destinatario,
  remetente: encomendaEditada.remetente,
  notaFiscal: encomendaEditada.notaFiscal,
  empresa: encomendaEditada.empresa,
  local: encomendaEditada.local,
  recebedor: encomendaEditada.recebedor,
  conteudo: encomendaEditada.conteudo,
});

const salvarEncomenda = async () => {
  showLoading();

  // Se a encomenda for indefinida, retorna
  if (!encomenda) {
    hideLoading();
    return;
  }

  const newEncomendaEditada: Partial<Delivery> = {
    ...encomendaEditada,
    ...form.value,
  };

  // Verificar se todas as propriedades essenciais estão presentes
  if (
    'id' in newEncomendaEditada &&
    'data' in newEncomendaEditada &&
    'hora' in newEncomendaEditada &&
    'destinatario' in newEncomendaEditada &&
    'conteudo' in newEncomendaEditada &&
    'tipo' in newEncomendaEditada &&
    'notaFiscal' in newEncomendaEditada
  ) {
    encomendaEditada = newEncomendaEditada as Delivery;

    // Atualizar a encomenda no store
    await useEncomendasStore().atualizarEncomenda(
      encomenda.id,
      encomendaEditada
    );

    $q.notify({
      type: 'positive',
      message: 'Encomenda atualizada com sucesso',
    });
    $router.push('/usuario/Lista-de-Encomendas');
  } else {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos obrigatórios',
    });
  }

  hideLoading();
};
</script>
