<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">QTC</h1>
    <div class="border">
      <div class="note-container">
        <QtcComponent
          v-for="(qtcInfor, index) in qtcInfors"
          :key="index"
          :anotacao="qtcInfor"
          @submit="onSubmit(index)"
          @reset="onReset(index)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import QtcComponent from '../components/QtcComponent.vue'; // Importe o componente AnotacaoComponent

const qtcInfors = ref(
  JSON.parse(localStorage.getItem('qtcInfors')) || [
    {
      data: '',
      hora: '', // Retorna a hora no formato "hh:mm:ss"
      usuario: localStorage.getItem('usuarioLogado') || '',
      paciente: '',
      status: '',
      info: '',
    },
  ]
);

const onSubmit = (index) => {
  if (
    qtcInfors.value[index].usuario === '' ||
    qtcInfors.value[index].paciente === '' ||
    qtcInfors.value[index].conjunto === '' ||
    qtcInfors.value[index].informacoes === ''
  ) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Por favor, preencha todos os campos',
    });
  } else {
    // Quando salvar, adicione um novo formulário ao array
    qtcInfors.value.push({
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      usuario: localStorage.getItem('usuarioLogado') || '',
      paciente: '',
      informacoes: '',
      conjunto: '',
    });

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Salvo Com Sucesso',
    });
  }
};

const onReset = (index) => {
  qtcInfors.value[index].paciente = '';
  qtcInfors.value[index].informacoes = '';
  qtcInfors.value[index].conjunto = '';
};
</script>

<style scoped lang="scss">
.border {
  border: 1px solid #000 !important;
  margin-left: 1rem;
  margin-top: 1rem;

  margin-right: 2rem;
  background-color: rgb(235 208 208 / 20%);
}
</style>
