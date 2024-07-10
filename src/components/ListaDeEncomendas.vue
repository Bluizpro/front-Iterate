<template>
  <q-page>
    <div>
      <slot></slot>
    </div>

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Lista de Encomendas"
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
                <!--  <q-btn
                  @click="editarItem(props.row)"
                  color="positive"
                  dense
                  size="sm"
                  ><q-icon name="update"
                /></q-btn> -->
                <q-btn
                  @click="deletarItem(props.row)"
                  class="q-ml-sm"
                  color="negative"
                  dense
                  size="sm"
                  ><q-icon name="delete"
                /></q-btn>
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

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCondominosStore } from '../stores/condominosStore';
import { Delivery } from '../components/Imodels';
import { useStore } from '../stores/example-store';
import { useQuasar } from 'quasar';
import { useFuncionariosStore } from 'src/stores/funcionarioStore';

const router = useRouter();
const $q = useQuasar();
const useCondominos = useCondominosStore();
const store = useStore();
const tipoAtual = computed(() => store.formularioAtual);
const useFuncionario = useFuncionariosStore();

const colunasPorTipo: Record<string, string[]> = {
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
      label: coluna.charAt(0).toUpperCase() + coluna.slice(1), // primeira letra maiúscula
      align: 'left',
      required: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      field: (row: any) => row[coluna],
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

const encomendas = computed(() => {
  const tipo = tipoAtual.value;
  const encomendasCondominos = useCondominos.condominos.reduce(
    (acc: Delivery[], condomino) => {
      acc.push(
        ...condomino.encomendas.filter((encomenda) => encomenda.tipo === tipo)
      );
      return acc;
    },
    []
  );

  const encomendasFuncionarios = useFuncionario.funcionarios.reduce(
    (acc: Delivery[], funcionario) => {
      acc.push(
        ...funcionario.encomendas.filter((encomenda) => encomenda.tipo === tipo)
      );
      return acc;
    },
    []
  );

  return [...encomendasCondominos, ...encomendasFuncionarios];
});

/* const editarItem = (item: any) => {
  router.push(`/editar-encomenda/${item.id}`);
}; */

/* const deletarItem = (item: any) => {
  $q.dialog({
    title: 'Deletar',
    message: 'Você Deseja realmente deletar?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    router.push(`/deletar-encomenda/${item.id}`);
  });
}; */
const deletarItem = (item: Delivery) => {
  $q.dialog({
    title: 'Deletar',
    message: 'Você Deseja realmente deletar?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    router.push(`/deletar-encomenda/${item.id}`);
  });
};
</script>
../stores/condominosStore src/stores/funcionarioStore
