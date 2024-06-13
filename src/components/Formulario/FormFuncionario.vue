<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">
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
        <div class="row">
          <q-input
            required
            name="Setor"
            outlined
            clearable
            clear-icon="close"
            v-model="form.setor"
            color="indigo-13"
            label="Setor"
            :rules="[(val:string) => (val && val.length > 0) || 'Digite o Setor']"
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
            (val:string) => (val && val.length > 0) || 'Telefone Obrigatório',
            (val: string) => (val && val.replace(/\D/g, '').length === 13) || 'Telefone inválido'
          ]"
            class="input-field"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
        </div>

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
import { useFuncionariosStore } from '../../stores/funcionarioStore'; // Importe o funcionarioStore

const store = useStore();
const $q = useQuasar();
const funcionariosStore = useFuncionariosStore(); // Use o funcionarioStore

const form = ref({
  conjunto: '',
  nome: '',
  telefone: '',
  setor: '',
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

  const funcionario = {
    conjunto: form.value.conjunto,
    nome: form.value.nome,
    telefone: form.value.telefone,
    setor: form.value.setor,
    dataCadastro: formatarDataHora(agora),
    encomendas: [], // Adicione esta linha
  };
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  funcionariosStore.adicionarFuncionario(funcionario); // Adicione o funcionario ao funcionarioStore
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
<style scoped>
.input-field {
  width: 30%; /* Diminua a largura */
  margin-right: 5%; /* Adicione uma margem à direita */
}
</style>
../../stores/funcionarioStore
