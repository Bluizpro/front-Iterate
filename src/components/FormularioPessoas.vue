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
            :rules="[(val:string) => (val && val.length > 0) || 'Digite Seu CPF']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-if="store.formularioAtual == 'condômino'"
            required
            name="telefone"
            outlined
            clearable
            clear-icon="close"
            v-model="form.telefone"
            label="Telefone"
            mask="(##) ### - ######"
            unmasked-value
            :rules="[
              (val:string) => (val && val.length > 0) || 'Telefone Obrigatório',
              (val: string) => (val && val.replace(/\D/g, '').length === 11) || 'Telefone inválido'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
        </div>
        <q-input
          v-if="store.formularioAtual == 'visitante'"
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
          v-if="store.formularioAtual == 'visitante'"
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

        <q-input
          v-if="store.formularioAtual === 'condômino'"
          required
          name="login"
          outlined
          clearable
          clear-icon="close"
          v-model="form.login"
          label="login"
          :rules="[(val:string) => (val && val.length > 0) || 'Campo Obrigatório']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          v-if="store.formularioAtual === 'condômino'"
          required
          name="senha"
          :type="isPwd ? 'password' : 'text'"
          outlined
          clearable
          clear-icon="close"
          v-model="form.senha"
          label="Senha"
          :rules="[
            (val:string) => (val && val.length > 0) || 'Campo Obrigatório',
            (val:string) => val.length > 4 || 'Mínimo de 5 caracteres',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrar"
            />
          </template>
        </q-input>

        <div class="row q-gutter-md">
          <q-btn
            class="col-md-2 col-sm-2 col-xs-12"
            label="Cadastrar"
            type="submit"
            color="indigo-14"
          ></q-btn>
          <q-btn
            class="col-md-2 col-sm-2 col-xs-12"
            label="Voltar"
            type="button"
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
import { useStore } from '../stores/example-store';
import { useQuasar } from 'quasar';
import { useCondominosStore } from '../stores/condominos-store';

const store = useStore();
const $q = useQuasar();
const condominosStore = useCondominosStore();

const form = ref({
  nome: '',
  cpfrg: '',
  telefone: '',
  empresa: '',
  user: '',
  autorizacao: '',
  login: '',
  senha: '',
});

const isPwd = ref(true);
const mostrar = () => (isPwd.value = !isPwd.value);

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

const cadastrar = async () => {
  if (store.formularioAtual === 'condômino') {
    // Adicionar locatário
    const locatario = form.value.nome;
    const conjunto = '23'; // Você pode definir o conjunto conforme necessário
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const adicionadaSucesso =
      await condominosStore.adicionarLocatarioACondomino(conjunto, locatario);
    hideLoading();
    if (adicionadaSucesso) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'cadastrado com sucesso',

        timeout: Math.random() * 1000 + 1000,
      });
      store.resetFormularioAtual();
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Erro ao cadastra locatário',
        position: 'center',
        timeout: Math.random() * 1000 + 1000,
      });
    }
  } else if (store.formularioAtual === 'visitante') {
    // Adicionar visitante
    const visitante = form.value.nome;
    const conjunto = '23'; // Você pode definir o conjunto conforme necessário
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const adicionadaSucesso =
      await condominosStore.adicionarVisitanteACondomino(conjunto, visitante);
    hideLoading();
    if (adicionadaSucesso) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'cadastrado com sucesso',

        timeout: Math.random() * 1000 + 1000,
      });
      store.resetFormularioAtual();
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Erro ao cadastra visitante',
        position: 'center',
        timeout: Math.random() * 1000 + 1000,
      });
    }
  }
};
</script>
