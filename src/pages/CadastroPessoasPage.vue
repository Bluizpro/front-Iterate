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
  padding-top: 100%; /* Mantém uma proporção quadrada do card */
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  border-radius: 8px;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
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
  width: 90%; /* Ajusta o SVG para 90% da largura do card */
  height: auto; /* Mantém a proporção do SVG */
  max-height: 90%; /* Limita a altura do SVG para evitar cortes */
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
  border-radius: 0 0 8px 8px;
}

@media (min-width: 768px) {
  .card-image {
    width: 80%; /* Ajuste adicional para telas maiores */
    max-height: 80%;
  }
}
</style>
