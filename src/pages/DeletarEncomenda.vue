<template>
  <q-page v-if="encomenda" padding>
    <h1 class="q-heading text-h5 text-weight-medium text-center">
      Deletar encomenda
    </h1>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          class="q-mr-md"
          :text="encomenda?.nome.charAt(0).toUpperCase()"
          color="secondary"
        />
        <div>
          <div class="text-h6">{{ encomenda?.nome }}</div>
          <div class="text-subtitle1">conteúdo: {{ encomenda?.conteudo }}</div>
          <div class="text-subtitle1">encomenda: {{ encomenda?.tipo }}</div>
          <div class="text-subtitle1">Conjunto: {{ encomenda?.conjunto }}</div>
        </div>
      </q-card-section>

      <q-card-actions>
        <div class="col-12 q-gutter-sm">
          <q-btn
            class="float-right"
            rounded
            label="Deletar"
            color="negative"
            @click="deletarEncomenda"
            :disable="justificativa.length < 20"
          />
          <q-btn
            class="float-right"
            rounded
            label="Cancelar"
            color="white"
            text-color="indigo-14"
            :to="{ name: 'listaDeEncomendas' }"
          />
        </div>
      </q-card-actions>
    </q-card>
    <q-input
      class="q-mt-lg"
      v-model="justificativa"
      label="Justificativa"
      counter
      hint="Digite uma justificativa com pelo menos 20 caracteres"
      :rules="[
        (val) =>
          (val && val.length >= 20) ||
          'A justificativa deve ter no mínimo 20 caracteres',
      ]"
    />
  </q-page>

  <q-page v-else>
    <div>Encomenda não encontrada</div>
    <SpinnerComponente v-if="isLoading" />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { ref, onBeforeUnmount, onMounted } from 'vue';
import {
  deleteCorrespondenciaInterno,
  getCorrespondenciaInternaById,
} from '../services/encomenInterAPI';
import {
  deleteCorrespondenciaExterno,
  getCorrespondenciaExternoById,
} from '../services/encomenExternoAPI';
import {
  deleteCorrespondenciaSedex,
  getCorrespondenciaSedexById,
} from '../services/encomenSedexAPI';
import SpinnerComponente from 'src/components/SpinnerComponente.vue'; // Importe o componente

const $router = useRouter();
const $q = useQuasar();
const tipoEncomenda = $router.currentRoute.value.params.tipo; // Tipo da encomenda
const encomendaId = Number($router.currentRoute.value.params.id); // ID da encomenda
const encomenda = ref(null); // Dados da encomenda
const justificativa = ref(''); // Justificativa da deleção
const isLoading = ref(false);

let timer = null;

// Função para esconder o loader ao desmontar o componente
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});

const showLoading = () => {
  isLoading.value = true; // Mostra o spinner
};

const hideLoading = () => {
  isLoading.value = false; // Esconde o spinner
  $q.loading.hide();
};

const fetchEncomenda = async () => {
  showLoading();
  try {
    if (tipoEncomenda === 'interno') {
      encomenda.value = await getCorrespondenciaInternaById(encomendaId);
    } else if (tipoEncomenda === 'externo') {
      encomenda.value = await getCorrespondenciaExternoById(encomendaId);
    } else if (tipoEncomenda === 'correio') {
      encomenda.value = await getCorrespondenciaSedexById(encomendaId);
    } else {
      throw new Error('Tipo de encomenda inválido');
    }

    if (!encomenda.value) {
      throw new Error('Encomenda não encontrada');
    }

    console.log('Dados da encomenda:', encomenda.value);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Erro ao carregar a encomenda: ${error.message}`,
    });
    console.error('Erro ao buscar encomenda:', error);
  } finally {
    hideLoading();
  }
};

// Função que roda ao montar o componente para buscar a encomenda
onMounted(() => {
  fetchEncomenda();
});

// Função para deletar a encomenda com base no tipo
const deletarEncomenda = async () => {
  try {
    if (tipoEncomenda === 'interno') {
      await deleteCorrespondenciaInterno(encomendaId);
    } else if (tipoEncomenda === 'correio') {
      await deleteCorrespondenciaSedex(encomendaId);
    } else if (tipoEncomenda === 'externo') {
      await deleteCorrespondenciaExterno(encomendaId);
    } else {
      throw new Error(`Tipo de encomenda desconhecido: ${tipoEncomenda}`);
    }

    $q.notify({
      type: 'positive',
      message: 'Encomenda deletada com sucesso',
    });
    $router.push('/usuario/Lista-de-Encomendas');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Erro ao deletar a encomenda: ${error.message}`,
    });
    console.error('Erro ao deletar encomenda:', error);
  }
};
</script>
