<template>
  <q-page>
    <h1 class="q-heading text-h5 text-weight-medium text-center">
      Cadastro de {{ titulo }}
    </h1>
    <div class="row items-center justify-evenly">
      <q-form
        @submit.prevent="cadastrar"
        class="q-gutter-md col-md-10 col-sm-10 col-xs-12"
      >
        <q-input
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

        <q-input
          class="col-md-8 col-sm-8 col-xs-12"
          required
          name="CPF/RG"
          outlined
          clearable
          clear-icon="close"
          v-model="form.cpfrg"
          color="indigo-13"
          label="CPF/RG"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite Seu CPF ou RG']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          required
          name="autorizacao"
          outlined
          clearable
          clear-icon="close"
          v-model="form.autorizacao"
          color="indigo-13"
          label="Autorização"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite Seu Nome']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          required
          name="empresa"
          outlined
          clearable
          clear-icon="close"
          v-model="form.empresa"
          color="indigo-13"
          label="Empresa"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite a empresa']"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
        </q-input>

        <!-- botoes -->
        <div class="row q-gutter-md">
          <q-btn
            class="col-md-2 col-sm-2 col-xs-12"
            label="Cadastrar"
            type="submit"
            color="indigo-14"
            rounded
          ></q-btn>
          <q-btn
            class="col-md-2 col-sm-2 col-xs-12"
            label="Voltar"
            type="button"
            rounded
            color="indigo-14"
            @click="voltar"
          ></q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useStore } from '../../stores/example-store';
import { useQuasar } from 'quasar';
import { useVisitantesStore } from '../../stores/visitanteStorage'; // Importe o visitantesStore

const store = useStore();
const $q = useQuasar();
const visitantesStore = useVisitantesStore(); // Use o visitantesStore

const form = ref({
  conjunto: '',
  nome: '',
  cpfrg: '',
  empresa: '',
  autorizacao: '',
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

let timer: NodeJS.Timeout | null = null;
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});

const showLoading = () => {
  $q.loading.show();
};
const hideLoading = () => {
  $q.loading.hide();
};

function formatarDataHora(data: Date) {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

const cadastrar = async () => {
  const agora = new Date();

  const visitante = {
    conjunto: form.value.conjunto,
    nome: form.value.nome,
    cpf: form.value.cpfrg,
    empresa: form.value.empresa,
    autorizacao: form.value.autorizacao,
    dataCadastro: formatarDataHora(agora), // Adicione esta linha
  };
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  visitantesStore.adicionarVisitante(visitante); // Adicione o visitante ao visitantesStore
  hideLoading();
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'cadastrado com sucesso',
    timeout: Math.random() * 1000 + 1000,
  });
  store.resetFormularioAtual();
};
</script>
