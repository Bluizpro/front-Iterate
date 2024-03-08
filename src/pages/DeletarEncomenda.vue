<template>
  <q-page v-if="encomenda" padding>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          class="q-mr-md"
          :text="encomenda?.destinatario.charAt(0).toUpperCase()"
          color="secondary"
        />
        <div>
          <div class="text-h6">{{ encomenda?.destinatario }}</div>
          <div class="text-subtitle1">Encomenda: {{ encomenda?.conteudo }}</div>
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
import { useCondominosStore } from '../stores/condominos-store';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $router = useRouter();
const $q = useQuasar();

const encomendaId = Number($router.currentRoute.value.params.id);
const useCondominos = useCondominosStore();
const encomenda = useCondominos.condominos
  .flatMap((condomino) => condomino.encomendas)
  .find((encomenda) => encomenda.id === encomendaId);

let justificativa = ref('');

const deletarEncomenda = () => {
  if (encomenda) {
    useCondominos.deletarEncomenda(encomenda.id);
    justificativa.value = '';
    $q.notify({
      type: 'positive',
      message: 'Encomenda deletada com sucesso',
    });

    $router.push('/usuario/Lista de Encomendas');
  } else {
    $q.notify({
      type: 'negative',
      message: 'Encomenda não encontrada',
    });
    $router.push('/usuario/Lista de Encomendas');
  }
};
</script>
