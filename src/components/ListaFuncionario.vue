<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-if="funcionariosStore && funcionariosStore.funcionarios"
        flat
        bordered
        title="Lista de Funcionarios"
        :rows="funcionariosStore.funcionarios"
        :columns="columns"
        row-key="conjunto"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="dataCadastro" :props="props">{{
              props.row.dataCadastro
            }}</q-td>
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
            <q-td key="setor" :props="props">{{ props.row.setor }}</q-td>
            <q-td key="telefone" :props="props">{{ props.row.telefone }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useFuncionariosStore } from '../stores/funcionarioStore';
const columns = [
  {
    name: 'dataCadastro',
    label: 'Data de Cadastro',
    align: 'center',
    field: 'dataCadastro', // Acessa a propriedade 'dataCadastro' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'conjunto',
    label: 'Conjunto',
    align: 'center',
    field: 'conjunto', // Acessa a propriedade 'conjunto' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'nome',
    label: 'Nome',
    align: 'center',
    field: 'nome', // Acessa a propriedade 'nome' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'setor',
    label: 'Setor',
    align: 'center',
    field: 'setor', // Acessa a propriedade 'nome' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'telefone',
    label: 'Telefone',
    field: 'telefone', // Acessa a propriedade 'telefone' do objeto da linha
    align: 'left',
  },

  // Adicione mais colunas conforme necessário
];

const funcionariosStore = useFuncionariosStore(); // Use o funcionariosStore
funcionariosStore.init(); // Inicialize o funcionariosStore para carregar os funcionarios do localStorage
</script>
<style scoped>
.q-table {
  margin: 20px; /* Ajuste este valor conforme necessário */
}
.q-table td[name='setor'] {
  padding-right: 3rem !important; /* Ajuste este valor conforme necessário */
}
</style>
../stores/funcionarioStore
