<template>
  <div class="row q-mt-md justify-around">
    <q-card
      class="my-card col-md-3 col-sm-3 col-xs-12"
      bordered
      v-for="(imagem, idx) in listaDeDados.imagem"
      :key="idx"
    >
      <div class="image-container">
        <q-img :src="imagem" class="fixed-size-image centered-image" />
      </div>

      <q-separator />

      <q-card-actions>
        <q-btn
          push
          rounded
          class="col-md-12 col-sm-12 col-xs-12"
          :label="listaDeDados.tipo[idx]"
          type="submit"
          color="indigo-14"
          @click="mostrarListaDeEncomendas(listaDeDados.tipo[idx])"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, type PropType } from 'vue';
import { useStore } from '../stores/example-store';
import { listData } from '../components/Imodels';
import { useRouter } from 'vue-router';

const store = useStore();
const $router = useRouter();

defineProps({
  listaDeDados: {
    type: Object as PropType<listData>,
    required: true,
  },
});

const mostrarListaDeEncomendas = (encomenda: string): void => {
  store.setFormularioAtual(encomenda);
  if (
    encomenda == 'interno' ||
    encomenda == 'externo' ||
    encomenda == 'sedex'
  ) {
    $router.push('/usuario/Lista-de-Encomendas');
  } else if (encomenda == 'visitante' || encomenda == 'condômino') {
    console.log('voce esta na pagina de cadastro de Pessoas');
  } else {
    $router.push('/:catchAll(.*)*');
  }
};
</script>
<style scoped>
.fixed-size-image {
  width: 300px;
  height: 200px;
}

.centered-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
