<!-- <template>
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
          class="col-1"
        >
        </q-input>
        <q-input
          disable
          readonly
          name="Hora"
          outlined
          v-model="anotacao.hora"
          color="indigo-13"
          label="Hora"
          class="col-1"
        >
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

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, onUpdated } from 'vue';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';

const $q = useQuasar();
const formsPerPage = 5;
const currentPage = ref(1);
const usuarioLogado = localStorage.getItem('usuarioLogado') ?? '';
const forms = ref(
  JSON.parse(localStorage.getItem('anotacoes') ?? '[]') || [
    {
      data: dayjs().format('DD/MM/YYYY'),
      hora: dayjs().format('HH:mm:ss'),
      usuario: usuarioLogado,
      conjunto: '',
      paciente: '',
      info: '',
      salvo: false,
    },
  ]
);
const infoOptions = ['AG/2T', 'PS', 'PS/+1T', 'AG', 'AG/CF', 'AG/CM'];

const colorClass = (info: unknown) => {
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
let intervalId: ReturnType<typeof setInterval>;

watch(
  forms,
  () => {
    localStorage.setItem('anotacoes', JSON.stringify(forms.value));
  },
  { deep: true }
);

const maxPages = computed(() => Math.ceil(forms.value.length / formsPerPage));

const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * formsPerPage;
  const end = start + formsPerPage;
  return forms.value.slice(start, end);
});

onMounted(updateDateTime);
onUpdated(updateDateTime);

function updateDateTime() {
  const currentDateTime = dayjs();

  for (let i = 0; i < forms.value.length; i++) {
    if (!forms.value[i].salvo) {
      forms.value[i].data = currentDateTime.format('DD/MM/YYYY');
      forms.value[i].hora = currentDateTime.format('HH:mm:ss');
    }
  }
}

onMounted(() => {
  updateDateTime();
  intervalId = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
const onSubmit = (index: string | number) => {
  if (
    forms.value[index].usuario === '' ||
    forms.value[index].paciente === '' ||
    forms.value[index].conjunto === '' ||
    forms.value[index].info === ''
  ) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Por favor, preencha todos os campos',
    });
  } else {
    forms.value[index].salvo = true; // Adicione esta linha
    forms.value.push({
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      usuario: usuarioLogado,
      conjunto: '',
      paciente: '',
      info: '',
      salvo: false,
    });

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Salvo Com Sucesso',
    });
  }
};

const onReset = (index: string | number) => {
  if (forms.value.length > 1) {
    forms.value.splice(index, 1);
  } else {
    forms.value[index].paciente = '';
    forms.value[index].conjunto = '';
    forms.value[index].info = '';
    forms.value[index].salvo = false;
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
  border: 1px solid #ccc;
  border-radius: 10px; // Ajuste este valor para alterar a curvatura da borda
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
  margin-left: 5px !important;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
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
 -->

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
          class="col-1 usuario"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          outlined
          v-model="anotacao.paciente"
          label="Paciente"
          color="indigo-13"
          class="col-2 paciente"
        />
        <q-select
          outlined
          v-model="anotacao.info"
          :options="infoOptions"
          label="Informações"
          :class="colorClass(anotacao.info)"
          class="col"
        />
        <!--     <q-select
          outlined
          v-model="anotacao.status"
          :options="statusOptions"
          label="Status "
          class="col"
        /> -->

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

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const formsPerPage = 5;
const currentPage = ref(1);
const forms = ref(
  JSON.parse(localStorage.getItem('anotacoes')) || [
    {
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      usuario: localStorage.getItem('usuarioLogado') || '',
      paciente: '',
      status: '',
      info: '',
    },
  ]
);
watch(
  forms,
  () => {
    localStorage.setItem('anotacoes', JSON.stringify(forms.value));
  },
  { deep: true }
);
const maxPages = computed(() => Math.ceil(forms.value.length / formsPerPage));
const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * formsPerPage;
  const end = start + formsPerPage;
  return forms.value.slice(start, end);
});
const onSubmit = (index) => {
  if (
    forms.value[index].usuario === '' ||
    forms.value[index].paciente === '' ||
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
  const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
  savedForms.push(forms.value[index]);
  localStorage.setItem('savedForms', JSON.stringify(savedForms));
  if (forms.value.length > 1) {
    forms.value.splice(index, 1);
  } else {
    forms.value[index].paciente = '';
    forms.value[index].status = '';
    forms.value[index].info = '';
  }
};
function updateDateTime() {
  const currentDateTime = dayjs();

  for (let i = 0; i < forms.value.length; i++) {
    if (!forms.value[i].salvo) {
      forms.value[i].data = currentDateTime.format('DD/MM/YYYY');
      forms.value[i].hora = currentDateTime.format('HH:mm:ss');
    }
  }
}
//const statusOptions = ['J/S', 'N/S'];
const infoOptions = ['AG/2T', 'PS', 'PS/+1T', 'AG', 'AG/CF', 'AG/CM'];
const colorClass = (info) => {
  switch (info) {
    case 'AG/2T':
      return 'yellow-background'; // Amarelo
    case 'AG':
      return 'red-background'; // Vermelho
    case 'AG/CM':
      return 'green-background'; // Verde
    case 'PS':
      return 'background'; // Branco
    case 'AG/CF':
      return 'orange-background'; // Laranja
    case 'PS/+1T':
      return 'blue-background'; // Azul-royal
    default:
      return ''; // Caso padrão (sem cor específica)
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
