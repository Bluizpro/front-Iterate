<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">
      Cadastro de encomenda {{ store.formularioAtual }}
    </h1>
    <div class="row items-center justify-evenly">
      <q-form
        @submit.prevent="cadastrar"
        class="q-gutter-md col-md-10 col-sm-10 col-xs-12"
      >
        <!-- Campos do formulário -->
        <q-input
          required
          name="conjunto"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.conjunto"
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
          name="destinatario"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.destinatario"
          color="indigo-13"
          label="Nome do Destinatário"
          :rules="[(val) => (val && val.length > 0) || 'Digite o nome']"
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
          :rules="[(val) => (val && val.length > 0) || 'Digite o remetente']"
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
          label="Conteúdo"
          :rules="[(val) => (val && val.length > 0) || 'Digite o conteúdo']"
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
import { useCondominosStore } from '../../stores/condominosStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useFuncionariosStore } from '../../stores/funcionarioStore';
import { createCorrespondenciaInterno } from '../../services/encomenInterAPI';
import { enviarMensagemWhatsApp } from '../../services/whatsappAPI'; // Importando o novo serviço

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
  remetente: '',
  conteudo: '',
  empresa: '',
});

onMounted(() => {
  const agora = new Date();
  encomenda.value.data = agora.toLocaleDateString('pt-BR');
  encomenda.value.hora = agora.toLocaleTimeString('pt-BR');
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

  const novaEncomenda = {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    destinatario: encomenda.value.destinatario,
    remetente: encomenda.value.remetente,
    conteudo: encomenda.value.conteudo,
    tipo: 'interno',
    empresa: encomenda.value.empresa,
  };

  try {
    const response = await createCorrespondenciaInterno(novaEncomenda);

    if (response) {
      const mensagem = `Uma nova encomenda foi adicionada com sucesso no conjunto ${
        novaEncomenda.conjunto
      }. Detalhes: ${JSON.stringify(novaEncomenda)}`;

      const promises = [
        enviarMensagemParaCondomino(novaEncomenda, mensagem),
        enviarMensagemParaFuncionario(novaEncomenda, mensagem),
      ];

      // Esperar por todas as promessas
      await Promise.all(promises);

      $q.notify({
        type: 'positive',
        message: 'Encomenda cadastrada com sucesso',
      });

      $router.push('/usuario/Cards-Encomendas');
    } else {
      $q.notify({
        type: 'negative',
        message: 'Falha ao cadastrar encomenda',
      });
    }
  } catch (error) {
    console.error('Erro ao cadastrar a encomenda:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao cadastrar encomenda',
    });
  } finally {
    hideLoading();
  }
};

const voltar = () => {
  $router.push('/usuario/Lista-de-Encomendas');
};
</script>
