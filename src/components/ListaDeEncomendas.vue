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
        :rows="encomendas"
        :columns="computedColumns"
        row-key="id"
        binary-state-sort
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../stores/example-store';
import { useQuasar } from 'quasar';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';

const router = useRouter();
const $q = useQuasar();
const store = useStore();

const encomendas = ref([]); // Criar uma referência para armazenar as encomendas

const tipoAtual = computed(() => store.formularioAtual);

const carregarCorrespondencias = async (tipo) => {
  try {
    let dados;
    if (tipo === 'interno') {
      dados = await getCorrespondenciasInternas();
    } else if (tipo === 'sedex') {
      dados = await getCorrespondenciasSedex();
    } else if (tipo === 'externo') {
      dados = await getCorrespondenciasExterno();
    } else {
      throw new Error(`Tipo desconhecido: ${tipo}`);
    }

    // Adiciona o tipo de encomenda a cada item
    encomendas.value = dados.map((item) => ({
      ...item,
      tipo, // Adiciona o tipo ao item
    }));
  } catch (error) {
    console.error('Erro ao carregar correspondências:', error);
  }
};

onMounted(async () => {
  await carregarCorrespondencias(tipoAtual.value); // Carregar com base no tipo atual
});

const colunasPorTipo = {
  interno: [
    'data',
    'hora',
    'conjunto',
    'destinatario',
    'remetente',
    'conteudo',
    'empresa',
  ],
  sedex: ['data', 'hora', 'conjunto', 'destinatario', 'conteudo', 'notaFiscal'],
  externo: [
    'data',
    'hora',
    'conjunto',
    'destinatario',
    'recebedor',
    'conteudo',
    'local',
  ],
};

const computedColumns = computed(() => {
  const tipo = tipoAtual.value;
  const colunas = colunasPorTipo[tipo];
  if (!colunas) {
    throw new Error(`Tipo de encomenda desconhecido: ${tipo}`);
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
const deletarItem = (item) => {
  $q.dialog({
    title: 'Deletar',
    message: `Você deseja realmente deletar a encomenda do tipo ${item.tipo}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Redireciona para a página de deleção passando o id e o tipo da encomenda
    router.push(`/deletar-encomenda/${item.tipo}/${item.id}`);
  });
};
</script>
