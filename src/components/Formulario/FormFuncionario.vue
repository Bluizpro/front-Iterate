<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">
      Cadastro de Colaboradores
    </h1>
    <div class="border">
      <div class="form-wrapper">
        <q-form @submit.prevent="cadastrar" class="form-container">
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
            class="input-field"
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
            class="input-field"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            required
            name="setor"
            outlined
            clearable
            clear-icon="close"
            v-model="form.setor"
            color="indigo-13"
            label="Setor"
            :rules="[(val) => (val && val.length > 0) || 'Digite o setor']"
            class="input-field"
          >
            <template v-slot:prepend>
              <q-icon name="home" />
            </template>
          </q-input>

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
              (val) => (val && val.length > 0) || 'Telefone Obrigatório',
              (val) =>
                (val && val.replace(/\D/g, '').length === 13) ||
                'Telefone inválido',
            ]"
            class="input-field"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <!-- Botões -->
          <div class="q-gutter-md button-container">
            <q-btn
              label="Cadastrar"
              type="submit"
              color="indigo-14"
              rounded
              class="custom-btn"
            ></q-btn>
            <q-btn
              label="Voltar"
              type="button"
              rounded
              color="indigo-14"
              @click="voltar"
              class="custom-btn"
            ></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from '../../stores/example-store';
import * as FuncionarioServices from '../../services/funcionarioApi';

const store = useStore();
const $q = useQuasar();

const form = ref({
  conjunto: '',
  nome: '',
  telefone: '',
  setor: '',
});

const voltar = () => {
  store.resetFormularioAtual();
};

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
  const agora = new Date();

  const funcionario = {
    conjunto: form.value.conjunto,
    nome: form.value.nome,
    telefone: form.value.telefone,
    setor: form.value.setor,
    dataCadastro: formatarDataHora(agora),
    encomendas: [], // Adicione esta linha se for necessário
  };

  showLoading();

  try {
    const result = await FuncionarioServices.createFuncionario(funcionario);
    console.log('Resultado da criação do funcionário:', result);
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Funcionário cadastrado com sucesso',
      timeout: Math.random() * 1000 + 1000,
    });
    store.resetFormularioAtual();
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error);
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: 'Erro ao cadastrar funcionário',
      timeout: Math.random() * 1000 + 1000,
    });
  } finally {
    hideLoading();
  }
};
</script>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center; /* Centraliza o formulário horizontalmente */
  padding: 2rem; /* Adiciona espaço ao redor da borda */
}

.form-container {
  max-width: 35rem; /* Ajusta a largura máxima do formulário */
  padding: 5rem; /* Adiciona um padding ao redor do formulário */
  border: 8px solid #ddd; /* Adiciona uma borda maior ao redor do formulário */
  border-radius: 8px; /* Arredonda os cantos da borda */
  background-color: #fff; /* Define a cor de fundo do formulário */
}

.input-field {
  width: 100%; /* Faz os campos ocupar toda a largura disponível */
  margin-bottom: 1em; /* Adiciona espaço inferior entre os campos */
  height: 5rem; /* Define uma altura fixa para os campos de entrada */
}

.button-container {
  display: flex; /* Usa flexbox para alinhar os botões */
  gap: 1rem; /* Adiciona um espaçamento entre os botões */
  justify-content: center; /* Centraliza os botões horizontalmente */
}

.custom-btn {
  width: 150px; /* Define uma largura fixa para os botões */
}
.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}
</style>
