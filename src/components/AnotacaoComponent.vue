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
          class="col-2 data"
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
          class="col-1 conjunto"
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
const formsPerPage = 10;
const currentPage = ref(1);
const forms = ref([]);

// Estrutura do formulário vazio
const ensureEmptyForm = {
  data: dayjs().format('DD/MM/YYYY'),
  hora: dayjs().format('HH:mm:ss'),
  usuario: localStorage.getItem('usuarioLogado') || '',
  conjunto: '',
  paciente: '',
  info: '',
  salvo: false,
};

// Computed para max de páginas
const maxPages = computed(() => Math.ceil(forms.value.length / formsPerPage));

// Computed para formulários paginados
const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * formsPerPage;
  const end = start + formsPerPage;
  return forms.value.slice(start, end);
});

let intervalId;

// Função para buscar os dados do backend e atualizar a lista de formulários
const fetchForms = async () => {
  try {
    const loadedAnnotations = await AnnotationService.getAnnotations();
    forms.value = loadedAnnotations;

    // Adiciona um formulário vazio se necessário
    if (
      forms.value.length === 0 ||
      (forms.value.length > 0 && !forms.value[forms.value.length - 1].salvo)
    ) {
      forms.value.push({ ...ensureEmptyForm });
    }
  } catch (error) {
    console.error('Erro ao carregar Anotações:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao carregar Anotações:',
    });
  }
};

onMounted(async () => {
  // Atualiza a hora dos formulários não salvos
  intervalId = setInterval(() => {
    forms.value.forEach((form) => {
      if (
        !form.salvo &&
        form.conjunto === '' &&
        form.paciente === '' &&
        form.info === ''
      ) {
        form.hora = dayjs().format('HH:mm:ss');
      }
    });
  }, 1000);

  // Carrega os dados iniciais
  await fetchForms();
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const onSubmit = async (index) => {
  const form = paginatedForms.value[index];

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

    // Substitui o formulário atual na lista
    forms.value.splice((currentPage.value - 1) * formsPerPage + index, 1, {
      ...savedForm,
      salvo: true,
    });

    // Adiciona um novo formulário vazio ao final da lista
    forms.value.push({ ...ensureEmptyForm });

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Salvo com sucesso',
    });

    await fetchForms(); // Atualiza os dados após salvar
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
      await AnnotationService.archiveAnnotation(form.id);
      forms.value.splice(index, 1); // Remove o formulário arquivado
    }

    if (!forms.value.some((f) => !f.salvo)) {
      forms.value.push({ ...ensureEmptyForm });
    }

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Anotação arquivada com sucesso',
    });

    await fetchForms(); // Atualiza os dados após arquivar
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
  margin-right: 8px; /* Espaçamento entre campos */
}

/* Ajustes para o container das notas */
.note-container {
  border: 3px solid #ccc;
  padding: 1rem;
  width: 95%;
  height: auto;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Estilos específicos para cada input */
.q-input.data {
  width: 150px; /* Largura do campo Data */
}

.q-input.hora {
  width: 120px; /* Largura do campo Hora */
}

.q-input.usuario {
  width: 150px; /* Largura do campo Usuário */
}

.q-input.conjunto {
  width: 150px; /* Largura do campo Conjunto */
}

.q-input.paciente {
  width: 200px; /* Largura do campo Paciente */
}

.q-select {
  width: 280px; /* Largura do campo Informações */
}

/* Estilos para os botões */
.button-save,
.button-done {
  margin-left: 8px;
  border: 1px solid #ccc;
  padding: 6px 12px; /* Ajuste do padding para melhor aparência */
  border-radius: 4px;
  font-size: 14px !important; /* Tamanho do texto */
  cursor: pointer;
}

/* Adiciona hover aos botões para melhor UX */
.button-save:hover,
.button-done:hover {
  background-color: rgba(
    0,
    0,
    0,
    0.1
  ); /* Sutil mudança de cor ao passar o mouse */
}

/* Cores de fundo para os elementos */
.yellow-background {
  background-color: rgb(250, 250, 144);
}

.red-background {
  background-color: #f07171;
}

.green-background {
  background-color: rgb(152, 228, 152);
}

.orange-background {
  background-color: rgb(253, 202, 107);
}

.blue-background {
  background-color: rgb(147, 147, 247);
}

/* Estilo da paginação */
.paginação {
  margin-top: 2rem;
  font-size: 16px;
}
</style>
