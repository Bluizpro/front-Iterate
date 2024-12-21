<template>
  <q-page>
    <!-- <h1 class="q-heading text-h5 text-weight-medium text-center"> -->
    <h1 style="font-size: 1.5em; text-align: center">
      Cadastro de {{ titulo }}
    </h1>
    <div class="border">
      <div class="row items-center justify-evenly">
        <q-form
          @submit.prevent="cadastrar"
          class="q-gutter-md col-md-10 col-sm-10 col-xs-12"
        >
          <q-input
            class="col-md-6 col-sm-6 col-xs-12"
            required
            name="conjunto"
            outlined
            clearable
            clear-icon="close"
            v-model="form.conjunto"
            color="indigo-13"
            label="Número do conjunto"
            :rules="[(val:string) => (val && val.length > 0) || 'Digite o numero']"
          >
            <template v-slot:prepend>
              <q-icon name="pin" />
            </template>
          </q-input>

          <q-input
            required
            name="nome"
            outlined
            clearable
            clear-icon="close"
            v-model="form.nome"
            color="indigo-13"
            label="Nome Completo"
            :rules="[(val:string) => (val && val.length > 0) || 'Digite Seu Nome']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <div class="row justify-between">
            <!-- <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              required
              name="CPF/RG"
              outlined
              clearable
              clear-icon="close"
              v-model="form.cpfrg"
              color="indigo-13"
              label="CPF/RG"
              :rules="[(val:string) => (val && val.length > 0) || 'Digite Seu CPF']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input> -->

            <q-input
              required
              name="telefone"
              outlined
              clearable
              clear-icon="close"
              v-model="form.telefone"
              label="Telefone"
              mask="+55(##)#####-####"
              :rules="[
    (val: string) => (val && val.length > 0) || 'Telefone Obrigatório',
    (val: string) => {
      // Remove os caracteres não numéricos (como parênteses, hífens, espaços)
      const phoneNumber = val.replace(/\D/g, '');
      // Verifica se o número tem 10 ou 11 dígitos, que é o número esperado para telefone fixo ou celular
      return (phoneNumber.length === 12 || phoneNumber.length === 13) || 'Telefone inválido';
    }
  ]"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>
          <!--
          <q-input
            class="col-md-6 col-sm-6 col-xs-12"
            required
            name="proprietario"
            outlined
            clearable
            clear-icon="close"
            v-model="form.proprietario"
            color="indigo-13"
            label="Proprietário"
            :rules="[(val:string) => (val && val.length > 0) || 'Digite o nome do proprietário']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
 -->
          <q-input
            required
            name="especialidade"
            outlined
            clearable
            clear-icon="close"
            v-model="form.especialidade"
            label="Especialidade"
            :rules="[(val:string) => (val && val.length > 0) || 'Digite a especialidade']"
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
          </q-input>

          <q-select
            required
            name="interfone"
            outlined
            clearable
            clear-icon="close"
            v-model="form.interfone"
            label="Interfone"
            :options="inforOption"
            :class="colorClass(form.interfone)"
          >
            <template v-slot:prepend>
              <q-icon name="phone_in_talk" />
            </template>
          </q-select>

          <div class="row q-gutter-md btn-container">
            <q-btn
              class="col-md-2 col-sm-2 col-xs-12"
              label="Cadastrar"
              type="submit"
              rounded
              color="indigo-14"
            ></q-btn>
            <q-btn
              class="col-md-2 col-sm-2 col-xs-12"
              label="Voltar"
              type="button"
              rounded
              color="indigo-14"
              @click="voltar"
            ></q-btn>
            <div class="spacer"></div>
            <q-btn
              class="col-md-2 col-sm-2 col-xs-12"
              label="Locatarios"
              type="button"
              rounded
              color="indigo-14"
              @click="irParaLocatario"
            ></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useStore } from '../../stores/example-store';
import { useQuasar } from 'quasar';
import { createCondomino } from '../../services/condonimoApi';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const $q = useQuasar();

let timer: NodeJS.Timeout | null = null;
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});
const irParaLocatario = () => {
  router.push({ name: 'LocatarioForm' });
};

const showLoading = () => {
  $q.loading.show();
};
const hideLoading = () => {
  $q.loading.hide();
};

const form = ref({
  conjunto: '',
  nome: '',
  // cpfrg: '',
  telefone: '',
  interfone: '',
  especialidade: '',
  //proprietario: '',
});

const voltar = () => {
  store.resetFormularioAtual();
};
const titulo = computed(() => {
  const tipoEncomenda = store.formularioAtual;
  if (tipoEncomenda) {
    return tipoEncomenda.charAt(0).toUpperCase() + tipoEncomenda.slice(1);
  }
  return 'Erro';
});

const cadastrar = async () => {
  const dados = {
    conjunto: form.value.conjunto,
    nome: form.value.nome,
    // cpfrg: form.value.cpfrg,
    telefone: form.value.telefone,
    interfone: form.value.interfone,
    especialidade: form.value.especialidade,
    //proprietario: form.value.proprietario,
  };

  try {
    showLoading();

    const novoCondomino = {
      ...dados,
      locatario: [form.value.nome],
      encomendas: [],
      visitantes: [],
    };

    const response = await createCondomino(novoCondomino);

    if (response) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Condomino cadastrado com sucesso',
        timeout: Math.random() * 1000 + 1000,
      });
    } else {
      throw new Error('Erro ao cadastrar Condomino');
    }

    store.resetFormularioAtual();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro de resposta:', error.response?.data);
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message:
          'Erro ao cadastrar: ' +
          (error.response?.data.message || error.message),
        position: 'center',
        timeout: Math.random() * 1000 + 1000,
      });
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Erro desconhecido',
        position: 'center',
        timeout: Math.random() * 1000 + 1000,
      });
    }
  } finally {
    hideLoading();
  }
};
const inforOption = ['NÃO', '2/T', 'A/S', 'SIM'];
const colorClass = (interfone: unknown) => {
  switch (interfone) {
    case 'NÃO':
      return 'background';
    case '2/T':
      return 'yellow-background';
    case 'A/S':
      return 'red-background';
    case 'SIM':
      return 'green-background';
  }
};
</script>

<style scoped lang="scss">
.q-select {
  width: 200px;

  input,
  select {
    font-size: 14px;
  }
}
.btn-container {
  display: flex;
  justify-content: space-between;
}

.btn-container .spacer {
  flex: 1;
}
.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}
.yellow-background {
  background-color: rgb(250, 250, 144);
}
.red-background {
  background-color: #f07171;
}
.green-background {
  background-color: #0faa0a;
}

.background {
  background-color: rgb(255, 255, 255);
}
</style>
