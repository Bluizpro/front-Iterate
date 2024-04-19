<template>
  <q-page padding>
    <h1 class="q-heading text-h5 text-weight-medium text-center">
      Baixa nas Encomendas
    </h1>
    <q-select
      v-model="conjuntoSelecionado"
      :options="NumeroDosConjuntos"
      label="Conjunto"
    />

    <div class="row q-gutter-md justify-center">
      <q-card
        v-for="encomenda in encomendasFiltradas"
        :key="encomenda.id"
        class="q-mt-xl"
      >
        <q-card-section>
          <p>Data: {{ encomenda.data }}</p>
          <p>Hora: {{ encomenda.hora }}</p>
          <p>Destinatario: {{ encomenda.destinatario }}</p>
          <p>Conteudo: {{ encomenda.conteudo }}</p>
          <p>Encomenda: {{ encomenda.tipo }}</p>
          <!-- Adicionar mais informações conforme necessário -->
        </q-card-section>
      </q-card>
    </div>

    <div class="row justify-center">
      <q-btn
        v-if="encomendasFiltradas.length > 0"
        label="Dar Baixa"
        color="indigo-14"
        class="q-mt-lg"
        @click="exibirModalAssinatura = true"
        rounded
      />
    </div>

    <h1
      class="q-heading text-subtitle2 text-weight-medium text-center q-mt-xl"
      v-if="encomendasFiltradas.length == 0 && conjuntoSelecionado"
    >
      você não possui encomendas no momento
    </h1>
    <h1
      class="q-heading text-subtitle2 text-weight-medium text-center q-mt-xl"
      v-else-if="!conjuntoSelecionado"
    >
      Selecione um conjunto
    </h1>

    <GeraAssinatura
      :exibirModal="exibirModalAssinatura"
      @update:exibirModal="exibirModalAssinatura = $event"
      @salvarAssinatura="darBaixa"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useCondominosStore } from '../stores/condominos-store';
import { Delivery } from '../components/Imodels';
import { useQuasar } from 'quasar';

import GeraAssinatura from 'src/components/GeraAssinatura.vue';

const useCondominos = useCondominosStore();
const $q = useQuasar();

const conjuntoSelecionado = ref<string>(''); // Conjunto selecionado inicialmente
const encomendasFiltradas = ref<Delivery[]>([]);
const exibirModalAssinatura = ref(false);

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

const NumeroDosConjuntos = computed(() => {
  const conjuntos = useCondominos.condominos.reduce((conjuntos, condomino) => {
    condomino.encomendas.forEach((encomenda) => {
      conjuntos.add(encomenda.conjunto);
    });
    return conjuntos;
  }, new Set<string>());
  return Array.from(conjuntos);
});

watch(conjuntoSelecionado, () => {
  encomendasFiltradas.value = [];
  filtrarEncomendas();
});

const filtrarEncomendas = async () => {
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const encomendasFiltradasTemp = useCondominos.condominos
    .flatMap((condomino) => condomino.encomendas)
    .filter(
      (encomenda) =>
        encomenda.conjunto === conjuntoSelecionado.value &&
        (encomenda.tipo === 'interno' || encomenda.tipo === 'sedex')
    );

  encomendasFiltradas.value = [...encomendasFiltradasTemp];

  hideLoading();
};

const darBaixa = async () => {
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  encomendasFiltradas.value.forEach((encomenda) => {
    const condomino = useCondominos.condominos.find((condomino) =>
      condomino.encomendas.includes(encomenda)
    );
    if (condomino) {
      const index = condomino.encomendas.indexOf(encomenda);
      condomino.encomendas.splice(index, 1);
    }
  });

  encomendasFiltradas.value = [];
  hideLoading();
  $q.notify({
    type: 'positive',
    message: 'baixa realizada com sucesso',
  });
};
</script>
