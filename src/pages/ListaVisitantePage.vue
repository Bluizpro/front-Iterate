<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-if="visitantesStore && visitantesStore.visitantes"
        flat
        bordered
        title="Lista de Visitantes"
        :rows="visitantesStore.visitantes"
        :columns="columns"
        row-key="conjunto"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="dataHora" :props="props">
              {{ formatarData(props.row.dataHora) }}
            </q-td>
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
            <!-- Remover a coluna de CPF -->
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

<script setup lang="ts">
import { useVisitantesStore } from '../stores/visitanteStore'; // Certifique-se de que o caminho está correto

const columns = [
  {
    name: 'dataHora',
    label: 'Data de Cadastro',
    align: 'center',
    field: 'dataHora',
    sortable: true,
  },
  {
    name: 'conjunto',
    label: 'Número do Conjunto',
    align: 'center',
    field: 'conjunto',
    sortable: true,
  },
  {
    name: 'nome',
    label: 'Nome Completo',
    align: 'center',
    field: 'nome',
    sortable: true,
  },
  // Remover a coluna de CPF
  {
    name: 'autorizacao',
    label: 'Autorização',
    align: 'center',
    field: 'autorizacao',
    sortable: true,
  },
  {
    name: 'empresa',
    label: 'Empresa',
    align: 'center',
    field: 'empresa',
    sortable: true,
  },
];

const visitantesStore = useVisitantesStore();
visitantesStore.init(); // Inicialize o visitantesStore para carregar os visitantes do localStorage

// Função para formatar a data
function formatarData(dataString: string): string {
  const data = new Date(dataString);
  if (isNaN(data.getTime())) {
    // Verifica se a data é inválida
    return '';
  }
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
</script>

<style scoped>
.q-table {
  margin: 20px;
}
.q-table td[name='setor'] {
  padding-right: 3rem !important;
}
</style>

<style scoped>
.q-table {
  margin: 20px;
}
.q-table td[name='setor'] {
  padding-right: 3rem !important;
}
</style>
