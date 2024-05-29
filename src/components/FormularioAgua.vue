<template>
  <h1 class="q-heading text-h5 text-weight-medium text-center">
    Formulário de Controle de Água
  </h1>
  <div class="q-pa-md row items-start q-gutter-md">
    <!-- Primeiro card -->
    <q-card class="my-card">
      <q-card-section>
        <div class="container">
          <h6 style="text-align: center">Leitura Inicial</h6>
          <div class="row">
            <div class="col-12">
              <q-input
                required
                disable
                name="data"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.data"
                color="indigo-13"
                label="Data"
                class="my-custom-size"
                :rules="[(val) => (val && val.length > 0) || 'Digite a data']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                required
                disable
                name="hora"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.hora"
                color="indigo-13"
                label="Hora"
                class="my-custom-size"
                :rules="[(val) => (val && val.length > 0) || 'Digite a hora']"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                required
                name="leituraInicial"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.leituraInicial"
                color="indigo-13"
                label="Leitura Inicial"
                class="my-custom-size"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Digite a leitura Inicial',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="book" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- Segundo card -->
    <q-card class="my-card">
      <q-card-section>
        <div class="container">
          <h6 style="text-align: center">Leitura Parcial</h6>
          <div class="row">
            <div class="col-12">
              <q-input
                required
                disable
                name="dataParcial"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.data"
                color="indigo-13"
                label="Data"
                class="my-custom-size"
                :rules="[(val) => (val && val.length > 0) || 'Digite a data']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            <div class="col-10">
              <q-input
                required
                disable
                name="horaMeio"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.Parcial"
                color="indigo-13"
                label="Hora Parcial"
                class="my-custom-size"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Digite a hora Meio periodo',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
            <div class="col-10">
              <q-input
                required
                name="leituraParcial"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.leituraParcial"
                color="indigo-13"
                label="Leitura Parcial"
                class="my-custom-size"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Digite a leitura Meio Periodo',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="book" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- terceiro card -->
    <q-card class="my-card">
      <q-card-section>
        <div class="container">
          <h6 style="text-align: center">Leitura Parcial 2</h6>
          <div class="row">
            <div class="col-12">
              <q-input
                required
                disable
                name="dataParcial"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.data"
                color="indigo-13"
                label="Data"
                class="my-custom-size"
                :rules="[(val) => (val && val.length > 0) || 'Digite a data']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                required
                disable
                name="horaParcial"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.horaParcial2"
                color="indigo-13"
                label="Hora Meio Período"
                class="my-custom-size"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Digite a hora Meio periodo',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                required
                name="leituraMeio"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.leituraParcial2"
                color="indigo-13"
                label="Leitura Parcial 2"
                class="my-custom-size"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Digite a leitura Meio Periodo',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="book" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <!-- quarto card -->
    <q-card class="my-card">
      <q-card-section>
        <div class="container">
          <h6 style="text-align: center">Leitura Final</h6>
          <div class="row">
            <div class="col-12">
              <q-input
                required
                disable
                name="dataFinal"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.dataFinal"
                color="indigo-13"
                label="Data Final"
                class="my-custom-size"
                :rules="[
                  (val) => (val && val.length > 0) || 'Digite a data final',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                required
                disable
                name="horaFinal"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.horaFinal"
                color="indigo-13"
                label="Hora Final"
                class="my-custom-size"
                :rules="[
                  (val) => (val && val.length > 0) || 'Digite a hora final',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                required
                name="leituraFinal"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.leituraFinal"
                color="indigo-13"
                label="Leitura Final"
                class="my-custom-size"
                :rules="[
                  (val) => (val && val.length > 0) || 'Digite a leitura final',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="book" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="row q-gutter-md">
      <!-- Botão de Calcular -->
      <div class="q-mt-lg">
        <q-btn
          label="Calcular"
          type="button"
          rounded
          color="indigo-14"
          :disable="!leituraAgua.leituraFinal || !leituraAgua.leituraFinal"
          v-on:click="calcular"
        ></q-btn>
      </div>
      <q-input
        disable
        name="consumo"
        outlined
        clearable
        clear-icon="close"
        v-model="leituraAgua.consumo"
        color="indigo-15"
        label="Consumo"
        :rules="[(val) => val && val.length > 0]"
      >
        <template v-slot:prepend>
          <q-icon name="local_drink" />
        </template>
      </q-input>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios'; // Importe o axios
const $q = useQuasar();

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

let leituraAgua = ref({
  data: new Date().toLocaleDateString(),
  hora: new Date().toLocaleTimeString(),
  leituraInicial: '',
  vistoInicial: '',
  dataParcial: new Date().toLocaleDateString(),
  Parcial: '11:00',
  leituraParcial: '',
  dataMeio: new Date().toLocaleDateString(),
  horaParcial2: '23:00',
  leituraParcial2: '',
  dataFinal: tomorrow.toLocaleDateString(),
  horaFinal: '06:00',
  leituraFinal: '',
  vistoFinal: '',
  consumo: '',
});

let isFormValid = computed(() => {
  return (
    leituraAgua.value.leituraInicial &&
    leituraAgua.value.leituraParcial &&
    leituraAgua.value.leituraFinal
  );
});

async function calcular() {
  let leituraInicial = parseInt(leituraAgua.value.leituraInicial.slice(3));
  let leituraParcial = parseInt(leituraAgua.value.leituraParcial.slice(3));
  let leituraParcial2 = parseInt(leituraAgua.value.leituraParcial2.slice(3));
  let leituraFinal = parseInt(leituraAgua.value.leituraFinal.slice(3));

  let consumo = leituraParcial - leituraParcial2 - leituraInicial;
  let consumoFinal = leituraFinal - leituraInicial;

  consumoFinal = Number(consumoFinal.toFixed(2));

  if (consumoFinal > 6000 && !isNaN(consumo)) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: `O consumo ultrapassou 6000m³. Consumo atual: ${consumoFinal} m³!`,
    });

    try {
      await axios.post('http://localhost:3000/send-whatsapp', {
        message: `O consumo ultrapassou 6000m³. Consumo atual: ${consumoFinal} m³!`,
      });
      console.log('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
    }
  }

  leituraAgua.value.consumo = `${consumoFinal} m³!`;
}
</script>

<style scoped lang="scss">
.my-card {
  width: calc(19rem - 30px); // 25% da largura total, menos 20px de margem
  margin-right: 50px;
}

.my-card:last-child {
  margin-right: 0; // remove a margem do último cartão
}

.q-mb-md {
  margin-bottom: 20px;
}

.my-custom-size {
  width: 150px; // ou qualquer tamanho que você deseja
}
</style>
