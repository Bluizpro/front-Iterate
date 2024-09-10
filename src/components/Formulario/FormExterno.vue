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
          :rules="[(val) => (val && val.length > 0) || 'Digite o numero']"
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
          :rules="[(val) => (val && val.length > 0) || 'Digite nome']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          required
          name="recebedor"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.recebedor"
          color="indigo-13"
          label="Nome do Recebedor"
          :rules="[(val) => (val && val.length > 0) || 'Digite Seu nome']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          required
          name="local"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.local"
          color="indigo-13"
          label="Local"
          :rules="[(val) => (val && val.length > 0) || 'Digite o local']"
        >
          <template v-slot:prepend>
            <q-icon name="location_city" />
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
          :rules="[(val) => (val && val.length > 0) || 'Digite o conteúdo']"
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
import { useStore } from '../../stores/example-store';
import { useRouter } from 'vue-router';
import { useCondominosStore } from '../../stores/condominosStore';
import { useFuncionariosStore } from '../../stores/funcionarioStore';
import { createCorrespondenciaExterno } from '../../services/encomenExternoAPI';
import { useQuasar } from 'quasar';
import { enviarMensagemWhatsApp } from '../../services/whatsappAPI'; // Importando o serviço de WhatsApp

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
  recebedor: '',
  conteudo: '',
  local: '',
});

/* const gerarNovoIdEncomenda = () => {
  let novoId;
  do {
    novoId = Math.floor(Math.random() * 1000); // Gera um ID aleatório entre 0 e 999
  } while (
    (condominoStore.condominos?.some((condomino) =>
      condomino.encomendas?.some((encomenda) => encomenda.id === novoId)
    ) ??
      false) ||
    (funcionarioStore.funcionarios?.some((funcionario) =>
      funcionario.encomendas?.some((encomenda) => encomenda.id === novoId)
    ) ??
      false)
  );

  return novoId;
}; */

const gerarNovaEncomenda = () => {
  return {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    destinatario: encomenda.value.destinatario,
    conteudo: encomenda.value.conteudo,
    tipo: 'externo',
    recebedor: encomenda.value.recebedor,
    local: encomenda.value.local,
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
      console.log(`Enviando mensagem para condomínio: ${condomino.telefone}`);
      return enviarMensagem(condomino.telefone, mensagem);
    }
  }
  return Promise.resolve(); // Resolve a Promise para evitar falhas na Promise.all
};

const enviarMensagemParaFuncionario = (novaEncomenda, mensagem) => {
  if (funcionarioStore.funcionarios) {
    const funcionario = funcionarioStore.funcionarios.find(
      (f) => f.conjunto === novaEncomenda.conjunto
    );
    if (funcionario && funcionario.telefone) {
      console.log(
        `Enviando mensagem para funcionário: ${funcionario.telefone}`
      );
      return enviarMensagem(funcionario.telefone, mensagem);
    }
  }
  return Promise.resolve(); // Resolve a Promise para evitar falhas na Promise.all
};

const cadastrar = async () => {
  showLoading();

  const novaEncomenda = gerarNovaEncomenda();
  const conjunto = encomenda.value.conjunto;

  // Certifique-se de que as encomendas são arrays para evitar erros
  condominoStore.condominos = condominoStore.condominos || [];
  funcionarioStore.funcionarios = funcionarioStore.funcionarios || [];

  try {
    const response = await createCorrespondenciaExterno(novaEncomenda);

    if (response) {
      const mensagem = `Uma nova encomenda externa foi adicionada com sucesso no conjunto ${
        novaEncomenda.conjunto
      }. Detalhes: ${JSON.stringify(novaEncomenda)}`;

      // Envia mensagens para condôminos e funcionários
      const promises = [
        enviarMensagemParaCondomino(novaEncomenda, mensagem),
        enviarMensagemParaFuncionario(novaEncomenda, mensagem),
      ];

      await Promise.all(promises);

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Encomenda externa cadastrada com sucesso',
        timeout: Math.random() * 1000 + 1000,
      });

      store.resetFormularioAtual();
      $router.push('/usuario/Cards-Encomendas');
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Falha ao cadastrar encomenda externa',
        position: 'center',
        timeout: Math.random() * 1000 + 1000,
      });
    }
  } catch (error) {
    console.error('Erro ao cadastrar a encomenda externa:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao cadastrar encomenda externa',
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
  $q.loading.hide();
});

const voltar = () => {
  $router.push('/usuario/Lista-de-Encomendas');
};
</script>
