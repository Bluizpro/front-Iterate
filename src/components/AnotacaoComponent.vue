<template>
  <q-page>
    <div
      class="note-container"
      v-for="(anotacao, index) in paginatedForms"
      :key="index"
    >
      <q-form
        @submit.prevent="onSubmit(index)"
        class="q-gutter-md row items-center justify-start"
      >
        <q-input
          disable
          readonly
          name="Data"
          outlined
          v-model="anotacao.data"
          color="indigo-13"
          label="Data"
          class="col-2"
        >
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-input>
        <q-input
          disable
          readonly
          name="Hora"
          outlined
          v-model="anotacao.hora"
          color="indigo-13"
          label="Hora"
          class="col-2 hora"
        >
          <template v-slot:prepend>
            <q-icon name="access_time" />
          </template>
        </q-input>
        <q-input
          disable
          name="Usuario"
          outlined
          v-model="anotacao.usuario"
          color="indigo-13"
          label="Nome do usuário"
          class="col-1"
        >
        </q-input>
        <q-input
          outlined
          v-model="anotacao.conjunto"
          label="Conjunto"
          class="col-1"
        />
        <q-input
          outlined
          v-model="anotacao.paciente"
          label="Paciente"
          color="indigo-13"
          class="col-2"
        />

        <q-select
          outlined
          v-model="anotacao.info"
          :options="infoOptions"
          :class="colorClass(anotacao.info)"
          label="Informações"
          class="col-1"
        />
        <q-btn
          icon="save"
          color="primary"
          flat
          class="button-save"
          size="10px"
          @click="onSubmit(index)"
        />
        <q-btn
          icon="done"
          color="green"
          flat
          class="button-done"
          size="10px"
          @click="onReset(index)"
        />
      </q-form>
    </div>
    <div class="flex flex-center paginação">
      <q-pagination v-model="currentPage" :max="maxPages" />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';
import * as AnnotationService from '../services/anotacaoApi';

const $q = useQuasar();
const formsPerPage = 7;
const currentPage = ref(1);

const forms = ref([]);
const ensureEmptyForm = {
  data: dayjs().format('DD/MM/YYYY'),
  hora: dayjs().format('HH:mm:ss'),
  usuario: localStorage.getItem('usuarioLogado') || '',
  conjunto: '',
  paciente: '',
  info: '',
  salvo: false,
};

const maxPages = computed(() => Math.ceil(forms.value.length / formsPerPage));
const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * formsPerPage;
  const end = start + formsPerPage;
  return forms.value.slice(start, end);
});

let intervalId;

onMounted(async () => {
  intervalId = setInterval(() => {
    forms.value.forEach((form, index) => {
      if (
        !form.salvo &&
        form.conjunto === '' &&
        form.paciente === '' &&
        form.info === ''
      ) {
        forms.value[index].hora = dayjs().format('HH:mm:ss');
      }
    });
  }, 1000);

  try {
    const loadedAnnotations = await AnnotationService.getAnnotations();
    forms.value = loadedAnnotations;

    if (forms.value.length === 0) {
      forms.value.push({ ...ensureEmptyForm });
    } else {
      forms.value.push({ ...ensureEmptyForm });
    }
  } catch (error) {
    console.error('Erro ao carregar Anotaçoes:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao carregar Anotaçoes:',
    });
  }
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const onSubmit = async (index) => {
  const form = forms.value[index];

  if (
    form.usuario === '' ||
    form.paciente === '' ||
    form.conjunto === '' ||
    form.info === ''
  ) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Por favor, preencha todos os campos',
    });
    return;
  }

  try {
    const savedForm = await AnnotationService.createAnnotation({
      ...form,
      data: form.data,
      hora: form.hora,
    });

    forms.value[index] = { ...savedForm, salvo: true };
    const allFormsSaved = forms.value.every((form) => form.salvo);
    if (allFormsSaved) {
      forms.value.push({ ...ensureEmptyForm });
    }

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Salvo Com Sucesso',
    });
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao salvar anotação',
    });
  }
};

const onReset = async (index) => {
  try {
    const form = forms.value[index];
    if (form.id) {
      console.log('Tentando arquivar Anotaçao com ID:', form.id);
      const response = await AnnotationService.archiveAnnotation(form.id);
      console.log('Resposta da API:', response);
      forms.value.splice(index, 1);
    } else {
      console.log('Formulário não salvo, não será arquivado.');
    }

    if (
      forms.value.length === 0 ||
      (forms.value.length === 1 && !forms.value[0].salvo)
    ) {
      forms.value = [{ ...ensureEmptyForm }];
    }

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Anotação arquivada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao arquivar anotação:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao arquivar anotação',
    });
  }
};

const infoOptions = ['AG/2T', 'PS', 'PS/+1T', 'AG', 'AG/CF', 'AG/CM'];
const colorClass = (info) => {
  switch (info) {
    case 'AG/2T':
      return 'yellow-background';
    case 'AG':
      return 'red-background';
    case 'AG/CM':
      return 'green-background';
    case 'PS':
      return 'background';
    case 'AG/CF':
      return 'orange-background';
    case 'PS/+1T':
      return 'blue-background';
    default:
      return '';
  }
};
</script>

<style scoped lang="scss">
.row.items-start.justify-start {
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}
.q-form .q-field {
  margin-right: 1px !important;
}
.note-container {
  border: 3px solid #ccc;
  padding: 2rem;
  width: 95%;
  height: 100px;
  align-items: flex-start;
  margin: auto;
  margin-top: 1rem;
}
.button-save,
.button-done {
  margin-left: 3px !important;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
}
.yellow-background {
  background-color: rgb(250, 250, 144);
}
.red-background {
  background-color: #f07171;
}
.green-background {
  background-color: rgb(152, 228, 152);
}
.background {
  background-color: rgb(255, 255, 255);
}
.orange-background {
  background-color: rgb(253, 202, 107);
}
.blue-background {
  background-color: rgb(147, 147, 247);
}
.paginação {
  margin-top: 2rem;
}
</style>
