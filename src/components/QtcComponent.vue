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
          color="green"
          label="Salvar"
          flat
          class="button-save"
          size="15px"
          @click="onSubmit(index)"
        />
        <q-btn
          icon="archive"
          color="red"
          label="Arquivar"
          flat
          class="button-done"
          size="15px"
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
const formsPerPage = 10; // Número de QTCs por página
const currentPage = ref(1); // Página atual
const forms = ref([]); // Lista de QTCs

// Estrutura do formulário vazio
const emptyForm = {
  data: dayjs().format('DD/MM/YYYY'),
  hora: dayjs().format('HH:mm:ss'),
  usuario: localStorage.getItem('usuarioLogado') || '',
  conjunto: '',
  prestador: '',
  informacao: '',
  salvo: false,
};

// Computed para max de páginas
const maxPages = computed(() => Math.ceil(forms.value.length / formsPerPage));

// Computed para QTCs paginados
const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * formsPerPage;
  const end = start + formsPerPage;
  return forms.value.slice(start, end);
});

let intervalId;

// Função para buscar QTCs do backend e atualizar a lista
const fetchQtcs = async () => {
  try {
    const loadedQtcs = await QtcInforService.getQtcInfos();
    forms.value = loadedQtcs;

    // Adiciona um formulário vazio se necessário
    if (
      forms.value.length === 0 ||
      (forms.value.length > 0 && !forms.value[forms.value.length - 1].salvo)
    ) {
      forms.value.push({ ...emptyForm });
    }
  } catch (error) {
    console.error('Erro ao carregar QTC:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao carregar QTC:',
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
        form.prestador === '' &&
        form.informacao === ''
      ) {
        form.hora = dayjs().format('HH:mm:ss');
      }
    });
  }, 1000);

  // Carrega os dados iniciais
  await fetchQtcs();
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const onSubmit = async (index) => {
  const form = paginatedForms.value[index];

  // Verifica se os campos obrigatórios estão preenchidos
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

    // Substitui o formulário atual na lista
    forms.value.splice((currentPage.value - 1) * formsPerPage + index, 1, {
      ...savedForm,
      salvo: true,
    });

    // Adiciona um novo formulário vazio
    forms.value.push({ ...emptyForm });

    // Notificação de sucesso
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Salvo com sucesso',
    });

    // Atualiza os QTCs após salvar
    await fetchQtcs();
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao salvar QTC',
    });
  }
};

const onReset = async (index) => {
  try {
    const form = forms.value[index];
    if (form.id) {
      console.log('Tentando arquivar QTC com ID:', form.id);
      await QtcInforService.archiveQtcInfo(form.id);
      forms.value.splice(index, 1); // Remove o formulário arquivado
    }

    // Adiciona um novo formulário vazio
    if (!forms.value.some((f) => !f.salvo)) {
      forms.value.push({ ...emptyForm });
    }

    // Atualiza os QTCs após arquivar
    await fetchQtcs();

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'QTC arquivada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao arquivar QTC:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao arquivar QTC',
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
