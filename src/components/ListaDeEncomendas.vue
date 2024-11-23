<template>
  <q-page>
    <div>
    <slot></slot>
    </div>

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Lista de Correspondências"
        :rows="paginatedEncomendas"
        :columns="computedColumns"
        row-key="id"
        binary-state-sort
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="column in computedColumns"
              :key="column.name"
              :props="props"
            >
              <template v-if="column.name === 'actions'">
                <q-btn
                  @click="deletarItem(props.row)"
                  class="q-ml-sm"
                  color="negative"
                  dense
                  size="sm"
                >
                  <q-icon name="delete" />
                </q-btn>
              </template>
              <template v-else>
                {{ props.row[column.name] }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- Paginação customizada -->
      <div class="custom-pagination q-mt-md">
        <q-btn
          flat
          round
          dense

          :disable="page.value === 1"
          @click="previousPage"
        />
        <q-pagination
          v-model="page"
          :max="totalPages"
          color="primary"
          boundary-numbers
        />
        <q-btn
          flat
          round
          dense

          :disable="page.value === totalPages"
          @click="nextPage"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useStore } from '../stores/example-store';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';

const router = useRouter();
const $q = useQuasar();
const store = useStore();

const page = ref(1); // Página atual
const rowsPerPage = ref(5); // Número de itens por página
const encomendas = ref([]); // Lista de encomendas

const tipoAtual = computed(() => store.formularioAtual);

// Carregar correspondências baseado no tipo
const carregarCorrespondencias = async (tipo) => {
  try {
    let dados;
    if (tipo === 'interno') {
      dados = await getCorrespondenciasInternas();
    } else if (tipo === 'correio') {
      dados = await getCorrespondenciasSedex();
    } else if (tipo === 'externo') {
      dados = await getCorrespondenciasExterno();
    } else {
      throw new Error(`Tipo desconhecido: ${tipo}`);
    }

    encomendas.value = dados.map((item) => ({
      ...item,
      tipo,
    }));
  } catch (error) {
    console.error('Erro ao carregar correspondências:', error);
  }
};

onMounted(async () => {
  await carregarCorrespondencias(tipoAtual.value);
});

const colunasPorTipo = {
  interno: [
    'data',
    'hora',
    'conjunto',
    'nome',
    'remetente',
    'conteudo',
    'empresa',
  ],
  correio: ['data', 'hora', 'conjunto', 'nome', 'conteudo', 'notaFiscal'],
  externo: [
    'data',
    'hora',
    'conjunto',
    'nome',
    'recebedor',
    'conteudo',
    'local',
  ],
};

// Colunas baseadas no tipo
const computedColumns = computed(() => {
  const tipo = tipoAtual.value;
  const colunas = colunasPorTipo[tipo];
  if (!colunas) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  return [
    ...colunas.map((coluna) => ({
      name: coluna,
      label: coluna.charAt(0).toUpperCase() + coluna.slice(1),
      align: 'left',
      required: true,
      field: (row) => row[coluna],
      sortable: true,
    })),
    {
      name: 'actions',
      label: 'Ações',
      align: 'center',
      required: true,
      field: () => null,
      sortable: false,
    },
  ];
});

// Itens paginados
const paginatedEncomendas = computed(() => {
  const start = (page.value - 1) * rowsPerPage.value;
  const end = page.value * rowsPerPage.value;
  return encomendas.value.slice(start, end);
});

// Total de páginas
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(encomendas.value.length / rowsPerPage.value));
});

// Navegação entre páginas
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
  }
};

const previousPage = () => {
  if (page.value > 1) {
    page.value -= 1;
  }
};

// Deletar item
const deletarItem = (item) => {
  $q.dialog({
    title: 'Deletar',
    message: `Você deseja realmente deletar a encomenda do tipo ${item.tipo}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    router.push(`/deletar-encomenda/${item.tipo}/${item.id}`);
  });
};
</script>

<style scoped lang="scss">
.custom-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
