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
      <span class="centered-text">Correio:</span>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';

const quantidadeEncomendasInterno = ref(0);
const quantidadeEncomendasSedex = ref(0);
const quantidadeEncomendasExterno = ref(0);

const getChipClass = (quantidade) => {
  if (quantidade < 18) {
    return 'chip-blue';
  } else if (quantidade < 25) {
    return 'chip-orange';
  } else {
    return 'chip-purple';
  }
};

const getBadgeClass = (quantidade) => {
  if (quantidade < 18) {
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
    const quantidades = { interno: 0, correio: 0, externo: 0 };

    // Atualiza quantidades de encomendas internas
    const encomendasInternas = await getCorrespondenciasInternas();
    encomendasInternas.forEach((encomenda) => {
      if (encomenda.tipo === 'interno') quantidades.interno++;
      if (encomenda.tipo === 'correio') quantidades.correio++;
      if (encomenda.tipo === 'externo') quantidades.externo++;
    });

    // Atualiza quantidades de encomendas externas
    const encomendasExternas = await getCorrespondenciasExterno();
    encomendasExternas.forEach((encomenda) => {
      if (encomenda.tipo === 'externo') quantidades.externo++;
    });

    // Atualiza quantidades de encomendas sedex
    const encomendasSedex = await getCorrespondenciasSedex();
    encomendasSedex.forEach((encomenda) => {
      if (encomenda.tipo === 'correio') quantidades.correio++;
    });

    // Atualiza o estado com as quantidades finais
    quantidadeEncomendasInterno.value = quantidades.interno;
    quantidadeEncomendasSedex.value = quantidades.correio;
    quantidadeEncomendasExterno.value = quantidades.externo;
  } catch (error) {
    console.error('Erro ao atualizar quantidades:', error);
  }
};

onMounted(() => {
  // Atualiza inicialmente as quantidades
  atualizarQuantidades();

  // Configura o intervalo de atualização a cada 5 segundos
  const intervaloAtualizacao = setInterval(atualizarQuantidades, 5000);

  // Limpa o intervalo ao desmontar o componente
  onUnmounted(() => {
    clearInterval(intervaloAtualizacao);
  });
});
</script>
<!-- <script setup>
import { ref, onMounted, watch } from 'vue';
import { useEncomendasStore } from '../stores/encomendaStore';

const encomendasStore = useEncomendasStore();

const quantidadeEncomendasInterno = ref(0);
const quantidadeEncomendasSedex = ref(0);
const quantidadeEncomendasExterno = ref(0);

const getChipClass = (quantidade) => {
  if (quantidade < 18) {
    return 'chip-blue';
  } else if (quantidade < 25) {
    return 'chip-orange';
  } else {
    return 'chip-purple';
  }
};

const getBadgeClass = (quantidade) => {
  if (quantidade < 18) {
    return 'badge-blue';
  } else if (quantidade < 25) {
    return 'badge-orange';
  } else {
    return 'badge-purple';
  }
};

// Função para atualizar as quantidades de encomendas
const atualizarQuantidades = () => {
  quantidadeEncomendasInterno.value =
    encomendasStore.getTotalEncomendasInternas;
  quantidadeEncomendasSedex.value = encomendasStore.getTotalEncomendasSedex;
  quantidadeEncomendasExterno.value =
    encomendasStore.getTotalEncomendasExternas;
};

onMounted(async () => {
  // Atualiza as encomendas inicialmente
  await encomendasStore.fetchEncomendasInternas();
  await encomendasStore.fetchEncomendasExternas();
  await encomendasStore.fetchEncomendasSedex();

  // Atualiza as quantidades após a inicialização
  atualizarQuantidades();

  // Adiciona um watcher para atualizar as quantidades sempre que a store mudar
  watch(
    () => [
      encomendasStore.getTotalEncomendasInternas,
      encomendasStore.getTotalEncomendasExternas,
      encomendasStore.getTotalEncomendasSedex,
    ],
    () => {
      atualizarQuantidades();
    }
  );
});
</script> -->

<style scoped>
.centered-text {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px; /* Ajuste o tamanho da fonte */
  max-width: 100px; /* Limita o tamanho para evitar que aumente demais */
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; /* Tamanho fixo para o badge */
  height: 32px;
  border-radius: 50%;
  font-size: 14px; /* Tamanho fixo da fonte */
  background-color: #0905e6 !important; /* Cor de fundo fixa */
  color: white;
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
