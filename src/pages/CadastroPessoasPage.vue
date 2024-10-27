<template>
  <q-page padding>
    <FormVisitante v-if="store.formularioAtual == 'visitante'" />
    <FormCondomino v-if="store.formularioAtual == 'condômino'" />
    <FormFuncionario v-if="store.formularioAtual == 'funcionario'" />
    <div class="card-container" v-if="store.formularioAtual == ''">
      <CardButao :lista-de-dados="pessoas" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CardButao from 'src/components/CardButao.vue';
import { ref } from 'vue';
import { useStore } from '../stores/example-store';
import { listData } from '../stores/Imodels';
import FormVisitante from 'src/components/Formulario/FormVisitante.vue';
import FormCondomino from 'src/components/Formulario/FormCondomino.vue';
import FormFuncionario from 'src/components/Formulario/FormFuncionario.vue';

const store = useStore();

const pessoas = ref<listData>({
  imagem: [
    '/imagem/visitantes.svg',
    '/imagem/condonimos.svg',
    '/imagem/funcionario.svg',
  ],
  tipo: ['visitante', 'condômino', 'funcionario'],
});
</script>

<style scoped lang="scss">
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card-item {
  position: relative;
  width: 100%;
  height: 200px; /* Altura fixa para os cards */
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transição suave para hover */
  background-color: white; /* Fundo do card */
  border-radius: 8px; /* Bordas arredondadas */
}

.card-item:hover {
  transform: translateY(-5px); /* Move o card para cima ao passar o mouse */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Sombra mais intensa ao passar o mouse */
}

.card-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-type {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem;
  text-align: center;
  border-radius: 0 0 8px 8px; /* Arredondando os cantos do texto */
}

@media (min-width: 768px) {
  .card-image {
    max-width: 80%;
    max-height: 80%;
  }
}
</style>
