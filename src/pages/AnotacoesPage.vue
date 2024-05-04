<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Anotacões</h1>
    <div class="border">
      <div class="note-container">
        <AnotacaoComponent
          v-for="(anotacao, index) in forms"
          :key="index"
          :anotacao="anotacao"
          @submit="onSubmit(index)"
          @reset="onReset(index)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AnotacaoComponent from '../components/AnotacaoComponent.vue'; // Importe o componente AnotacaoComponent

const forms = ref([
  {
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    usuario: localStorage.getItem('usuarioLogado') || '',
    paciente: '',
    status: '',
    info: '',
  },
]); // Inicialize com um formulário vazio

const onSubmit = (index) => {
  if (
    forms.value[index].usuario === '' ||
    forms.value[index].paciente === '' ||
    forms.value[index].conjunto === '' ||
    forms.value[index].status === '' ||
    forms.value[index].info === ''
  ) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Por favor, preencha todos os campos',
    });
  } else {
    // Quando salvar, adicione um novo formulário ao array
    forms.value.push({
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      usuario: localStorage.getItem('usuarioLogado') || '',
      paciente: '',
      status: '',
      info: '',
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
  forms.value[index].paciente = '';
  forms.value[index].status = '';
  forms.value[index].conjunto === '';

  forms.value[index].info = '';
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
