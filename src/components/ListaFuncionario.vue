<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Lista de Funcionários"
      :rows="displayedFuncionarios"
      :columns="columns"
      row-key="conjunto"
      binary-state-sort
      :rows-per-page-options="[0]"
    />

    <!-- Paginação personalizada -->
    <div class="pagination-container">
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
        :disable="currentPage * itemsPerPage >= funcionarios.length"
        color="primary"
        flat
        round
        style="margin-left: 8px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getFuncionario } from '../services/funcionarioApi';

const funcionarios = ref([]); // Armazena a lista de funcionários
const itemsPerPage = 100; // Número de funcionários por página
const currentPage = ref(1); // Página atual

const columns = [
  {
    name: 'dataHora',
    label: 'Data de Cadastro',
    align: 'center',
    field: (row) => formatarData(row.dataHora),
    sortable: true,
  },
  {
    name: 'conjunto',
    label: 'Conjunto',
    align: 'center',
    field: 'conjunto',
    sortable: true,
  },
  {
    name: 'nome',
    label: 'Nome',
    align: 'center',
    field: 'nome',
    sortable: true,
  },
  {
    name: 'setor',
    label: 'Setor',
    align: 'center',
    field: 'setor',
    sortable: true,
  },
  {
    name: 'telefone',
    label: 'Telefone',
    field: 'telefone',
    align: 'left',
  },
];

const displayedFuncionarios = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return funcionarios.value.slice(start, start + itemsPerPage);
});

onMounted(async () => {
  try {
    funcionarios.value = await getFuncionario(); // Obter funcionários da API
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
  }
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < funcionarios.value.length) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

function formatarData(dataString) {
  const data = new Date(dataString);
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}
</script>

<style scoped>
.q-table {
  margin: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
