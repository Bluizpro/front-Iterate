<template>
  <h1 style="font-size: 1.5em; text-align: center">
    Formulário de Controle de Água
  </h1>
  <div class="border">
    <div class="controls-container">
      <div class="select-container">
        <label for="select-day">Selecionar Dia:</label>
        <select
          id="select-day"
          v-model="selectedDay"
          @change="filterDataByDay"
          class="custom-select"
        >
          <option v-for="day in uniqueDays" :key="day" :value="day">
            {{ day }}
          </option>
        </select>
      </div>
    </div>

    <div class="charts-container">
      <div v-if="loading">Carregando...</div>
      <!-- Estado de carregamento -->
      <LineChart
        class="small-chart"
        :key="chartData.labels.join('-')"
        :data="chartData"
        v-if="!loading && chartData.labels.length > 0"
      />
    </div>
  </div>
  <q-page padding>
    <FormularioAgua />
  </q-page>
</template>

<script setup>
import FormularioAgua from 'src/components/FormularioAgua.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
import { getLeiturasAgua } from '../services/leituraAguaApi';

// Registro dos componentes do Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

// Dados do gráfico
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Leituras de Água',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
});

const leiturasAgua = ref([]);
const uniqueDays = ref([]);
const selectedDay = ref('');
const loading = ref(true); // Estado de carregamento

// Função para buscar e formatar os dados
const fetchData = async () => {
  try {
    const leituras = await getLeiturasAgua();
    leiturasAgua.value = leituras;

    uniqueDays.value = [
      ...new Set(leituras.map((leitura) => leitura.dataInicial)),
    ];

    if (uniqueDays.value.length > 0) {
      selectedDay.value = uniqueDays.value[0];
      filterDataByDay();
    }
  } catch (error) {
    console.error('Erro ao buscar os dados da API:', error);
  } finally {
    loading.value = false; // Define loading como false após a busca
  }
};

// Filtragem por dia
const filterDataByDay = () => {
  const selectedDayFormatted = new Date(selectedDay.value).toLocaleDateString(
    'pt-BR'
  );
  const filteredLeituras = leiturasAgua.value.filter((leitura) => {
    const leituraDateFormatted = new Date(
      leitura.dataInicial
    ).toLocaleDateString('pt-BR');
    return leituraDateFormatted === selectedDayFormatted;
  });

  const consumos = filteredLeituras.map((leitura) => {
    const formattedLeitura = leitura.consumo
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace('m³!', '');
    return !isNaN(parseFloat(formattedLeitura))
      ? parseFloat(formattedLeitura)
      : 0;
  });

  chartData.value.labels = filteredLeituras.map(
    (leitura, index) => `${leitura.dataInicial} - Leitura ${index + 1}`
  );
  chartData.value.datasets[0].data = consumos;
};

// Configuração do intervalo para atualização automática
let intervalId;

onMounted(() => {
  fetchData(); // Chama a função inicialmente
  intervalId = setInterval(fetchData, 5000); // Atualiza a cada 5 segundos
});

// Limpeza do intervalo quando o componente é destruído
onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped lang="scss">
.charts-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.small-chart {
  width: 52% !important;
  height: 276px !important; /* Ajuste a altura do gráfico de pizza */
}

.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 2rem; /* Ajuste o padding para melhor espaçamento */
  background-color: rgb(235 208 208 / 20%);
}

.controls-container {
  display: flex; /* Alinha os elementos na mesma linha */
  align-items: center; /* Centraliza verticalmente */
  margin-bottom: 20px; /* Espaço entre os controles e os gráficos */
}

.select-container {
  margin-right: 20px; /* Espaço entre o select e os botões */
}

button {
  margin-left: 10px; /* Espaço entre os botões */
  padding: 10px 15px; /* Adiciona um pouco de espaçamento interno */
  font-size: 1em; /* Tamanho da fonte */
  color: #fff; /* Cor do texto */
  background-color: #007bff; /* Cor de fundo */
  border: none; /* Remove borda padrão */
  border-radius: 5px; /* Bordas arredondadas */
  cursor: pointer; /* Muda o cursor ao passar sobre o botão */
  transition: background-color 0.3s, transform 0.2s; /* Transição suave */
}

/* Efeito de hover para os botões */
button:hover {
  background-color: #0056b3; /* Cor de fundo ao passar o mouse */
  transform: translateY(-2px); /* Levanta o botão levemente */
}

/* Efeito de foco para acessibilidade */
button:focus {
  outline: none; /* Remove a borda de foco padrão */
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); /* Sombra ao focar */
}
.custom-select {
  padding: 10px; /* Adiciona espaçamento interno */
  font-size: 1em; /* Ajusta o tamanho da fonte */
  border: 1px solid #007bff; /* Cor da borda */
  border-radius: 5px; /* Bordas arredondadas */
  background-color: #fff; /* Cor de fundo */
  color: #333; /* Cor do texto */
  appearance: none; /* Remove o estilo padrão do select */
  cursor: pointer; /* Muda o cursor ao passar sobre o select */
  transition: border-color 0.3s; /* Transição suave para a cor da borda */

  /* Efeito de foco */
  &:focus {
    outline: none; /* Remove a borda de foco padrão */
    border-color: #0056b3; /* Cor da borda ao focar */
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); /* Sombra ao focar */
  }
}
</style>
