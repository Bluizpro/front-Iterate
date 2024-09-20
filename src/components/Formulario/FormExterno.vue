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
          name="nome"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.nome"
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
/* import { useCondominosStore } from '../../stores/condominosStore';
import { useFuncionariosStore } from '../../stores/funcionarioStore'; */
import { createCorrespondenciaExterno } from '../../services/encomenExternoAPI';
import { useQuasar } from 'quasar';
import { enviarMensagemWhatsApp } from '../../services/whatsappAPI';
import { getLocatariosByConjunto } from '../../services/locatarioApi';
import { getCondominos } from '../../services/condonimoApi';
import { getFuncionario } from '../../services/funcionarioApi'; // Importando o serviço de WhatsApp

const store = useStore();
const $q = useQuasar();
const $router = useRouter();
/* const condominoStore = useCondominosStore();
const funcionarioStore = useFuncionariosStore(); */

const encomenda = ref({
  data: '',
  hora: '',
  conjunto: '',
  nome: '',
  recebedor: '',
  conteudo: '',
  local: '',
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

// Função para buscar o telefone da pessoa
const buscarTelefonePorNome = async (conjunto, nome) => {
  console.log('Buscando telefone para:', conjunto, nome);

  // Converte conjunto para string
  const conjuntoStr = String(conjunto).trim().toLowerCase();
  const nomeStr = nome.trim().toLowerCase();

  // Busca no condomínio
  try {
    const condominos = await getCondominos();
    const condomino = condominos.find(
      (c) =>
        String(c.conjunto).trim().toLowerCase() === conjuntoStr &&
        c.nome.trim().toLowerCase() === nomeStr
    );
    if (condomino) {
      /*   console.log('Telefone encontrado no condomínio:', condomino.telefone); */
      return condomino.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar condomínios:', error);
  }

  // Busca no funcionário
  try {
    const funcionarios = await getFuncionario();
    const funcionario = funcionarios.find(
      (f) =>
        String(f.conjunto).trim().toLowerCase() === conjuntoStr &&
        f.nome.trim().toLowerCase() === nomeStr
    );
    if (funcionario) {
      /*   console.log('Telefone encontrado no funcionário:', funcionario.telefone); */
      return funcionario.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
  }

  // Busca no locatário (se não encontrado nos stores)
  try {
    const locatarios = await getLocatariosByConjunto(conjuntoStr);
    const locatario = locatarios.find(
      (l) => l.nome.trim().toLowerCase() === nomeStr
    );
    if (locatario) {
      /*   console.log('Telefone encontrado no colaborador:', locatario.telefone); */
      return locatario.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar locatários da API:', error);
  }

  // Se não encontrar, retorna null
  console.warn('Telefone não encontrado para:', nome);
  return null;
};

const voltar = () => {
  $router.push('/usuario/Cards-Encomendas'); // Ajuste conforme sua rota
};
const cadastrar = async () => {
  showLoading();

  const novaEncomenda = {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    nome: encomenda.value.nome,
    conteudo: encomenda.value.conteudo,
    tipo: 'externo',
    recebedor: encomenda.value.recebedor,
    local: encomenda.value.local,
  };
  try {
    // Primeiro, buscar o telefone para verificar se a encomenda pode ser cadastrada
    const telefone = await buscarTelefonePorNome(
      novaEncomenda.conjunto,
      novaEncomenda.nome
    );
    if (telefone) {
      const response = await createCorrespondenciaExterno(novaEncomenda);

      if (response) {
        const mensagem = `Olá ${novaEncomenda.nome}, sua encomenda foi entregue à portaria.`;
        try {
          await enviarMensagemWhatsApp(telefone, mensagem);
          console.log(
            `Mensagem enviada com sucesso para: ${novaEncomenda.nome}`
          );
        } catch (err) {
          console.error('Erro ao enviar mensagem via WhatsApp:', err);
          $q.notify({
            type: 'warning',
            message:
              'Encomenda cadastrada, mas ocorreu um erro ao enviar a mensagem.',
          });
        }
        store.resetFormularioAtual();
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
    } else {
      // Se o telefone não for encontrado, não cria a encomenda
      console.warn('Telefone não encontrado para:', novaEncomenda.nome);
      $q.notify({
        type: 'warning',
        message:
          'Encomenda não cadastrada. O telefone do destinatário não foi encontrado.',
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
</script>
