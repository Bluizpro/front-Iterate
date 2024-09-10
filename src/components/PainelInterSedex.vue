<template>
  <div class="q-mr-xl">
    <q-chip dense :class="getChipClass(quantidadeEncomendasInterno)">
      <span class="centered-text">Interno:</span>
      <q-badge
        :class="getBadgeClass(quantidadeEncomendasInterno)"
        class="text-subtitle2"
        >{{ quantidadeEncomendasInterno }}</q-badge
      >
    </q-chip>
    <q-chip dense :class="getChipClass(quantidadeEncomendasSedex)">
      <span class="centered-text">Sedex:</span>
      <q-badge
        :class="getBadgeClass(quantidadeEncomendasSedex)"
        class="text-subtitle2"
        >{{ quantidadeEncomendasSedex }}</q-badge
      >
    </q-chip>
    <q-chip dense :class="getChipClass(quantidadeEncomendasExterno)">
      <span class="centered-text">Externo:</span>
      <q-badge
        :class="getBadgeClass(quantidadeEncomendasExterno)"
        class="text-subtitle2"
        >{{ quantidadeEncomendasExterno }}</q-badge
      >
    </q-chip>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';

const quantidadeEncomendasInterno = ref(0);
const quantidadeEncomendasSedex = ref(0);
const quantidadeEncomendasExterno = ref(0);

const getChipClass = (quantidade) => {
  if (quantidade < 10) {
    return 'chip-blue';
  } else if (quantidade < 25) {
    return 'chip-orange';
  } else {
    return 'chip-purple';
  }
};

const getBadgeClass = (quantidade) => {
  if (quantidade < 10) {
    return 'badge-blue';
  } else if (quantidade < 25) {
    return 'badge-orange';
  } else {
    return 'badge-purple';
  }
};

// Função para atualizar as quantidades de encomendas
const atualizarQuantidades = async () => {
  try {
    // Inicializa a variável quantidades
    const quantidades = {
      interno: 0,
      sedex: 0,
      externo: 0,
    };

    // Atualiza quantidades de encomendas internas
    const encomendasInternas = await getCorrespondenciasInternas();
    encomendasInternas.forEach((encomenda) => {
      switch (encomenda.tipo) {
        case 'interno':
          quantidades.interno++;
          break;
        case 'sedex':
          quantidades.sedex++;
          break;
        case 'externo':
          quantidades.externo++;
          break;
        default:
          console.warn(`Tipo de encomenda desconhecido: ${encomenda.tipo}`);
          break;
      }
    });

    // Atualiza quantidades de encomendas externas
    const encomendasExternas = await getCorrespondenciasExterno();
    encomendasExternas.forEach((encomenda) => {
      if (encomenda.tipo === 'externo') {
        quantidades.externo++;
      }
    });

    // Atualiza quantidades de encomendas sedex
    const encomendasSedex = await getCorrespondenciasSedex();
    encomendasSedex.forEach((encomenda) => {
      if (encomenda.tipo === 'sedex') {
        quantidades.sedex++;
      }
    });

    // Atualiza o estado com as quantidades finais
    quantidadeEncomendasInterno.value = quantidades.interno;
    quantidadeEncomendasSedex.value = quantidades.sedex;
    quantidadeEncomendasExterno.value = quantidades.externo;

    console.log('Quantidades atualizadas:', quantidades);
  } catch (error) {
    console.error('Erro ao atualizar quantidades:', error);
  }
};

onMounted(() => {
  atualizarQuantidades();
});
</script>

<style scoped>
.centered-text {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.chip-blue {
  background-color: #0905e6 !important;
  color: white;
}

.badge-blue {
  background-color: #0905e6 !important;
  color: white;
}
</style>
