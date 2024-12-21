<template>
  <q-page>
    <div class="q-pa-md">
      <!-- Campo de pesquisa -->
      <div class="search-input">
        <q-input
          outlined
          v-model="search"
          placeholder="Conjunto, nome ou Funcionário"
          class="search-bar"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" class="search-icon" />
          </template>
        </q-input>
      </div>

      <!-- Tabela de condomínios -->
      <q-table
        flat
        bordered
        title="Lista de Andares"
        :rows="filteredRows"
        :columns="columns"
        row-key="conjunto"
        binary-state-sort
        :rows-per-page-options="[0]"
        class="custom-table"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="expand" :props="props">
              <q-btn
                dense
                flat
                :icon="getExpandIcon(props.row.conjunto)"
                :class="{
                  'expand-btn': true,
                  expanded: expandedConjuntos.includes(props.row.conjunto),
                }"
                @click="toggleExpand(props.row.conjunto)"
              />
            </q-td>
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>

            <q-td
              key="interfone"
              :props="props"
              :class="['interfone', getInterfoneStyle(props.row.interfone)]"
            >
              {{ props.row.interfone }}
            </q-td>

            <q-td key="proprietario" :props="props">
              {{ props.row.proprietario }}
            </q-td>
            <q-td key="telefone" :props="props">
              {{ props.row.telefone }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- Tabela de locatários -->
      <div v-if="expandedConjuntos.length > 0">
        <div
          v-for="conjunto in expandedConjuntos"
          :key="conjunto"
          class="locatario-table"
        >
          <h3>Colaboradores do Conjunto {{ conjunto }}</h3>
          <q-table
            flat
            bordered
            :rows="locatarios[conjunto] || []"
            :columns="locatarioColumns"
            row-key="id"
            binary-state-sort
            class="custom-table"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
                <q-td key="especialidade" :props="props">{{
                  props.row.especialidade
                }}</q-td>
                <q-td
                  key="interfone"
                  :props="props"
                  :class="['interfone', getInterfoneStyle(props.row.interfone)]"
                >
                  {{ props.row.interfone }}
                </q-td>

                <q-td key="telefone" :props="props" class="telefone-table">
                  {{ props.row.telefone }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>

      <!-- Paginação -->
      <q-pagination
        v-model="page"
        :max="totalPages"
        color="primary"
        boundary-numbers
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCondominosStore } from '../stores/condominosStore';
import { getLocatariosByConjunto } from '../services/locatarioApi';

const store = useCondominosStore();
const expandedConjuntos = ref([]);
const locatarios = ref({});
const search = ref(''); // Campo de pesquisa

const page = ref(1); // Página atual
const rowsPerPage = 130; // Limitar a 8 itens por página

const columns = [
  {
    name: 'expand',
    label: '',
    align: 'center',
    field: 'expand',
  },
  {
    name: 'conjunto',
    label: 'Número do Conj.',
    align: 'center',
    field: 'conjunto',
    sortable: true,
  },
  {
    name: 'interfone',
    label: 'Interfone',
    align: 'left',
    field: 'interfone',
  },

  {
    name: 'telefone',
    label: 'Telefone',
    field: 'telefone',
  },
];

const locatarioColumns = [
  {
    name: 'nome',
    label: 'Nome',
    align: 'left',
    field: 'nome',
  },
  {
    name: 'especialidade',
    align: 'left',
    label: 'Especialidade',
    field: 'especialidade',
    sortable: true,
  },
  {
    name: 'interfone',
    label: 'Interfone',
    align: 'left',
    field: 'interfone',
  },
  {
    name: 'telefone',
    label: 'Telefone',
    align: 'left',
    field: 'telefone',
    align: 'right',
  },
];

// Computed property para filtrar as linhas da tabela com base na pesquisa
const filteredRows = computed(() => {
  const lowerSearch = search.value.toLowerCase();

  // Filtrar os dados
  const filtered = store.condominos.filter((row) => {
    const matchesCondomino =
      row.conjunto.toString().includes(lowerSearch) ||
      row.proprietario.toLowerCase().includes(lowerSearch);

    const matchesLocatario = locatarios.value[row.conjunto]?.some((locatario) =>
      locatario.nome.toLowerCase().includes(lowerSearch)
    );

    return matchesCondomino || matchesLocatario;
  });

  // Ordenar por 'conjunto'
  const sorted = filtered.sort((a, b) => a.conjunto - b.conjunto);

  // Paginação
  const start = (page.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return sorted.slice(start, end);
});

// Computed para o total de páginas
const totalPages = computed(() => {
  const totalRows = store.condominos.filter((row) => {
    const lowerSearch = search.value.toLowerCase();
    return (
      row.conjunto.toString().includes(lowerSearch) ||
      row.proprietario.toLowerCase().includes(lowerSearch)
    );
  }).length;
  return Math.ceil(totalRows / rowsPerPage);
});

function toggleExpand(conjunto) {
  if (!conjunto) return; // Evitar tentar expandir algo sem conjunto válido

  if (expandedConjuntos.value.includes(conjunto)) {
    expandedConjuntos.value = expandedConjuntos.value.filter(
      (c) => c !== conjunto
    );
  } else {
    expandedConjuntos.value.push(conjunto);
    // Verificar se os locatários já foram carregados para esse conjunto
    if (!locatarios.value[conjunto]) {
      getLocatariosByConjunto(conjunto)
        .then((data) => {
          locatarios.value[conjunto] = data;
        })
        .catch((error) => {
          console.error('Erro ao carregar locatários:', error);
        });
    }
  }
}

// Inicializa a lista de condomínios após o componente ser montado
onMounted(() => {
  store.init();
});

function getExpandIcon(conjunto) {
  return expandedConjuntos.value.includes(conjunto)
    ? 'expand_less'
    : 'expand_more';
}

function getInterfoneStyle(interfone) {
  // Verifique se o valor de interfone é uma string válida, caso contrário, defina como uma string vazia
  const interfoneNormalized =
    interfone && interfone.trim ? interfone.trim().toLowerCase() : '';

  if (interfoneNormalized === '2/t') {
    return 'yellow-interfone'; // Cor amarela
  } else if (interfoneNormalized === 'a/s') {
    return 'red-interfone'; // Cor vermelha
  } else if (interfoneNormalized === 'sim') {
    return 'green-interfone'; // Cor verde
  }
  return 'default-interfone'; // Cor padrão (branca)
}
</script>

<style scoped lang="scss">
.search-input {
  margin-bottom: 1rem;

  .search-bar {
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
    width: 19rem;
    height: 32px;
    border-radius: 5px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: #1f22ff; // Cor da borda ao focar
      box-shadow: 0 0 5px rgba(27, 31, 248, 0.5); // Sombra azul ao focar
    }
  }

  .search-icon {
    color: #260efa; // Cor do ícone de lupa
    margin-right: 0.5rem;
    cursor: pointer;

    &:hover {
      color: #33adff; // Cor ao passar o mouse
    }
  }
}

.custom-table {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%; // Garante que a tabela não ultrapasse a largura da tela

  .q-tr {
    height: 40px; /* Diminuir a altura das linhas */
  }

  .q-td {
    font-size: 0.85rem; /* Ajustar o tamanho da fonte */
    padding: 0.5rem; /* Reduzir o preenchimento das células */
  }

  .q-td.interfone {
    width: 5rem !important; /* Ajuste a largura da coluna "Interfone" */
  }
}

.q-btn {
  background-color: #316ae4; // Cor de fundo dos botões
  color: white; // Cor do texto dos botões
  transition: background-color 0.3s ease; // Transição suave para a cor de fundo

  &:hover {
    background-color: #327be9; // Cor de fundo ao passar o mouse nos botões
  }
}

.expand-btn {
  transition: background-color 0.3s ease; // Transição suave para a cor de fundo

  &.expanded {
    background-color: #e53935; // Cor de fundo vermelha para o botão expandido
    .q-icon {
      color: white; // Cor do ícone quando expandido
    }
  }

  &:hover {
    background-color: #d32f2f; // Cor ao passar o mouse sobre o botão expandido
  }
}

.locatario-table {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 100%; // Evita que o card ultrapasse a largura da tela
}
.q-th.telefone-td {
  text-align: right; /* Alinha o cabeçalho da coluna telefone à direita */
}

.locatario-table h3 {
  margin-bottom: 1rem;
  font-size: 1rem; /* Ajusta o tamanho do título */
}

.q-pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.yellow-interfone {
  background-color: #ffeb3b; /* Cor amarela */
  color: black; /* Cor do texto para contraste */
  font-size: 0.75rem;
  padding: 1rem !important;
}

.red-interfone {
  background-color: #f44336; /* Cor vermelha */
  color: white; /* Cor do texto para contraste */
  font-size: 0.75rem; /* Ajuste do tamanho da fonte */
  padding: 1rem !important;
}
.green-interfone {
  background-color: #08aa08; /* Cor vermelha */
  color: white; /* Cor do texto para contraste */
  font-size: 0.75rem; /* Ajuste do tamanho da fonte */
  padding: 1rem !important;
}

.default-interfone {
  background-color: white; /* Cor branca */
  color: black; /* Cor do texto para contraste */
  font-size: 0.75rem; /* Ajuste do tamanho da fonte */
  padding: 1rem !important;
}
.telefone-table {
  text-align: right;
}
</style>
