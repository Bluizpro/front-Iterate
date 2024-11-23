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
            Pesquisar Encomendas
          </label>
          <div class="search-input">
            <input
              id="search"
              type="text"
              v-model="search"
              placeholder="Digite para buscar encomendas..."
              @input="updateDisplayedEncomendas"
            />
            <i class="material-icons search-icon" v-if="!search">search</i>
          </div>
        </div>

        <q-table
          v-if="displayedEncomendas.length > 0"
          flat
          bordered
          title="Lista de Correspondências"
          :rows="displayedEncomendas"
          :columns="computedColumns"
          row-key="id"
          binary-state-sort
        />

        <div v-else>{{ noEncomendasMessage }}</div>

        <!-- Controles de Paginação -->
        <!--         <div class="pagination-controls">
          <q-btn
            icon="chevron_left"
            @click="prevPage"
            :disable="currentPage === 1"
            color="primary"
            flat
            round
            style="margin-right: 8px"
          />
          <span>Página {{ currentPage }}</span>
          <q-btn
            icon="chevron_right"
            @click="nextPage"
            :disable="currentPage * itemsPerPage >= filteredEncomendas.length"
            color="primary"
            flat
            round
            style="margin-left: 8px"
          />
        </div> -->
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { QBtn, QPage, QTable } from 'quasar';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';

const search = ref('');
const encomendas = ref([]);
const itemsPerPage = 150;
const currentPage = ref(1);

const getEncomendasInternasESedex = async () => {
  try {
    const [internas, sedex, externas] = await Promise.all([
      getCorrespondenciasInternas(),
      getCorrespondenciasSedex(),
      getCorrespondenciasExterno(),
    ]);

    encomendas.value = [
      ...internas.map((encomenda) => ({
        id: encomenda.id,
        conjunto: encomenda.conjunto,
        nome: encomenda.nome,
        conteudo: encomenda.conteudo,
        tipo: 'interno',
      })),
      ...sedex.map((encomenda) => ({
        id: encomenda.id,
        conjunto: encomenda.conjunto,
        nome: encomenda.nome,
        conteudo: encomenda.conteudo,
        tipo: 'correio',
      })),
      ...externas.map((encomenda) => ({
        id: encomenda.id,
        conjunto: encomenda.conjunto,
        nome: encomenda.nome,
        conteudo: encomenda.conteudo,
        tipo: 'externo',
      })),
    ];
  } catch (error) {
    console.error('Erro ao carregar as encomendas:', error);
  }
};

// Computed property para encomendas filtradas
const filteredEncomendas = computed(() => {
  const searchValue = search.value.toLowerCase().trim();
  return encomendas.value.filter(
    (encomenda) =>
      String(encomenda.conjunto).toLowerCase().includes(searchValue) ||
      String(encomenda.nome).toLowerCase().includes(searchValue) ||
      String(encomenda.tipo).toLowerCase().includes(searchValue)
  );
});

// Atualizar encomendas exibidas com base na página atual e filtro
const updateDisplayedEncomendas = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  displayedEncomendas.value = filteredEncomendas.value.slice(start, end);
};

// Computed property para encomendas exibidas
const displayedEncomendas = ref([]);
watch([filteredEncomendas, currentPage], updateDisplayedEncomendas);

const noEncomendasMessage = computed(() => {
  return filteredEncomendas.value.length === 0 ? 'Não há encomendas.' : '';
});

const computedColumns = computed(() => [
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
]);

const nextPage = () => {
  if (currentPage.value * itemsPerPage < filteredEncomendas.value.length) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  await getEncomendasInternasESedex();
  updateDisplayedEncomendas();
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
  width: 15rem;
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
.q-table {
  margin: 20px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
