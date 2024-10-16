<template>
  <q-page>
    <div class="border">
      <div class="q-pa-md">
        <div class="search-container">
          <label
            style="font-size: 1.5em; text-align: center"
            for="search"
            class="search-label"
          >
          </label>
          <div class="search-input">
            <input id="search" type="text" v-model="search" />
            <i class="material-icons search-icon" v-if="!search">search</i>
          </div>
        </div>
        <q-table
          v-if="filteredEncomendas.length > 0"
          flat
          bordered
          title="Lista de Correspondências"
          :rows="filteredEncomendas"
          :columns="computedColumns"
          row-key="id"
          binary-state-sort
        />
        <div v-else>{{ noEncomendasMessage }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';

const search = ref('');
const encomendas = ref([]); // Lista para armazenar as encomendas

// Função para buscar as encomendas internas e Sedex de condominos e funcionários
const getEncomendasInternasESedex = async () => {
  try {
    // Chamadas às APIs para buscar encomendas internas e Sedex
    const [internas, sedex /* externas */] = await Promise.all([
      getCorrespondenciasInternas(),
      getCorrespondenciasSedex(),
      getCorrespondenciasExterno(),
    ]);

    encomendas.value = [
      ...internas.map((encomenda) => ({
        conjunto: encomenda.conjunto,
        nome: encomenda.nome,
        conteudo: encomenda.conteudo,
        tipo: 'interno',
      })),
      ...sedex.map((encomenda) => ({
        conjunto: encomenda.conjunto,
        nome: encomenda.nome,
        conteudo: encomenda.conteudo,
        tipo: 'correio',
      })),
      /*    ...externas.map((encomenda) => ({
        conjunto: encomenda.conjunto,
        nome: encomenda.nome,
        conteudo: encomenda.conteudo,
        tipo: 'externo',
      })), */
    ];
  } catch (error) {
    console.error('Erro ao carregar as encomendas:', error);
  }
};

// Computed properties para as encomendas filtradas
const filteredEncomendas = computed(() => {
  const searchValue = search.value.toLowerCase().trim();
  return encomendas.value.filter(
    (encomenda) =>
      String(encomenda.conjunto).toLowerCase().includes(searchValue) ||
      String(encomenda.destinatario).toLowerCase().includes(searchValue)
  );
});

const noEncomendasMessage = computed(() => {
  return filteredEncomendas.value.length === 0 ? 'Não há encomendas.' : '';
});

const computedColumns = computed(() => {
  return [
    {
      name: 'conjunto',
      label: 'Conjunto',
      align: 'left',
      required: true,
      field: 'conjunto',
      sortable: true,
    },
    {
      name: 'nome',
      label: 'Destinatário',
      align: 'left',
      required: true,
      field: 'nome',
      sortable: true,
    },
    {
      name: 'conteudo',
      label: 'Conteúdo',
      align: 'left',
      required: true,
      field: 'conteudo',
      sortable: true,
    },
    {
      name: 'tipo',
      label: 'Tipo',
      align: 'left',
      required: true,
      field: 'tipo',
      sortable: true,
    },
  ];
});

// Inicializar os dados ao montar o componente
onMounted(async () => {
  await getEncomendasInternasESedex();
});
</script>

<style scoped lang="scss">
.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
  margin-bottom: 10px;
}

.search-label {
  margin-right: 10px;
  margin-left: 2rem;
}

.search-input {
  position: relative;
  width: 8rem;
  color: #000;
  margin-top: 2rem;
}

#search {
  width: 100%;
  height: 2rem;
  padding-left: 2rem;
  text-align: left;
  background-color: #d9d2d2;
}

.search-icon {
  position: absolute;
  left: 3px;
  top: 7px;
  font-size: 23px;
}
.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}
</style>
