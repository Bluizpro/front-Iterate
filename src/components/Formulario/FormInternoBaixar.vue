<template>
  <div class="form-container">
    <h2>Formulário de Baixa - Encomenda Interna</h2>
    <q-form @submit.prevent="darBaixaInterna" class="q-gutter-md">
      <q-input
        v-model="nomeRecebedorInterno"
        label="Nome do Recebedor"
        filled
        required
      />
      <q-btn label="Dar Baixa" color="primary" type="submit" />
      <q-btn label="Voltar" @click="handleVoltar" color="secondary" />

      <!-- Componente de assinatura -->
      <GeraAssinatura
        :exibirModal="showModalAssinatura"
        @update:exibirModal="showModalAssinatura = $event"
        @salvarAssinatura="salvarAssinatura"
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import GeraAssinatura from '../GeraAssinatura.vue';
import { updateCorrespondenciaInternaRetirada } from '../../services/encomenInterAPI';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// Dados do formulário
const nomeRecebedorInterno = ref('');
// Verifica se é um único ID ou múltiplos IDs
const encomendaIdInterna = ref(
  Array.isArray(route.params.id) ? route.params.id : [route.params.id]
);

const showModalAssinatura = ref(false); // Controle do modal

// Observa o ID da encomenda caso a rota mude (caso o id seja dinâmico)
watch(
  () => route.params.id,
  (newId) => {
    encomendaIdInterna.value = Array.isArray(newId) ? newId : [newId];
  }
);

// Função para dar baixa na encomenda interna
const darBaixaInterna = async () => {
  try {
    // Validação para garantir que o nome do recebedor não seja vazio
    if (!nomeRecebedorInterno.value.trim()) {
      $q.notify({
        type: 'negative',
        message: 'O nome do recebedor é obrigatório!',
      });
      return;
    }

    // Exibir modal para assinatura
    showModalAssinatura.value = true;
  } catch (error) {
    console.error('Erro ao dar baixa:', error);
    // Exibe a mensagem de erro corretamente
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || error.message || 'Erro ao dar baixa!',
    });
  }
};

// Função para salvar a assinatura e dar baixa nas encomendas internas
const salvarAssinatura = async (assinaturaUrl) => {
  // Validação para garantir que o nome do recebedor não seja vazio
  if (!nomeRecebedorInterno.value.trim()) {
    $q.notify({
      type: 'negative',
      message: 'O nome do recebedor é obrigatório!',
    });
    return;
  }

  // Validação para garantir que a assinatura seja fornecida
  if (!assinaturaUrl) {
    $q.notify({
      type: 'negative',
      message: 'A assinatura é obrigatória!',
    });
    return;
  }

  try {
    // Itera sobre os IDs das encomendas, se forem múltiplos
    for (const id of encomendaIdInterna.value) {
      // Enviar os dados para a API para atualizar a encomenda interna
      const resposta = await updateCorrespondenciaInternaRetirada(
        id, // ID da encomenda
        nomeRecebedorInterno.value, // Nome do recebedor
        assinaturaUrl // URL da assinatura
      );

      console.log('Resposta da API:', resposta);

      // Verifica se o ID da encomenda foi retornado com sucesso
      if (resposta && resposta.id) {
        $q.notify({
          type: 'positive',
          message: `Baixa realizada com sucesso para ${nomeRecebedorInterno.value}!`,
        });
      } else {
        throw new Error(resposta?.message || 'Resposta inesperada da API');
      }
    }

    // Resetar o formulário
    resetForm();

    // Fechar o modal de assinatura
    showModalAssinatura.value = false;

    // Navegar para a página de encomendas
    router.push('/usuario/Cards-Encomendas');
  } catch (error) {
    console.error('Erro ao dar baixa interna:', error);

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message || error.message || 'Erro ao dar baixa!',
    });
  }
};

// Função de reset do formulário
const resetForm = () => {
  nomeRecebedorInterno.value = ''; // Limpa o campo do nome do recebedor
  showModalAssinatura.value = false; // Fecha o modal de assinatura
};

// Função de voltar com confirmação
const handleVoltar = () => {
  $q.dialog({
    title: 'Confirmar',
    message:
      'Você tem certeza que deseja voltar? As alterações não salvas serão perdidas.',
    ok: { label: 'Sim', color: 'primary' },
    cancel: { label: 'Cancelar', color: 'negative' },
  }).onOk(() => {
    router.push('/usuario/Cards-Encomendas'); // Alterar conforme a rota correta
  });
};
</script>
<style scoped lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom, #f9f9f9, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  margin: 0 auto;
  margin-top: 2rem;

  h2 {
    font-size: 1.6rem;
    color: #444;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .q-gutter-md {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }

  .q-input {
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: box-shadow 0.2s;

    &:focus-within {
      box-shadow: 0px 0px 6px rgba(0, 123, 255, 0.4);
    }
  }

  .q-btn {
    border-radius: 6px;
    font-weight: bold;
    text-transform: uppercase;
    padding: 10px 15px;
    font-size: 1rem;
    transition: transform 0.2s, background-color 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }

  .q-btn[color='primary'] {
    background: linear-gradient(to right, #4caf50, #81c784);
    color: #fff;

    &:hover {
      background: linear-gradient(to right, #388e3c, #66bb6a);
    }
  }

  .q-btn[color='secondary'] {
    background: linear-gradient(to right, #757575, #9e9e9e);
    color: #fff;

    &:hover {
      background: linear-gradient(to right, #616161, #8d8d8d);
    }
  }

  /* Estilo adicional para o componente de assinatura */
  GeraAssinatura {
    margin-top: 20px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    padding: 10px;
    background-color: #fafafa;
  }
}
</style>
