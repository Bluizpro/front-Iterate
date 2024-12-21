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
          :rules="[(val) => (val && val.length > 0) || 'Digite o numero']"
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
          name="notaFiscal"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.notaFiscal"
          label="Nota fiscal"
          :rules="[(val) => (val && val.length > 0) || 'Campo Obrigatório']"
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
    <SpinnerComponente v-if="isLoading" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

import { useStore } from '../../stores/example-store'; // Atualize o caminho se necessário
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { createCorrespondenciaSedex } from '../../services/encomenSedexAPI';
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
  conteudo: '',
  notaFiscal: '',
});
const nomes = ref([]);
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
const voltar = () => {
  $router.push('/usuario/Cards-Encomendas'); // Ajuste conforme sua rota
};
const hideLoading = () => {
  isLoading.value = false; // Esconde o spinner
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
      console.log('Telefone encontrado no condomínio:', condomino.telefone);
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
      console.log('Telefone encontrado no funcionário:', funcionario.telefone);
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
      console.log('Telefone encontrado no locatário:', locatario.telefone);
      return locatario.telefone;
    }
  } catch (error) {
    console.error('Erro ao buscar locatários da API:', error);
  }

  // Se não encontrar, retorna null
  console.warn('Telefone não encontrado para:', nome);
  return null;
};
const cadastrar = async () => {
  showLoading();

  const novaEncomenda = {
    data: encomenda.value.data,
    hora: encomenda.value.hora,
    conjunto: encomenda.value.conjunto,
    nome: encomenda.value.nome,
    conteudo: encomenda.value.conteudo,
    tipo: 'correio',
    notaFiscal: encomenda.value.notaFiscal,
  };
  try {
    // Primeiro, buscar o telefone para verificar se a encomenda pode ser cadastrada
    const telefone = await buscarTelefonePorNome(
      novaEncomenda.conjunto,
      novaEncomenda.nome
    );
    const dataEnvio = new Date();
    const dataBrasilia = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo', // Fuso horário de Brasília
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(dataEnvio);

    if (telefone) {
      // Se o telefone for encontrado, cria a encomenda
      const response = await createCorrespondenciaSedex(novaEncomenda);

      if (response) {
        // Cria a mensagem com a data incluída no corpo
        const mensagem = `Olá ${novaEncomenda.nome}, sua encomenda do Correio foi entregue à portaria do West Tower. Data de Recebimento: *${dataBrasilia}*`;

        // Dentro do seu código onde você chama a função de enviar a mensagem
        try {
          const dataEnvio = new Date().toISOString(); // Obtém a data atual no formato ISO

          // Envia a mensagem e passa a data de envio
          await enviarMensagemWhatsApp(telefone, mensagem, dataEnvio);

          console.log(
            `Mensagem enviada com sucesso para: ${novaEncomenda.nome} em ${dataEnvio}`
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
