<template>
  <q-page>
    <h1 class="q-heading text-h5 text-weight-medium text-center">
      Cadastro de encomenda {{ store.formularioAtual }}
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
          v-model="encomenda.conjunto"
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
          name="destinatario"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.destinatario"
          color="indigo-13"
          label="Nome do Destinatario"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite nome']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          required
          name="remetente"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.remetente"
          color="indigo-13"
          label="Remetente"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite o remetente']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          required
          name="conteudo"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.conteudo"
          color="indigo-13"
          label="conteúdo"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite o conteúdo']"
        >
          <template v-slot:prepend>
            <q-icon name="edit_square" />
          </template>
        </q-input>

        <q-input
          required
          name="empresa"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.empresa"
          color="indigo-13"
          label="Empresa"
          :rules="[(val:string) => (val && val.length > 0) || 'Digite a empresa']"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
        </q-input>

        <!-- Botoes -->
        <div class="row q-gutter-md">
          <q-btn
            class="col-md-2 col-sm-2 col-xs-12"
            label="Enviar"
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
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useStore } from '../../stores/example-store';
import { useCondominosStore } from '../../stores/condominos-store';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Delivery } from '../Imodels';
import { onMounted } from 'vue';
import axios from 'axios';

const store = useStore();
const $q = useQuasar();
const condominoStore = useCondominosStore();
const $router = useRouter();

onMounted(() => {
  const agora = new Date();
  const optionsData: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const optionsHora: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  encomenda.value.data = agora.toLocaleDateString('pt-BR', optionsData);
  encomenda.value.hora = agora.toLocaleTimeString('pt-BR', optionsHora);
});

const gerarNovoIdEncomenda = (): number => {
  let novoId: number;
  do {
    novoId = Math.floor(Math.random() * 1000); // Gera um ID aleatório entre 0 e 999
  } while (
    condominoStore.condominos.some((condomino) =>
      condomino.encomendas.some((encomenda) => encomenda.id === novoId)
    )
  );

  return novoId;
};
const encomenda = ref({
  data: '',
  hora: '',
  conjunto: '',
  destinatario: '',
  remetente: '',
  conteudo: '',
  empresa: '',
});

const voltar = () => {
  $router.push('/usuario/Lista-de-Encomendas');
};

const gerarNovaEncomenda = (): Delivery => {
  const novoId = gerarNovoIdEncomenda();
  return {
    id: novoId,
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    destinatario: encomenda.value.destinatario,
    remetente: encomenda.value.remetente,
    conteudo: encomenda.value.conteudo,
    tipo: 'interno',
    empresa: encomenda.value.empresa,
  };
};

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
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const novaEncomenda = gerarNovaEncomenda();

  const adicionadaSucesso = await condominoStore.adicionarEncomendaACondomino(
    encomenda.value.conjunto,
    novaEncomenda
  );
  hideLoading();
  if (adicionadaSucesso) {
    // Obter o condomínio correspondente ao conjunto
    const condomino = condominoStore.condominos.find(
      (condomino) => condomino.conjunto === encomenda.value.conjunto
    );

    if (condomino && condomino.telefone) {
      // Enviar a mensagem de WhatsApp
      axios
        .post('http://localhost:3000/send-whatsapp/encomenda', {
          message: `Olá ${encomenda.value.destinatario}, sua encomenda foi entregue à portaria.`,
          telefone: condomino.telefone,
        })
        .catch((error) => {
          console.error('Erro ao enviar a mensagem de WhatsApp:', error);
        });
    } else {
      console.error('Condomínio não encontrado ou sem número de telefone.');
    }

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'cadastrado com sucesso',
      timeout: Math.random() * 1000 + 1000,
    });
    store.resetFormularioAtual();
    $router.push('/usuario/Cards-Encomendas');
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Conjunto não existe',
      position: 'center',
      timeout: Math.random() * 1000 + 1000,
    });
  }
};
</script>
