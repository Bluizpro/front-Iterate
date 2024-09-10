<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Lista de Colaboradores"
        :rows="
          funcionariosStore.funcionarios.length > 0
            ? funcionariosStore.funcionarios
            : [{}]
        "
        :columns="columns"
        row-key="conjunto"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- Verifica se há dados no row -->
            <q-td key="dataHora" :props="props">
              <span v-if="props.row.dataHora">
                {{ formatarData(props.row.dataHora) }}
              </span>
              <span v-else> Nenhum colaborador encontrado. </span>
            </q-td>
            <q-td key="conjunto" :props="props">
              <span v-if="props.row.conjunto">
                {{ props.row.conjunto }}
              </span>
            </q-td>
            <q-td key="nome" :props="props">
              <span v-if="props.row.nome">
                {{ props.row.nome }}
              </span>
            </q-td>
            <q-td key="setor" :props="props">
              <span v-if="props.row.setor">
                {{ props.row.setor }}
              </span>
            </q-td>
            <q-td key="telefone" :props="props">
              <span v-if="props.row.telefone">
                {{ props.row.telefone }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useFuncionariosStore } from '../stores/funcionarioStore';
import { getFuncionario } from '../services/funcionarioApi';

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

const funcionariosStore = useFuncionariosStore();

onMounted(async () => {
  try {
    const funcionarios = await getFuncionario();
    funcionariosStore.funcionarios = funcionarios;
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
  }
});

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
</style>
