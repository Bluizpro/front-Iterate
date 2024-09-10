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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from '../../stores/example-store'; // Atualize o caminho se necessário
import { useRouter } from 'vue-router';
import { useCondominosStore } from '../../stores/condominosStore';
import { useFuncionariosStore } from '../../stores/funcionarioStore';
import { useQuasar } from 'quasar';
import { enviarMensagemWhatsApp } from '../../services/whatsappAPI';
import { createCorrespondenciaSedex } from '../../services/encomenSedexAPI';

const store = useStore();
const $q = useQuasar();
const $router = useRouter();
const condominoStore = useCondominosStore();
const funcionarioStore = useFuncionariosStore();

const encomenda = ref({
  data: '',
  hora: '',
  conjunto: '',
  destinatario: '',
  conteudo: '',
  notaFiscal: '',
});

const gerarNovaEncomenda = () => {
  return {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    destinatario: encomenda.value.destinatario,
    conteudo: encomenda.value.conteudo,
    tipo: 'sedex',
    notaFiscal: encomenda.value.notaFiscal,
  };
};

const showLoading = () => {
  $q.loading.show();
};

const hideLoading = () => {
  $q.loading.hide();
};

const enviarMensagem = async (telefone, mensagem) => {
  try {
    await enviarMensagemWhatsApp(telefone, mensagem);
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${telefone}:`, error);
  }
};

const enviarMensagemParaCondomino = (novaEncomenda, mensagem) => {
  if (condominoStore.condominos) {
    const condomino = condominoStore.condominos.find(
      (c) => c.conjunto === novaEncomenda.conjunto
    );
    if (condomino && condomino.telefone) {
      return enviarMensagem(condomino.telefone, mensagem);
    }
  }
  return Promise.resolve();
};

const enviarMensagemParaFuncionario = (novaEncomenda, mensagem) => {
  if (funcionarioStore.funcionarios) {
    const funcionario = funcionarioStore.funcionarios.find(
      (f) => f.conjunto === novaEncomenda.conjunto
    );
    if (funcionario && funcionario.telefone) {
      return enviarMensagem(funcionario.telefone, mensagem);
    }
  }
  return Promise.resolve();
};

const cadastrar = async () => {
  showLoading();

  const novaEncomenda = gerarNovaEncomenda();
  console.log('Nova Encomenda:', novaEncomenda);

  try {
    const response = await createCorrespondenciaSedex(novaEncomenda);
    console.log('Resposta da API:', response);

    if (response.id) {
      // Verifica se a resposta contém um ID válido
      const mensagem = `Uma nova encomenda foi adicionada com sucesso no conjunto ${
        novaEncomenda.conjunto
      }. Detalhes: ${JSON.stringify(novaEncomenda)}`;

      await Promise.all([
        enviarMensagemParaCondomino(novaEncomenda, mensagem),
        enviarMensagemParaFuncionario(novaEncomenda, mensagem),
      ]);

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Encomenda cadastrada com sucesso',
      });

      // Resetar o formulário
      store.resetFormularioAtual();
      console.log('Formulário resetado');

      // Redireciona após um pequeno delay para garantir que o formulário foi resetado
      setTimeout(() => {
        $router.push('/usuario/Cards-Encomendas');
      }, 500); // Ajuste o tempo se necessário
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Falha ao cadastrar encomenda',
      });
    }
  } catch (error) {
    console.error('Erro ao cadastrar a encomenda:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao cadastrar encomenda',
    });
  } finally {
    hideLoading();
  }
};

onMounted(() => {
  const agora = new Date();
  encomenda.value.data = agora.toLocaleDateString('pt-BR');
  encomenda.value.hora = agora.toLocaleTimeString('pt-BR');
});

onBeforeUnmount(() => {
  hideLoading();
});

const voltar = () => {
  $router.push('/usuario/Lista-de-Encomendas');
};
</script>
