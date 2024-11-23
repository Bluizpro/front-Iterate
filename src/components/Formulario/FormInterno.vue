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
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { createCorrespondenciaInterno } from '../../services/encomenInterAPI';
import { getLocatariosByConjunto } from '../../services/locatarioApi';
import { getCondominos } from '../../services/condonimoApi';
import { getFuncionario } from '../../services/funcionarioApi';
import SpinnerComponente from 'src/components/SpinnerComponente.vue'; // Importe o componente

const store = useStore();
const $q = useQuasar();
const $router = useRouter();
const isLoading = ref(false); // Controle de estado para o spinner

const encomenda = ref({
  data: '',
  hora: '',
  conjunto: '',
  nome: '',
  remetente: '',
  conteudo: '',
  empresa: '',
});

const nomes = ref([]); // Lista de nomes a ser preenchida dinamicamente

onMounted(() => {
  const agora = new Date();
  encomenda.value.data = agora.toLocaleDateString('pt-BR');
  encomenda.value.hora = agora.toLocaleTimeString('pt-BR');
});

// Função para buscar todos os nomes associados ao conjunto
const buscarNomesPorConjunto = async (conjunto) => {
  console.log('Buscando nomes para o conjunto:', conjunto);

  const conjuntoStr = String(conjunto).trim().toLowerCase();
  let resultados = [];

  // Busca nos condomínios
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

  // Busca nos funcionários
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

  // Busca nos locatários
  try {
    const locatarios = await getLocatariosByConjunto(conjuntoStr);
    resultados = resultados.concat(locatarios.map((l) => l.nome));
  } catch (error) {
    console.error('Erro ao buscar locatários:', error);
  }

  // Remover duplicatas
  const nomesUnicos = Array.from(new Set(resultados));

  console.log('Nomes encontrados:', nomesUnicos);
  return nomesUnicos;
};

// Observa mudanças no campo conjunto e atualiza a lista de nomes
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
  isLoading.value = true; // Mostra o spinner
};

const hideLoading = () => {
  isLoading.value = false; // Esconde o spinner
  $q.loading.hide();
};

const voltar = () => {
  $router.push('/usuario/Cards-Encomendas'); // Ajuste conforme sua rota
};

// Função para buscar telefone, caso necessário no futuro
const buscarTelefonePorNome = async (conjunto, nome) => {
  let telefone = null;
  // Aqui pode ser implementada a lógica para buscar o telefone no futuro
  return telefone; // Retorna o telefone encontrado, se existir
};

// Função para cadastrar a encomenda
const cadastrar = async () => {
  showLoading();

  const novaEncomenda = {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    nome: encomenda.value.nome, // Nome selecionado no <q-select>
    remetente: encomenda.value.remetente,
    conteudo: encomenda.value.conteudo,
    tipo: 'interno',
    empresa: encomenda.value.empresa,
  };

  try {
    // Buscar o telefone para verificar, mas não impedir o cadastro
    const telefone = await buscarTelefonePorNome(
      novaEncomenda.conjunto,
      novaEncomenda.nome
    );

    if (telefone) {
      // Se o telefone for encontrado, você pode adicionar a lógica para enviar a mensagem
      // Exemplo de código comentado para envio de mensagem de WhatsApp (no futuro)
      /*
      const mensagem = `Olá ${novaEncomenda.nome}, sua encomenda foi entregue à portaria. `;

      try {
        await enviarMensagemWhatsApp(telefone, mensagem);
        console.log(`Mensagem enviada com sucesso para: ${novaEncomenda.nome}`);
      } catch (err) {
        console.error('Erro ao enviar mensagem via WhatsApp:', err);
        $q.notify({
          type: 'warning',
          message:
            'Encomenda cadastrada, mas ocorreu um erro ao enviar a mensagem.',
        });
      }
      */
    } else {
      // Notificar se o telefone não foi encontrado
      console.warn('Telefone não encontrado para:', novaEncomenda.nome);
      $q.notify({
        type: 'warning',
        message:
          'Encomenda cadastrada, mas o telefone do destinatário não foi encontrado.',
      });
    }

    // Criação da encomenda sem bloquear o fluxo por falta de telefone
    const response = await createCorrespondenciaInterno(novaEncomenda);

    if (response) {
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
