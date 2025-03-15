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
        <!-- Campo Recebedor Ajustado para ser um q-select -->
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
          name="nome"
          outlined
          clearable
          clear-icon="close"
          v-model="encomenda.recebedor"
          color="indigo-13"
          label="Remetente"
          :rules="[(val) => (val && val.length > 0) || 'Digite nome']"
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from '../../stores/example-store';
import { useRouter } from 'vue-router';
/* import { useCondominosStore } from '../../stores/condominosStore';
import { useFuncionariosStore } from '../../stores/funcionarioStore'; */
import { createCorrespondenciaExterno } from '../../services/encomenExternoAPI';
import { useQuasar } from 'quasar';
//import { enviarMensagemWhatsApp } from '../../services/whatsappAPI';
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
const nomes = ref([]);
/// Função para buscar todos os nomes associados ao conjunto
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
    recebedor: encomenda.value.recebedor,
    conteudo: encomenda.value.conteudo,
    tipo: 'externo',
    local: encomenda.value.local,
  };
  try {
    // Cadastro direto da encomenda sem verificar o telefone
    const response = await createCorrespondenciaExterno(novaEncomenda);

    if (response) {
      // Envio de WhatsApp e verificação de telefone foram removidos
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
