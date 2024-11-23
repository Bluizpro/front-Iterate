<template>
  <div class="form-container">
    <h2>Formulário de Baixa - Encomenda Externa</h2>
    <q-form @submit.prevent="darBaixa" class="q-gutter-md">
      <q-input
        v-model="nomeRecebedor"
        label="Nome do Recebedor"
        filled
        required
      />
      <q-btn label="Dar Baixa" color="primary" type="submit" />
      <q-btn label="Voltar" @click="handleVoltar" color="secondary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { updateCorrespondenciaExternoRetirada } from '../../services/encomenExternoAPI';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// Dados do formulário
const nomeRecebedor = ref('');
const encomendaId = ref(route.params.id); // Acessando o ID da encomenda

// Observa o ID da encomenda caso a rota mude (caso o id seja dinâmico)
watch(
  () => route.params.id,
  (newId) => {
    encomendaId.value = newId;
  }
);

// Função para dar baixa na encomenda externa
const darBaixa = async () => {
  try {
    // Validação para garantir que o nome não seja vazio
    if (!nomeRecebedor.value.trim()) {
      $q.notify({
        type: 'negative',
        message: 'O nome do recebedor é obrigatório!',
      });
      return;
    }

    // Enviando diretamente o nome
    const resposta = await updateCorrespondenciaExternoRetirada(
      encomendaId.value,
      nomeRecebedor.value // Passando apenas o nome
    );

    console.log('Resposta da baixa:', resposta);
    $q.notify({
      type: 'positive',
      message: `Baixa realizada com sucesso para ${nomeRecebedor.value}!`,
    });

    // Navegar para a página de encomendas
    router.push('/usuario/Cards-Encomendas');
  } catch (error) {
    console.error('Erro ao dar baixa:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao dar baixa!',
    });
  }
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
  background: linear-gradient(to bottom, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
  margin-top: 3rem;

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
  }

  .q-gutter-md {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .q-input {
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .q-btn {
    border-radius: 6px;
    font-weight: bold;
    text-transform: uppercase;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }

  .q-btn:last-of-type {
    margin-top: 10px;
  }

  .q-btn[color='primary'] {
    background: linear-gradient(to right, #4caf50, #66bb6a);
  }

  .q-btn[color='secondary'] {
    background: linear-gradient(to right, #757575, #9e9e9e);
  }
}
</style>
