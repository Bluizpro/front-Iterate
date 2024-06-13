<template>
  <q-page>
    <!-- <h1 class="q-heading text-h5 text-weight-medium text-center"> -->
    <h1 style="font-size: 1.5em; text-align: center">
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
          name="notaFiscal"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.notaFiscal"
          label="Nota fiscal"
          :rules="[(val:string) => (val && val.length > 0) || 'Campo Obrigatório']"
        >
          <template v-slot:prepend>
            <q-icon name="description" />
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
import { useCondominosStore } from '../../stores/condominosStore';
import { Delivery } from '../Imodels';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useFuncionariosStore } from '../../stores/funcionarioStore';
import axios from 'axios';
const store = useStore();
const $q = useQuasar();
const condominoStore = useCondominosStore();
const funcionarioStore = useFuncionariosStore();
const $router = useRouter();

onMounted(() => {
  // Preencher automaticamente a data e hora atuais
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

const encomenda = ref({
  data: '',
  hora: '',
  destinatario: '',
  conteudo: '',
  conjunto: '',
  notaFiscal: '',
});

const gerarNovoIdEncomenda = (): number => {
  let novoId: number;
  do {
    novoId = Math.floor(Math.random() * 1000); // Gera um ID aleatório entre 0 e 999
  } while (
    condominoStore.condominos.some((condomino) =>
      condomino.encomendas.some((encomenda) => encomenda.id === novoId)
    ) ||
    funcionarioStore.funcionarios.some((funcionario) =>
      funcionario.encomendas.some((encomenda) => encomenda.id === novoId)
    )
  );

  return novoId;
};

const gerarNovaEncomenda = (): Delivery => {
  const novoId = gerarNovoIdEncomenda();
  const novaEncomenda: Delivery = {
    id: novoId,
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    destinatario: encomenda.value.destinatario,
    conteudo: encomenda.value.conteudo,
    tipo: 'sedex',
    notaFiscal: encomenda.value.notaFiscal,
  };
  return novaEncomenda;
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

  const conjunto = encomenda.value.conjunto;
  const adicionadaSucessoCondominio =
    await condominoStore.adicionarEncomendaACondomino(conjunto, novaEncomenda);
  const adicionadaSucessoFuncionario =
    await funcionarioStore.adicionarEncomendaAFuncionario(
      conjunto,
      novaEncomenda
    );

  hideLoading();
  function enviarMensagem(telefone: string, mensagem: string) {
    axios
      .post('http://localhost:3000/send-whatsapp/encomenda', {
        message: mensagem,
        telefone: telefone,
      })
      .catch((error) => {
        console.error('Erro ao enviar a mensagem de WhatsApp:', error);
      });
  }

  if (adicionadaSucessoCondominio || adicionadaSucessoFuncionario) {
    let destinatarioMensagem = encomenda.value.destinatario;
    let mensagem = '';
    let telefone = '';

    if (adicionadaSucessoCondominio) {
      const condomino = condominoStore.condominos.find(
        (condomino) => condomino.conjunto === conjunto
      );
      if (condomino && condomino.telefone) {
        mensagem = `Olá ${destinatarioMensagem}, sua encomenda foi entregue à portaria.`;
        telefone = condomino.telefone;
      } else {
        console.error('Condomínio não encontrado ou sem número de telefone.');
      }
    }

    if (adicionadaSucessoFuncionario) {
      const funcionario = funcionarioStore.funcionarios.find(
        (funcionario) => funcionario.conjunto === conjunto
      );
      if (funcionario && funcionario.telefone) {
        mensagem = `Olá ${destinatarioMensagem}, sua encomenda foi entregue ao funcionário.`;
        telefone = funcionario.telefone;
      } else {
        console.error('Funcionário não encontrado ou sem número de telefone.');
      }
    }

    if (mensagem && telefone) {
      enviarMensagem(telefone, mensagem);
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
const voltar = () => {
  $router.push('/usuario/Lista-de-Encomendas');
};
</script>
../../stores/condominosStore src/stores/funcionarioStore
