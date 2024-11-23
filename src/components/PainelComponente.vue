<template>
  <div class="panel-container">
    <div class="cards-container">
      <div
        v-for="(conjunto, index) in conjuntos"
        :key="index"
        class="encomenda-card"
        :class="{
          'has-encomenda': conjunto.quantidade > 0,
          'empty-card': conjunto.quantidade === 0,
        }"
        @click="handleCardClick(conjunto)"
      >
        <div class="card-header">
          <span>Conjunto {{ conjunto.andar }}</span>
        </div>
        <div class="card-body">
          <span v-if="conjunto.quantidade > 0" class="card-quantity">
            {{ conjunto.quantidade }}
          </span>
          <p v-if="conjunto.quantidade > 0">Encomenda(s) pendente(s)</p>
          <p v-else>Sem encomendas</p>
          <div v-if="conjunto.quantidade > 0" class="card-types">
            <div
              v-for="(qtde, tipo) in conjunto.tipos"
              :key="tipo"
              class="card-type"
            >
              <span>{{ tipo }}: {{ qtde }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { useRouter } from 'vue-router';

const router = useRouter();
const conjuntos = ref([]);

// Função para agrupar encomendas por conjunto e tipo
const agruparEncomendasPorConjunto = (encomendas) => {
  const agrupadosPorConjunto = {};

  encomendas.forEach((encomenda) => {
    const conjunto = encomenda.conjunto; // Identificador do andar
    const tipo = encomenda.tipo; // Tipo da encomenda

    console.log(`Agrupando encomenda - Conjunto: ${conjunto}, Tipo: ${tipo}`);

    // Inicializar o conjunto se ainda não existir
    if (!agrupadosPorConjunto[conjunto]) {
      agrupadosPorConjunto[conjunto] = {
        andar: conjunto,
        quantidade: 0,
        tipos: {}, // Objeto para armazenar os tipos e suas quantidades
      };
    }

    // Incrementar a quantidade total de encomendas no conjunto
    agrupadosPorConjunto[conjunto].quantidade++;

    // Incrementar a quantidade para o tipo específico
    if (!agrupadosPorConjunto[conjunto].tipos[tipo]) {
      agrupadosPorConjunto[conjunto].tipos[tipo] = 0;
    }
    agrupadosPorConjunto[conjunto].tipos[tipo]++;
  });

  console.log('Agrupados por conjunto:', agrupadosPorConjunto);

  return Object.values(agrupadosPorConjunto);
};

// Função para atualizar os dados das encomendas
const atualizarQuantidades = async () => {
  try {
    // Obter as encomendas de diferentes APIs
    const encomendasInternas = await getCorrespondenciasInternas();
    /*   const encomendasExternas = await getCorrespondenciasExterno(); */
    const encomendasSedex = await getCorrespondenciasSedex();

    console.log('Encomendas Internas:', encomendasInternas);
    /*  console.log('Encomendas Externos:', encomendasExternas); */
    console.log('Encomendas Sedex:', encomendasSedex);

    // Adicionar um identificador de tipo em cada conjunto de encomendas
    encomendasInternas.forEach((e) => (e.tipo = 'Interna'));
    //encomendasExternas.forEach((e) => (e.tipo = 'Externa'));
    encomendasSedex.forEach((e) => (e.tipo = 'Sedex'));

    // Unificar as encomendas e agrupar
    const todasEncomendas = [
      ...encomendasInternas,
      /*  ...encomendasExternas, */
      ...encomendasSedex,
    ];

    console.log('Todas as Encomendas:', todasEncomendas);

    conjuntos.value = agruparEncomendasPorConjunto(todasEncomendas);
  } catch (error) {
    console.error('Erro ao atualizar as encomendas:', error);
  }
};

// Configurar a atualização periódica
onMounted(() => {
  atualizarQuantidades();
  const intervaloAtualizacao = setInterval(atualizarQuantidades, 2000);

  onUnmounted(() => {
    clearInterval(intervaloAtualizacao);
  });
});

// Função para tratar clique no card
const handleCardClick = (conjunto) => {
  router.push({
    name: 'DetalhesConjunto',
    params: { andar: conjunto.andar },
  });
};
</script>

<style scoped lang="scss">
.panel-container {
  padding: 1.5rem;
  background-color: #f4f7fa; /* Cor de fundo suave */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra mais suave */
  max-width: 1200px;
  margin: 20px auto;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}

.encomenda-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Espaço entre os elementos */
  align-items: center;
  width: 100%;
  height: 200px; /* Ajustado para garantir que o conteúdo caiba */
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Sombra mais suave */
  transition: all 0.3s ease-in-out;
  background-color: #fff; /* Cor de fundo branca por padrão */
  overflow: hidden;
}

.encomenda-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Efeito de sombra maior ao passar o mouse */
}

.encomenda-card.has-encomenda {
  background-color: #fff; /* Cor vibrante para indicar encomenda */
  color: white;
}

.encomenda-card.empty-card {
  background-color: #dfe6e9; /* Cor mais neutra para vazio */
  color: #636e72;
}

.card-header {
  font-size: 1rem;
  font-weight: bold;
  color: #2d362d;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  flex-shrink: 0; /* Impede que o cabeçalho encolha */
}

.card-body {
  text-align: center;
  font-size: 1rem;
  color: #2d3436;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -1rem; /* Centraliza os itens */
}

.card-quantity {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: -0.5rem;
}

.card-body p {
  font-size: 0.9rem;
  color: #2d3436;
  margin: 0.3rem 0; /* Espaçamento consistente */
}

.card-types {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  justify-content: center; /* Centraliza os tipos de encomenda */
  align-items: center;
}

.card-type {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2d3436;
  text-align: center; /* Centraliza o texto */
}

.card-type span {
  display: block;
  background-color: #4caf50;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  text-transform: capitalize;
  max-width: 100%; /* Garante que o texto não ultrapasse o limite do card */
  overflow: hidden;
  text-overflow: ellipsis; /* Trunca texto longo com "..." */
  white-space: nowrap; /* Evita que o texto quebre em várias linhas */
}
</style>
