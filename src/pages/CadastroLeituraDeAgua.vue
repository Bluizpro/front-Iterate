<template>
  <h1 style="font-size: 1.5em; text-align: center">
    Formulário de Controle de Água
  </h1>
  <div class="border">
    <div class="select-container">
      <label for="select-day">Selecionar Dia:</label>
      <select id="select-day" v-model="selectedDay" @change="filterDataByDay">
        <option v-for="day in uniqueDays" :key="day" :value="day">
          {{ day }}
        </option>
      </select>
    </div>
    <div class="charts-container">
      <LineChart
        class="small-chart"
        :key="chartData.labels.join('-')"
        :data="chartData"
        v-if="chartData.labels.length > 0"
      />
    </div>
  </div>
  <q-page padding>
    <FormularioAgua />
  </q-page>
</template>

<script setup>
import FormularioAgua from 'src/components/FormularioAgua.vue';
import { ref, onMounted } from 'vue';
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

// Registrando os componentes do Chart.js
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

// Função para buscar e formatar os dados
const fetchData = async () => {
  try {
    const leituras = await getLeiturasAgua();
    leiturasAgua.value = leituras;

    // Extraindo dias únicos para o select
    uniqueDays.value = [
      ...new Set(leituras.map((leitura) => leitura.dataInicial)),
    ];

    // Definir o dia selecionado como o primeiro disponível
    selectedDay.value = uniqueDays.value[0];

    filterDataByDay(); // Filtrar os dados para o primeiro dia
  } catch (error) {
    console.error('Erro ao buscar os dados da API:', error);
  }
};

// Função para filtrar os dados por dia selecionado
const filterDataByDay = () => {
  const selectedDayFormatted = new Date(selectedDay.value).toLocaleDateString(
    'pt-BR'
  );
  console.log('Dia selecionado formatado:', selectedDayFormatted);

  const filteredLeituras = leiturasAgua.value.filter((leitura) => {
    const leituraDateFormatted = new Date(
      leitura.dataInicial
    ).toLocaleDateString('pt-BR');
    console.log('Data da leitura formatada:', leituraDateFormatted);
    return leituraDateFormatted === selectedDayFormatted;
  });

  console.log('Leituras filtradas:', filteredLeituras);

  const consumos = filteredLeituras.map((leitura) => {
    const formattedLeitura = leitura.consumo
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace('m³!', '');
    const consumoNum = parseFloat(formattedLeitura);
    return !isNaN(consumoNum) ? consumoNum : 0;
  });

  chartData.value.labels = filteredLeituras.map(
    (leitura, index) => `${leitura.dataInicial} - Leitura ${index + 1}`
  );
  chartData.value.datasets[0].data = consumos;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.charts-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.small-chart {
  width: 60% !important;
  height: 400px !important; /* Ajuste a altura fixa */
}
.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}

.select-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.select-container label {
  margin-right: 10px;
  font-weight: bold;
}

.select-container select {
  padding: 8px 12px;
  border: 2px solid #ccc;
  border-radius: 20px; /* Ajuste do arredondamento */
  background-color: #f9f9f9;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.select-container select:focus {
  border-color: #1e90ff; /* Cor da borda ao focar */
}

.select-container select:hover {
  border-color: #4682b4; /* Cor da borda ao passar o mouse */
}
</style>
