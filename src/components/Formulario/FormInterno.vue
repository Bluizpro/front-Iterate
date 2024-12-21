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

        <q-select
          required
          outlined
          clearable
          v-model="encomenda.nome"
          color="indigo-13"
          label="Nome do Destinatário"
          :options="nomes"
          :filter="true"
          @filter="filtrarNomes"
          :rules="[(val) => (val && val.length > 0) || 'Digite o nome']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-select>

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
    <SpinnerComponente v-if="isLoading" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from '../../stores/example-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { createCorrespondenciaInterno } from '../../services/encomenInterAPI';
import { enviarMensagemWhatsApp } from '../../services/whatsappAPI';
import { getLocatariosByConjunto } from '../../services/locatarioApi';
import { getCondominos } from '../../services/condonimoApi';
import { getFuncionario } from '../../services/funcionarioApi';
import SpinnerComponente from 'src/components/SpinnerComponente.vue'; // Importe o componente

const store = useStore();
const $q = useQuasar();
const $router = useRouter();
const isLoading = ref(false);

const encomenda = ref({
  data: '',
  hora: '',
  conjunto: '',
  nome: '',
  remetente: '',
  conteudo: '',
  tipo: 'interno',
  empresa: '',
});
const nomes = ref([]);

onMounted(() => {
  const agora = new Date();
  encomenda.value.data = agora.toLocaleDateString('pt-BR');
  encomenda.value.hora = agora.toLocaleTimeString('pt-BR');
});

const buscarNomesPorConjunto = async (conjunto) => {
  const conjuntoStr = String(conjunto).trim().toLowerCase();
  let resultados = [];

  try {
    const condominos = await getCondominos();
    resultados = resultados.concat(
      condominos
        .filter((c) => String(c.conjunto).trim().toLowerCase() === conjuntoStr)
        .map((c) => c.nome)
    );
  } catch (error) {
    console.error('Erro ao buscar condomínios:', error);
  }

  try {
    const funcionarios = await getFuncionario();
    resultados = resultados.concat(
      funcionarios
        .filter((f) => String(f.conjunto).trim().toLowerCase() === conjuntoStr)
        .map((f) => f.nome)
    );
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
  }

  try {
    const locatarios = await getLocatariosByConjunto(conjuntoStr);
    resultados = resultados.concat(locatarios.map((l) => l.nome));
  } catch (error) {
    console.error('Erro ao buscar locatários:', error);
  }

  const nomesUnicos = Array.from(new Set(resultados));
  return nomesUnicos;
};

watch(
  () => encomenda.value.conjunto,
  async (newConjunto) => {
    if (newConjunto) {
      nomes.value = await buscarNomesPorConjunto(newConjunto);
    }
  }
);

let timer = null;
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});

const showLoading = () => {
  isLoading.value = true;
};

const hideLoading = () => {
  isLoading.value = false;
  $q.loading.hide();
};

const voltar = () => {
  $router.push('/usuario/Cards-Encomendas');
};

const buscarTelefonePorNome = async (conjunto, nome) => {
  const conjuntoStr = String(conjunto).trim().toLowerCase();
  const nomeStr = nome.trim().toLowerCase();

  try {
    const condominos = await getCondominos();
    const condomino = condominos.find(
      (c) =>
        String(c.conjunto).trim().toLowerCase() === conjuntoStr &&
        c.nome.trim().toLowerCase() === nomeStr
    );
    if (condomino) {
      return condomino.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar condomínios:', error);
  }

  try {
    const funcionarios = await getFuncionario();
    const funcionario = funcionarios.find(
      (f) =>
        String(f.conjunto).trim().toLowerCase() === conjuntoStr &&
        f.nome.trim().toLowerCase() === nomeStr
    );
    if (funcionario) {
      return funcionario.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
  }

  try {
    const locatarios = await getLocatariosByConjunto(conjuntoStr);
    const locatario = locatarios.find(
      (l) => l.nome.trim().toLowerCase() === nomeStr
    );
    if (locatario) {
      return locatario.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar locatários:', error);
  }

  return null;
};

const cadastrar = async () => {
  showLoading();

  const novaEncomenda = {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    nome: encomenda.value.nome,
    remetente: encomenda.value.remetente,
    conteudo: encomenda.value.conteudo,
    tipo: 'interno',
    empresa: encomenda.value.empresa,
  };

  try {
    const telefone = await buscarTelefonePorNome(
      novaEncomenda.conjunto,
      novaEncomenda.nome
    );
    const dataBrasilia = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    if (telefone) {
      const response = await createCorrespondenciaInterno(novaEncomenda);

      if (response) {
        const mensagem = `Olá ${novaEncomenda.nome}, sua encomenda foi entregue à portaria do West Tower. Data de Recebimento: *${dataBrasilia}*`;

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
