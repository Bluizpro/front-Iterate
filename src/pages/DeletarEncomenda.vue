<template>
  <q-page v-if="encomenda" padding>
    <h1 class="q-heading text-h5 text-weight-medium text-center">
      Deletar encomenda
    </h1>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          class="q-mr-md"
          :text="encomenda?.destinatario.charAt(0).toUpperCase()"
          color="secondary"
        />
        <div>
          <div class="text-h6">{{ encomenda?.destinatario }}</div>
          <div class="text-subtitle1">conteúdo: {{ encomenda?.conteudo }}</div>
          <div class="text-subtitle1">encomenda: {{ encomenda?.tipo }}</div>
          <div class="text-subtitle1">Conjunto: {{ encomenda?.conjunto }}</div>
        </div>
      </q-card-section>

      <q-card-actions>
        <div class="col-12 q-gutter-sm">
          <q-btn
            class="float-right"
            rounded
            label="Deletar"
            color="negative"
            @click="deletarEncomenda"
            :disable="justificativa.length < 20"
          />
          <q-btn
            class="float-right"
            rounded
            label="Cancelar"
            color="white"
            text-color="indigo-14"
            :to="{ name: 'listaDeEncomendas' }"
          />
        </div>
      </q-card-actions>
    </q-card>
    <q-input
      class="q-mt-lg"
      v-model="justificativa"
      label="Justificativa"
      counter
      hint="Digite uma justificativa com pelo menos 20 caracteres"
      :rules="[(val:string) => val && val.length >= 20 || 'A justificativa deve ter no mínimo 20 caracteres']"
    />
  </q-page>
  <q-page v-else>
    <div>Encomenda não encontrada</div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useEncomendasStore } from '../stores/encomendaStore';
import { useQuasar } from 'quasar';
import { ref, onBeforeUnmount } from 'vue';
import { useCondominosStore } from 'src/stores/condominosStore';
import { useFuncionariosStore } from 'src/stores/funcionarioStore';

const $router = useRouter();
const $q = useQuasar();
const useEncomendas = useEncomendasStore();
const useCondominos = useCondominosStore();
const useFuncionarios = useFuncionariosStore();

const encomendaId = Number($router.currentRoute.value.params.id);

let timer: NodeJS.Timeout | null = null;

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

//capturando a encomenda
const encomenda = useEncomendas.encomendas.find(
  (encomenda) => encomenda.id === encomendaId
);

let justificativa = ref('');

const deletarEncomenda = async () => {
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Encontrar a encomenda no array de encomendas
  const encomenda = useEncomendas.encomendas.find(
    (encomenda) => encomenda.id === encomendaId
  );
  if (encomenda) {
    var index = 1;
    const condomino = useCondominos.condominos.find((condomino) => {
      index = condomino.encomendas.indexOf(encomenda);
      return index !== -1;
    });
    const funcionario = useFuncionarios.funcionarios.find((funcionario) => {
      index = funcionario.encomendas.indexOf(encomenda);
      return index !== -1;
    });
    if (condomino) {
      condomino.encomendas.splice(index, 1);
      condomino.encomendas = [...condomino.encomendas]; // Criar uma nova cópia do array
      useEncomendas.deletarEncomenda(encomenda.id); // Atualizar a contagem de encomendas
    } else if (funcionario) {
      funcionario.encomendas.splice(index, 1);
      funcionario.encomendas = [...funcionario.encomendas]; // Criar uma nova cópia do array
      useEncomendas.deletarEncomenda(encomenda.id); // Atualizar a contagem de encomendas
    }
    justificativa.value = '';
    hideLoading();
    $q.notify({
      type: 'positive',
      message: 'Encomenda deletada com sucesso',
    });
    $router.push('/usuario/Lista-de-Encomendas');
  } else {
    hideLoading();
    $q.notify({
      type: 'negative',
      message: 'Encomenda não encontrada',
    });
    $router.push('/usuario/Lista-de-Encomendas');
  }
};
</script>
