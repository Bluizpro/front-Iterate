<template>
  <h1 class="q-heading text-h5 text-weight-medium text-center">
    Formulário de Controle de Água
  </h1>
  <div class="q-pa-md row items-start q-gutter-md">
    <!-- Primeiro card -->
    <q-card class="my-card">
      <q-card-section>
        <div class="container">
          <h2 style="text-align: center">Leitura Inicial</h2>
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
          <h2 style="text-align: center">Leitura Parcial</h2>
          <div class="row">
            <div class="col-12">
              <q-input
                required
                disable
                name="dataMeioPeriodo"
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
                name="horaMeio"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.horaMeio"
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
                name="leituraMeioPeriodo"
                outlined
                dense
                clearable
                clear-icon="close"
                v-model="leituraAgua.leituraMeioPeriodo"
                color="indigo-13"
                label="Leitura Meio Período"
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

    <!-- Terceiro card -->
    <q-card class="my-card">
      <q-card-section>
        <div class="container">
          <h2 style="text-align: center">Leitura Final</h2>
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
<script setup>
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
  dataMeioPeriodo: new Date().toLocaleDateString(),
  horaMeio: '23:00',
  leituraMeioPeriodo: '',
  dataFinal: tomorrow.toLocaleDateString(),
  horaFinal: '06:00',
  leituraFinal: '',
  vistoFinal: '',
  consumo: '',
});

let isFormValid = computed(() => {
  return (
    leituraAgua.value.leituraInicial &&
    leituraAgua.value.leituraMeioPeriodo &&
    leituraAgua.value.leituraFinal
  );
});

async function calcular() {
  let leituraInicial = parseInt(leituraAgua.value.leituraInicial.slice(3));
  let leituraMeioPeriodo = parseInt(
    leituraAgua.value.leituraMeioPeriodo.slice(3)
  );
  let leituraFinal = parseInt(leituraAgua.value.leituraFinal.slice(3));

  let consumoMeioPeriodo = leituraMeioPeriodo - leituraInicial;
  let consumoFinal = leituraFinal - leituraInicial;

  if (consumoFinal > 6000 && Number.isInteger(consumoMeioPeriodo)) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: `O consumo ultrapassou 6000m³. Consumo atual: ${consumoFinal.toFixed(
        0
      )} m³!`,
    });

    try {
      await axios.post('http://localhost:3000/send-whatsapp', {
        message: `O consumo ultrapassou 6000m³. Consumo atual: ${consumoFinal.toFixed(
          0
        )} m³!`,
      });
      console.log('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
    }
  }

  leituraAgua.value.consumo = `${consumoFinal.toFixed(0)} m³!`;
}
</script>
<style scoped lang="scss">
.my-card {
  width: calc(33.33% - 20px);
}
.q-mb-md {
  margin-bottom: 20px;
}
.my-custom-size {
  width: 200px; /* ou qualquer tamanho que você deseja */
}
</style>
