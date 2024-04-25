<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-if="visitantesStore && visitantesStore.visitantes"
        flat
        bordered
        title="Lista de Visitante"
        :rows="visitantesStore.visitantes"
        :columns="columns"
        row-key="conjunto"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
            <q-td key="cpf" :props="props">{{ props.row.cpf }}</q-td>
            <q-td key="autorizacao" :props="props">{{
              props.row.autorizacao
            }}</q-td>
            <q-td key="empresa" :props="props">{{ props.row.empresa }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { useVisitantesStore } from '../stores/visitanteStorage';
const columns = [
  {
    name: 'conjunto',
    label: 'numero do Conjunto',
    align: 'center',
    field: 'conjunto', // Acessa a propriedade 'conjunto' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'nome',
    label: 'nome Completo',
    align: 'center',
    field: 'nome', // Acessa a propriedade 'nomeCompleto' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'cpf',
    label: 'CPF ou RG',
    align: 'center',
    field: 'cpf',
    format: (val) => (val ? '*'.repeat(val.length) : ''), // Verifica se o valor existe antes de repetir o asterisco
    sortable: true,
  },
  {
    name: 'autorizacao',
    label: 'Autorização',
    align: 'center',
    field: 'autorizacao', // Acessa a propriedade 'autorizacao' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'empresa',
    label: 'Empresa',
    align: 'center',
    field: 'empresa', // Acessa a propriedade 'empresa' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
];

const visitantesStore = useVisitantesStore(); // Use o visitantesStore
visitantesStore.init(); // Inicialize o visitantesStore para carregar os visitantes do localStorage
</script>
