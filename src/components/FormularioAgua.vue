<template>
  <div>
    <h1 style="font-size: 1.5em; text-align: center">
      Formulário de Controle de Água
    </h1>
    <form @submit.prevent="submitForm">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input
            readonly
            required
            name="data"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.data"
            color="indigo-13"
            label="Data"
            :rules="[(val) => (val && val.length > 0) || 'Digite a data']"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-input
            readonly
            required
            name="hora"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.hora"
            color="indigo-13"
            label="Hora"
            :rules="[(val) => (val && val.length > 0) || 'Digite a hora']"
          >
            <template v-slot:prepend>
              <q-icon name="access_time" />
            </template>
          </q-input>

          <q-input
            required
            name="leituraInicial"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.leituraInicial"
            color="indigo-13"
            label="Leitura Inicial"
            :rules="[
              (val) => (val && val.length > 0) || 'Digite a leitura inicial',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-input>

          <q-input
            required
            name="vistoinicial"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.vistoInicial"
            color="indigo-13"
            label=""
            :rules="[(val) => (val && val.length > 0) || '']"
          >
            <template v-slot:prepend>
              <q-icon name="visibility" />
              <q-item-label>{{ usuarioLogado }}</q-item-label>
            </template>
          </q-input>
        </div>

        <div class="col-6">
          <q-input
            readonly
            required
            name="dataFinal"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.dataFinal"
            color="indigo-13"
            label="Data Final"
            :rules="[(val) => (val && val.length > 0) || 'Digite a data final']"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <q-input
            readonly
            required
            name="horaFinal"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.horaFinal"
            color="indigo-13"
            label="Hora Final"
            :rules="[(val) => (val && val.length > 0) || 'Digite a hora final']"
          >
            <template v-slot:prepend>
              <q-icon name="access_time" />
            </template>
          </q-input>

          <q-input
            required
            name="leituraFinal"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.leituraFinal"
            color="indigo-13"
            label="Leitura Final"
            :rules="[
              (val) => (val && val.length > 0) || 'Digite a leitura final',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-input>

          <q-input
            required
            name="vistoFinal"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.vistoFinal"
            color="indigo-13"
            label=""
            :rules="[(val) => (val && val.length > 0) || '']"
          >
            <template v-slot:prepend>
              <q-icon name="visibility" />
              <q-item-label>{{ usuarioLogado }}</q-item-label>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-3">
          <q-input
            required
            name="consumo"
            outlined
            clearable
            clear-icon="close"
            v-model="encomenda.consumo"
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

      <!-- Botoes -->
      <div class="row q-gutter-md">
        <q-btn
          class="col-md-2 col-sm-2 col-xs-12"
          label="Calcular"
          type="button"
          rounded
          color="indigo-14"
          @click="calcular"
        ></q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { usuarioStore } from '../stores/example-store'; // Substitua pelo caminho correto para o arquivo onde você definiu a `usuarioStore`.

export default {
  data() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      encomenda: {
        data: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        leituraInicial: 0,
        vistoInicial: '',
        dataFinal: tomorrow.toLocaleDateString(),
        horaFinal: '06:00',
        leituraFinal: 0,
        vistoFinal: '',
        consumo: 0,
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.encomenda.leituraInicial &&
        // this.encomenda.vistoInicial &&
        this.encomenda.leituraFinal
        //this.encomenda.vistoFinal
      );
    },
    usuarioLogado() {
      const store = usuarioStore();
      return store.usuarioLogado;
    },
  },
  methods: {
    calcular() {
      if (this.isFormValid) {
        this.encomenda.consumo =
          this.encomenda.leituraFinal - this.encomenda.leituraInicial;
        if (this.encomenda.consumo > 6000) {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'O consumo ultrapassou 6000m³!',
          });
        }
      }
    },
    submitForm() {
      console.log(`Formulário enviado em ${new Date().toLocaleString()}`);
    },
  },
};
</script>
