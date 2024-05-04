<template>
  <q-page padding>
    <div v-if="!store.formularioAtual" class="row q-gutter-md q-mt-md">
      <q-btn
        class="col-md-5 col-sm-5 col-xs-12"
        label="Cadastrar Pessoas"
        type="submit"
        color="primary"
        @click="store.setFormularioAtual('pessoas')"
      ></q-btn>

      <q-btn
        class="col-md-5 col-sm-5 col-xs-12"
        label="Cadastrar Encomenda"
        type="submit"
        color="primary"
        @click="store.setFormularioAtual('encomenda')"
      ></q-btn>
    </div>

    <FormularioPessoas
      v-if="store.formularioAtual === 'pessoas'"
      @fecharFormulario="fecharFormulario"
    />
    <FormularioProdutos
      v-if="store.formularioAtual === 'encomenda'"
      @fecharFormulario="fecharFormulario"
    />
  </q-page>
</template>

<script setup lang="ts">
import FormularioPessoas from '../components/FormularioPessoas.vue';
import FormularioProdutos from '../components/FormularioProdutos.vue';
import { useStore } from '../stores/example-store';

const store = useStore();

const fecharFormulario = () => {
  store.resetFormularioAtual();
};

// ignorar essa pagina
</script>
