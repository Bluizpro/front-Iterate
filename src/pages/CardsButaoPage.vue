<template>
  <q-page padding>
    <div class="card-container">
      <CardButao :lista-de-dados="tipoDeEntrega" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CardButao from 'src/components/CardButao.vue';
import { ref } from 'vue';
import { listData } from '../components/Imodels';

const tipoDeEntrega = ref<listData>({
  imagem: ['/imagem/interno1.png', '/imagem/externo.png', '/imagem/sedex1.png'],
  tipo: ['interno', 'externo', 'sedex'],
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
  height: 0;
  padding-bottom: 100%;
  overflow: hidden;
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
  width: 80%;
  height: 80%;
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
}

@media (min-width: 768px) {
  .card-image {
    width: 70%;
    height: 70%;
  }
}
</style>
