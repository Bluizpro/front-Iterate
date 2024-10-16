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
        row-key="id"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="dataHora" :props="props">
              {{ formatarDataHora(props.row.dataHora) }}
            </q-td>
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
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
import { useVisitantesStore } from '../stores/visitanteStore';

const columns = [
  {
    name: 'dataHora',
    label: 'Data de Cadastro',
    align: 'center' as const,
    field: 'dataHora',
    sortable: true,
  },
  {
    name: 'conjunto',
    label: 'Número do Conjunto',
    align: 'center' as const,
    field: 'conjunto',
    sortable: true,
  },
  {
    name: 'nome',
    label: 'Nome Completo',
    align: 'center' as const,
    field: 'nome',
    sortable: true,
  },
  {
    name: 'autorizacao',
    label: 'Autorização',
    align: 'center' as const,
    field: 'autorizacao',
    sortable: true,
  },
  {
    name: 'empresa',
    label: 'Empresa',
    align: 'center' as const,
    field: 'empresa',
    sortable: true,
  },
];

const visitantesStore = useVisitantesStore();
visitantesStore.init(); // Inicialize o visitantesStore para carregar os visitantes da API

// Função para formatar a data e a hora
function formatarDataHora(dataString: string): string {
  const data = new Date(dataString);
  if (isNaN(data.getTime())) {
    return '';
  }
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');
  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

// Função para verificar e remover visitantes que passaram de 15 minutos
async function verificarEExcluirVisitantes() {
  const agora = new Date();
  const doisMinutosEmMilissegundos = 2 * 60 * 1000; // 2 minutos

  // Filtrar visitantes que já passaram de 2 minutos desde o cadastro
  const visitantesParaRemover = visitantesStore.visitantes.filter(
    (visitante) => {
      const dataCadastro = new Date(visitante.dataHora);
      const diferencaTempo = agora.getTime() - dataCadastro.getTime();
      return diferencaTempo > doisMinutosEmMilissegundos;
    }
  );

  // Remove visitantes que passaram de 2 minutos
  for (const visitante of visitantesParaRemover) {
    await visitantesStore.removerVisitante(visitante.id); // Remover via API usando ID
  }
}

// Rodar a verificação a cada minuto
setInterval(verificarEExcluirVisitantes, 60 * 1000); // Verifica a cada 1 minuto
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
