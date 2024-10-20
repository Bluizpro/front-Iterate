<template>
  <div class="border">
    <div class="row items-center q-gutter-md justify-center">
      <!-- Campo de busca customizado -->
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

    <div class="row q-gutter-md justify-center">
      <q-card
        v-for="encomenda in encomendasPaginadas"
        :key="encomenda.id"
        class="q-mt-xl encomenda-card rounded-card"
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

    <div class="row justify-center">
      <q-btn
        v-if="encomendasFiltradas.length > 0"
        label="Dar Baixa"
        color="indigo-14"
        class="q-mt-lg dar-baixa-btn"
        @click="exibirModalAssinatura = true"
        rounded
      />
    </div>

    <h1
      class="q-heading text-subtitle2 text-weight-medium text-center q-mt-xl"
      v-if="encomendasFiltradas.length === 0"
    >
      Não há encomendas disponíveis no momento
    </h1>

    <GeraAssinatura
      :exibirModal="exibirModalAssinatura"
      @update:exibirModal="exibirModalAssinatura = $event"
      @salvarAssinatura="darBaixa"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import GeraAssinatura from '../components/GeraAssinatura.vue';
import { getCondominos } from '../services/condonimoApi';
import { getFuncionario } from '../services/funcionarioApi';
import { getLocatario } from '../services/locatarioApi';
import { getCorrespondenciasInternas } from '../services/encomenInterAPI';
import { getCorrespondenciasSedex } from '../services/encomenSedexAPI';
import { getCorrespondenciasExterno } from '../services/encomenExternoAPI';
import { updateCorrespondenciaInternaRetirada } from '../services/encomenInterAPI';
import { updateCorrespondenciaSedexRetirada } from '../services/encomenSedexAPI';
import { updateCorrespondenciaExternoRetirada } from '../services/encomenExternoAPI';

const $q = useQuasar();

const encomendas = ref([]); // Para armazenar todas as encomendas
const exibirModalAssinatura = ref(false);
const search = ref(''); // Para armazenar o termo de pesquisa

const paginaAtual = ref(1); // Página inicial
const tamanhoPagina = 5; // Itens por página

// Função para carregar dados dos serviços de API
const carregarDados = async () => {
  try {
    const [
      dadosCondominos,
      dadosFuncionarios,
      dadosLocatarios,
      correspondenciasInternas,
      correspondenciasSedex,
      correspondenciasExternas,
    ] = await Promise.all([
      getCondominos(),
      getFuncionario(),
      getLocatario(),
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

// Computed para filtrar as encomendas com base no valor de busca (conjunto ou tipo)
const encomendasFiltradas = computed(() => {
  if (!search.value) {
    return encomendas.value;
  }

  return encomendas.value.filter((encomenda) => {
    const conjunto = String(encomenda.conjunto).toLowerCase();
    const tipo = String(encomenda.tipo).toLowerCase();
    const busca = search.value.toLowerCase();

    return conjunto.includes(busca) || tipo.includes(busca);
  });
});

// Calcular a quantidade de páginas
const totalPaginas = computed(() => {
  return Math.ceil(encomendasFiltradas.value.length / tamanhoPagina);
});

// Filtrar as encomendas para mostrar por página
const encomendasPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * tamanhoPagina;
  const fim = inicio + tamanhoPagina;
  return encomendasFiltradas.value.slice(inicio, fim);
});

// Função para dar baixa nas encomendas
const darBaixa = async () => {
  const encomendasSelecionadas = encomendasFiltradas.value.filter(
    (encomenda) => encomenda.selecionado
  );

  console.log('Encomendas selecionadas:', encomendasSelecionadas);

  for (const encomenda of encomendasSelecionadas) {
    try {
      console.log(`Dando baixa na encomenda ID: ${encomenda.id}`);

      if (encomenda.tipo === 'interno') {
        const nomePessoa = 'Tekoha'; // Nome fixo para teste
        const resposta = await updateCorrespondenciaInternaRetirada(
          encomenda.id,
          nomePessoa
        );
        console.log('Resposta da API:', resposta);
      } else if (encomenda.tipo === 'correio') {
        const nomePessoa = 'Tekoha';
        const resposta = await updateCorrespondenciaSedexRetirada(
          encomenda.id,
          nomePessoa
        );
        console.log('Resposta da API:', resposta);
      } else if (encomenda.tipo === 'externo') {
        const nomePessoa = 'Tekoha';
        const resposta = await updateCorrespondenciaExternoRetirada(
          encomenda.id,
          nomePessoa
        );
        console.log('Resposta da API:', resposta);
      }
    } catch (error) {
      console.error('Erro ao dar baixa:', error);
      $q.notify({
        type: 'negative',
        message: `Erro ao dar baixa na encomenda ${encomenda.id}`,
      });
      return; // Retorna para evitar continuar em caso de erro
    }
  }

  // Remove as encomendas que foram selecionadas
  encomendas.value = encomendas.value.filter(
    (encomenda) => !encomenda.selecionado
  );

  $q.notify({
    type: 'positive',
    message: 'Baixa realizada com sucesso',
  });
};
</script>

<style scoped>
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

/* Adicione a classe para bordas arredondadas */
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
</style>
