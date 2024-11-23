<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-if="visitantesStore && visitantesStore.visitantes"
        flat
        bordered
        title="Lista de Visitantes"
        :rows="visitantesPaginados"
        :columns="columns"
        row-key="id"
        binary-state-sort
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="dataHora" :props="props">
              {{ formatarDataHora(props.row.dataHora) }}
            </q-td>
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
            <q-td key="autorizacao" :props="props">
              {{ props.row.autorizacao }}
            </q-td>
            <q-td key="empresa" :props="props">{{ props.row.empresa }}</q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- Centralizar a paginação -->
      <div class="paginacao-centralizada">
        <q-btn
          icon="chevron_left"
          @click="paginaAtual > 1 && (paginaAtual -= 1)"
          :disable="paginaAtual === 1"
          color="primary"
          flat
          round
          style="margin-right: 8px"
        />
        <span>Página {{ paginaAtual }} de {{ numeroTotalPaginas }}</span>
        <q-btn
          icon="chevron_right"
          @click="paginaAtual < numeroTotalPaginas && (paginaAtual += 1)"
          :disable="paginaAtual >= numeroTotalPaginas"
          color="primary"
          flat
          round
          style="margin-left: 8px"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

const paginaAtual = ref(1);
const visitantesPorPagina = 15;

// Calcula o número total de páginas com base na quantidade de visitantes
const numeroTotalPaginas = computed(() => {
  return Math.ceil(visitantesStore.visitantes.length / visitantesPorPagina);
});

// Computed para obter os visitantes da página atual
const visitantesPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * visitantesPorPagina;
  const fim = inicio + visitantesPorPagina;
  return visitantesStore.visitantes.slice(inicio, fim);
});

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

// Função para verificar e remover visitantes que passaram de 24 horas
async function verificarEExcluirVisitantes() {
  const agora = new Date();
  const vinteQuatroHorasEmMilissegundos = 24 * 60 * 60 * 1000;

  const visitantesParaRemover = visitantesStore.visitantes.filter(
    (visitante) => {
      const dataCadastro = new Date(visitante.dataHora);
      const diferencaTempo = agora.getTime() - dataCadastro.getTime();
      return diferencaTempo > vinteQuatroHorasEmMilissegundos;
    }
  );

  for (const visitante of visitantesParaRemover) {
    await visitantesStore.removerVisitante(visitante.id);
    console.log(`Visitante com ID ${visitante.id} foi removido após 24 horas.`);
  }
}

// Rodar a verificação a cada minuto
setInterval(verificarEExcluirVisitantes, 60 * 1000);
</script>

<style scoped>
.q-table {
  margin: 20px;
}
.paginacao-centralizada {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
