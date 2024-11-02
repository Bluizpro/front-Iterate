<template>
  <q-page>
    <div
      class="note-container"
      v-for="(qtcInfor, index) in paginatedForms"
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
          v-model="qtcInfor.data"
          color="indigo-13"
          label="Data"
          class="col data-input"
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
          v-model="qtcInfor.hora"
          color="indigo-13"
          label="Hora"
          class="col hora-input"
        >
          <template v-slot:prepend>
            <q-icon name="access_time" />
          </template>
        </q-input>
        <q-input
          outlined
          v-model="qtcInfor.conjunto"
          label="Conjunto"
          class="col conjunto-input"
        />
        <q-input
          disable
          name="Usuario"
          outlined
          v-model="qtcInfor.usuario"
          color="indigo-13"
          label="Nome do usuário"
          class="col usuario-input"
        />
        <q-input
          outlined
          v-model="qtcInfor.prestador"
          label="Prestador"
          color="indigo-13"
          class="col prestador-input"
        />
        <q-input
          outlined
          v-model="qtcInfor.informacao"
          label="Informações"
          class="col informacao-input"
        >
          <template v-slot:append>
            <q-icon name="info">
              <q-tooltip>
                <div class="custom-tooltip">
                  {{ qtcInfor.informacao }}
                </div>
              </q-tooltip>
            </q-icon>
          </template>
        </q-input>

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
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import * as QtcInforService from '../services/qtcInforApi';

const $q = useQuasar();
const formsPerPage = 10;
const currentPage = ref(1);
const forms = ref([]);

const emptyForm = {
  data: dayjs().format('DD/MM/YYYY'),
  hora: dayjs().format('HH:mm:ss'),
  usuario: localStorage.getItem('usuarioLogado') || '',
  conjunto: '',
  prestador: '',
  informacao: '',
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
        form.prestador === '' &&
        form.informacao === ''
      ) {
        forms.value[index].hora = dayjs().format('HH:mm:ss');
      }
    });
  }, 1000);
  try {
    const loadedQtcs = await QtcInforService.getQtcInfos();
    forms.value = loadedQtcs;

    if (forms.value.length === 0) {
      forms.value.push({ ...emptyForm });
    } else {
      forms.value.push({ ...emptyForm });
    }
  } catch (error) {
    console.error('Erro ao carregar qtc:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao carregar qtc:',
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
    form.prestador === '' ||
    form.informacao === '' ||
    form.conjunto === ''
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
    const savedForm = await QtcInforService.createQtcInfos({
      ...form,
      data: form.data,
      hora: form.hora,
    });

    forms.value[index] = { ...savedForm, salvo: true };

    // Adiciona um novo formulário vazio sem verificar se todos estão salvos
    forms.value.push({ ...emptyForm });

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Salvo com sucesso',
    });
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao salvar Qtc',
    });
  }
};

const onReset = async (index) => {
  try {
    const form = forms.value[index];
    if (form.id) {
      console.log('Tentando arquivar QTC com ID:', form.id);
      const response = await QtcInforService.archiveQtcInfo(form.id);
      console.log('Resposta da API:', response);

      forms.value.splice(index, 1);
    } else {
      console.log('Formulário não salvo, não será arquivado.');
    }
    if (
      forms.value.length === 0 ||
      (forms.value.length === 1 && !forms.value[0].salvo)
    ) {
      forms.value = [{ ...emptyForm }];
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
</script>

<style scoped lang="scss">
.row.items-start.justify-start {
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.q-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; // Espaçamento entre inputs
}

.note-container {
  border: 3px solid #ccc;
  padding: 1rem;
  width: 60%;
  min-height: 150px;
  align-items: flex-start;
  margin: auto;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
}

.data-input {
  flex: 1 1 15%; // Largura proporcional para preencher espaço da esquerda para a direita
  max-width: 10rem;
}
.hora-input {
  flex: 1 1 12%;
  max-width: 8rem;
}
.conjunto-input {
  flex: 1 1 20%;
  max-width: 5rem;
}
.usuario-input {
  flex: 1 1 15%;
  max-width: 8rem;
}
.prestador-input {
  flex: 1 1 20%;
  max-width: 200px;
}
.informacao-input {
  flex: 1 1 30%;
  max-width: 40rem;
}

.button-save,
.button-done {
  margin-left: 1px !important;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 4px;
  min-width: 45px;
}

.paginação {
  margin-top: 2rem;
}

.custom-tooltip {
  font-size: 1.2em;
}
</style>
