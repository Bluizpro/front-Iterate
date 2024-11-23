<template>
  <div class="border">
    <!-- Campo de busca customizado -->
    <div class="row items-center q-gutter-md justify-center">
      <div class="search-input">
        <input
          id="search"
          type="text"
          v-model="search"
          placeholder="Pesquisar por conjunto ou tipo de encomenda"
        />
        <i class="material-icons search-icon" v-if="!search">search</i>
      </div>
    </div>
    <!-- Campo de seleção para escolher o tipo -->
    <div class="row q-gutter-md justify-center">
      <select class="custom-select" v-model="tipoSelecionado">
        <option value="">Selecione o Tipo</option>
        <option value="interno">Interno e Sedex</option>
        <option value="externo">Externo</option>
      </select>
    </div>

    <!-- Legenda de cores para tipos de encomenda -->
    <div class="color-legend-card">
      <div class="color-legend">
        <span class="legend-item">
          <span class="legend-color square-interno"></span> Interno
        </span>
        <span class="legend-item">
          <span class="legend-color square-correio"></span> Correio
        </span>
        <span class="legend-item">
          <span class="legend-color square-externo"></span> Externo
        </span>
      </div>
    </div>

    <!-- Encomendas filtradas pelo tipo selecionado -->
    <div class="row q-gutter-md justify-center">
      <q-card
        v-for="encomenda in encomendasFiltradasPorTipoPaginada"
        :key="encomenda.id"
        :class="[
          'q-mt-xl',
          'encomenda-card',
          'rounded-card',
          encomenda.tipo === 'interno' ? 'bg-interno' : '',
          encomenda.tipo === 'correio' ? 'bg-correio' : '',
          encomenda.tipo === 'externo' ? 'bg-externo' : '',
        ]"
        @click="handleCardClick(encomenda)"
      >
        <q-card-section>
          <q-checkbox v-model="encomenda.selecionado" label="Selecionar" />
          <p>Data: {{ encomenda.data }}</p>
          <p>Hora: {{ encomenda.hora }}</p>
          <p>Destinatário: {{ encomenda.nome }}</p>
          <p>Conjunto: {{ encomenda.conjunto }}</p>
          <p>Conteúdo: {{ encomenda.conteudo }}</p>
          <p>
            Encomenda: {{ encomenda.tipo }}
            <span class="classification">
              <span
                :class="{
                  'square-interno': encomenda.tipo === 'interno',
                  'square-correio': encomenda.tipo === 'correio',
                  'square-externo': encomenda.tipo === 'externo',
                }"
                class="classification-square"
              ></span>
            </span>
          </p>
        </q-card-section>
      </q-card>
    </div>

    <!-- Componente de paginação -->
    <div class="row justify-center q-mt-lg">
      <q-pagination
        v-model="paginaAtual"
        :max="totalPaginas"
        color="indigo"
        boundary-numbers
        dense
        @update:model-value="paginaAtual = $event"
      />
    </div>

    <!--    <div class="row justify-center">
      <q-btn
        v-if="encomendasFiltradasPorTipo.length > 0"
        label="Dar Baixa"
        color="indigo-14"
        class="q-mt-lg dar-baixa-btn"
        @click="exibirModalAssinatura = true"
        rounded
      />
    </div> -->

    <!-- Mensagem de aviso dependendo da situação -->
    <h1
      class="q-heading text-subtitle2 text-weight-medium text-center q-mt-xl"
      v-if="!tipoSelecionado && encomendasFiltradas.length > 0"
    >
      Selecione o tipo de encomenda
    </h1>
    <h1
      class="q-heading text-subtitle2 text-weight-medium text-center q-mt-xl"
      v-if="tipoSelecionado && encomendasFiltradasPorTipo.length === 0"
    >
      Não há encomendas disponíveis no momento
    </h1>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Importando o router
import { useQuasar } from 'quasar';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';

const $q = useQuasar();
const router = useRouter(); // Instanciando o router

const encomendas = ref([]); // Para armazenar todas as encomendas
//const exibirModalAssinatura = ref(false);
const tipoSelecionado = ref(null); // Para armazenar o tipo selecionado
const search = ref(''); // Para armazenar o termo de pesquisa

const paginaAtual = ref(1); // Página inicial
const tamanhoPagina = 5; // Itens por página

// Função para carregar dados dos serviços de API
const carregarDados = async () => {
  try {
    const [
      correspondenciasInternas,
      correspondenciasSedex,
      correspondenciasExternas,
    ] = await Promise.all([
      getCorrespondenciasInternas(),
      getCorrespondenciasSedex(),
      getCorrespondenciasExterno(),
    ]);

    encomendas.value = [
      ...correspondenciasInternas,
      ...correspondenciasSedex,
      ...correspondenciasExternas,
    ];
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados',
    });
  }
};

// Carregar os dados ao montar o componente
carregarDados();

// Computed para filtrar as encomendas com base no valor de busca
const encomendasFiltradas = computed(() => {
  if (!search.value) {
    return encomendas.value;
  }

  return encomendas.value.filter((encomenda) => {
    const tipo = String(encomenda.tipo).toLowerCase();
    const nome = String(encomenda.nome).toLowerCase(); // Adicionei o campo 'nome'
    const conjunto = String(encomenda.conjunto).toLowerCase();
    const busca = search.value.toLowerCase();

    return (
      tipo.includes(busca) || nome.includes(busca) || conjunto.includes(busca)
    ); // Verifica se 'tipo' ou 'nome' contém o texto buscado
  });
});
// Filtrar as encomendas com base no tipo selecionado
const encomendasFiltradasPorTipo = computed(() => {
  // Não exibir encomendas se nenhum tipo for selecionado
  if (!tipoSelecionado.value) {
    return [];
  }

  // Filtrar encomendas de acordo com o tipo selecionado
  if (tipoSelecionado.value === 'interno') {
    return encomendasFiltradas.value.filter(
      (encomenda) =>
        encomenda.tipo === 'interno' || encomenda.tipo === 'correio'
    );
  }

  if (tipoSelecionado.value === 'externo') {
    return encomendasFiltradas.value.filter(
      (encomenda) => encomenda.tipo === 'externo'
    );
  }

  return [];
});

// Calcular a quantidade de páginas
const totalPaginas = computed(() => {
  return Math.ceil(encomendasFiltradasPorTipo.value.length / tamanhoPagina);
});

// Computed para paginação das encomendas filtradas
const encomendasFiltradasPorTipoPaginada = computed(() => {
  const start = (paginaAtual.value - 1) * tamanhoPagina;
  const end = start + tamanhoPagina;
  return encomendasFiltradasPorTipo.value.slice(start, end);
});

// Função para lidar com o clique no card
const handleCardClick = (encomenda) => {
  if (encomenda.tipo === 'externo') {
    router.push({
      name: 'FormularioExternoBaixa',
      params: { id: encomenda.id },
    });
  } else if (encomenda.tipo === 'interno') {
    router.push({
      name: 'FormularioInternoBaixa',
      params: { id: encomenda.id },
    });
  } else if (encomenda.tipo === 'correio') {
    router.push({
      name: 'FormularioCorreioBaixa', // Rota para o formulário de correio
      params: { id: encomenda.id },
    });
  }
};

// Função para dar baixa nas encomendas
/* const darBaixa = async () => {
  const encomendasSelecionadas = encomendasFiltradasPorTipo.value.filter(
    (encomenda) => encomenda.selecionado
  );

  console.log('Encomendas selecionadas:', encomendasSelecionadas);

  for (const encomenda of encomendasSelecionadas) {
    try {
      let redirectUrl;

      // Verificar o tipo da encomenda e definir a rota de redirecionamento
      if (encomenda.tipo === 'interno') {
        redirectUrl = {
          name: 'FormularioInternoBaixa', // Rota para encomenda interna
          params: { id: encomenda.id },
        };
      } else if (encomenda.tipo === 'correio') {
        redirectUrl = {
          name: 'FormularioCorreioBaixa', // Nova rota para encomenda de correio
          params: { id: encomenda.id },
        };
      } else if (encomenda.tipo === 'externo') {
        redirectUrl = {
          name: 'FormularioExternoBaixa', // Rota para encomenda externa
          params: { id: encomenda.id },
        };
      }

      // Verificando se existe uma URL de redirecionamento
      if (redirectUrl) {
        // Realizando o redirecionamento para a rota correta
        router.push(redirectUrl);
      } else {
        // Caso não encontre o tipo da encomenda esperado
        $q.notify({
          type: 'negative',
          message: 'Tipo de encomenda não reconhecido',
        });
      }
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao dar baixa na encomenda',
      });
    }
  }
}; */
</script>

<style scoped>
/* Estilos existentes mantidos */
.encomenda-card {
  cursor: pointer;
}

.encomenda-card:hover {
  background-color: #f0f0f0;
}

/* Estilo do campo de pesquisa */
.search-input {
  position: relative;
  width: 300px;
}

.search-input input {
  width: 100%;
  padding: 12px;
  padding-left: 30px;
  border: 1px solid #ccc;
  border-radius: 15px;
}

.search-icon {
  position: absolute;
  left: 13px;
  top: 15px;
  color: #888;
}

.encomenda-card {
  max-width: 400px;
}

/* Adiciona a classe para bordas arredondadas */
.rounded-card {
  border-radius: 15px; /* Ajuste o valor conforme necessário */
}

/* Classes de cor para o quadrado de classificação */
.classification {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.classification-square {
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 3px;
  margin-left: 5px;
}

/* Cores para os tipos de encomenda */
.square-interno {
  background-color: yellow;
}

.square-correio {
  background-color: red;
}

.square-externo {
  background-color: green;
}

.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}

.color-legend-card {
  background-color: #e0e0e0;
  border-radius: 11px;
  padding: 10px 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  margin-left: -1rem;
  margin-right: 68%;
  margin-top: 1rem;
}

.color-legend {
  display: flex;
  gap: 15px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 5px;
}

.square-interno {
  background-color: yellow;
}

.square-correio {
  background-color: red;
}

.square-externo {
  background-color: green;
}
.bg-interno {
  background-color: yellow !important;
}

.bg-correio {
  background-color: red !important;
  color: white; /* Ajuste para texto mais visível */
}

.bg-externo {
  background-color: green !important;
  color: white; /* Ajuste para texto mais visível */
}

/* Novo estilo para o select e a pesquisa */

/* Container do select e do campo de pesquisa, para alinhá-los lado a lado */
.search-container {
  display: flex;
  gap: 20px; /* Espaçamento entre o campo de pesquisa e o select */
  align-items: center;
  margin-bottom: 20px; /* Distância do topo */
}

/* Estilo do select */
.custom-select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 15px;
  width: 200px; /* Ajuste o tamanho conforme necessário */
  background-color: #fff;
  font-size: 14px;
  color: #333;
  appearance: none; /* Remove a setinha padrão do select */
  -webkit-appearance: none;
  -moz-appearance: none;
  margin-left: 35rem;
  margin-top: -2rem;
  position: relative;
}

/* Estilo para a setinha do select */
.custom-select::after {
  content: '▼';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 14px;
}

/* Efeito ao passar o mouse sobre o select */
.custom-select:hover {
  border-color: #6c63ff;
  background-color: #f9f9f9;
}

/* Foco no select */
.custom-select:focus {
  outline: none;
  border-color: #6c63ff;
  box-shadow: 0 0 5px rgba(102, 63, 255, 0.5);
}
</style>
