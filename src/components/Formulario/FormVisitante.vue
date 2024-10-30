<template>
  <q-page>
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
            required
            name="conjunto"
            outlined
            clearable
            clear-icon="close"
            v-model="form.conjunto"
            color="indigo-13"
            label="Número do conjunto"
            :rules="[(val) => (val && val.length > 0) || 'Digite o número']"
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
            :rules="[(val) => (val && val.length > 0) || 'Digite seu nome']"
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
            :rules="[
              (val) => (val && val.length > 0) || 'Digite seu CPF ou RG',
            ]"
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
            :rules="[
              (val) => (val && val.length > 0) || 'Digite a autorização',
            ]"
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
            :rules="[(val) => (val && val.length > 0) || 'Digite a empresa']"
          >
            <template v-slot:prepend>
              <q-icon name="store" />
            </template>
          </q-input>

          <!-- Botões -->
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
    </div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useStore } from '../../stores/example-store';
import { useQuasar } from 'quasar';
// FormVisitante.vue
import * as VisitanteServices from '../../services/visitanteApi';

// O restante do seu código
// Atualiza a importação para o serviço correto

const store = useStore();
const $q = useQuasar();

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

let timer = null;
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

function formatarDataHora(data) {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

const cadastrar = async () => {
  console.log('Função cadastrar chamada'); // Adicione esta linha
  const agora = new Date();

  const visitante = {
    conjunto: form.value.conjunto,
    nome: form.value.nome,
    cpf: form.value.cpfrg,
    empresa: form.value.empresa,
    autorizacao: form.value.autorizacao,
    dataCadastro: formatarDataHora(agora),
  };

  showLoading();

  try {
    const result = await VisitanteServices.createVisitante(visitante);
    console.log('Resultado da criação do visitante:', result); // Adicione esta linha
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Visitante cadastrado com sucesso',
      timeout: Math.random() * 1000 + 1000,
    });
    store.resetFormularioAtual();
  } catch (error) {
    console.error('Erro ao cadastrar visitante:', error); // Adicione esta linha
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: 'Erro ao cadastrar visitante',
      timeout: Math.random() * 1000 + 1000,
    });
  } finally {
    hideLoading();
  }
};
</script>
<style scoped lang="scss">
.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}
</style>
