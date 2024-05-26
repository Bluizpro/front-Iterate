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
          class="col-1"
        >
        </q-input>
        <q-input
          disable
          readonly
          name="Hora"
          outlined
          v-model="qtcInfor.hora"
          color="indigo-13"
          label="Hora"
          class="col-1"
        >
        </q-input>
        <q-input
          outlined
          v-model="qtcInfor.conjunto"
          label="Conjunto"
          class="col-1"
        />
        <q-input
          disable
          name="Usuario"
          outlined
          v-model="qtcInfor.usuario"
          color="indigo-13"
          label="Nome do usuário"
          class="col-1 usuario"
        >
        </q-input>
        <q-input
          outlined
          v-model="qtcInfor.prestador"
          label=" Prestador"
          color="indigo-13"
          class="col-2 prestador"
        />
        <q-input
          outlined
          v-model="qtcInfor.informacoes"
          label="Informações"
          class="col"
        >
          <template v-slot:append>
            <q-icon name="info">
              <q-tooltip>
                <div class="custom-tooltip">
                  {{ qtcInfor.informacoes }}
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

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUpdated } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const formsPerPage = 5;
const currentPage = ref(1);
const forms = ref(
  JSON.parse(localStorage.getItem('qtcInfors')) || [
    {
      data: new Date().toLocaleDateString(), // Retorna a data no formato "dd/mm/yyyy"
      hora: new Date().toLocaleTimeString(), // Retorna a hora no formato "hh:mm:ss"
      usuario: localStorage.getItem('usuarioLogado') || '',
      prestador: '',
      informacoes: '',
      conjunto: '',
      salvo: false, // Adicione esta linha
    },
  ]
);

watch(
  forms,
  () => {
    localStorage.setItem('qtcInfors', JSON.stringify(forms.value));
  },
  { deep: true }
);

watch(
  forms,
  (newForms, oldForms) => {
    if (newForms.length > oldForms.length) {
      const lastIndex = newForms.length - 1;
      newForms[lastIndex].data = new Date().toLocaleDateString();
      newForms[lastIndex].hora = new Date().toLocaleTimeString();
    }
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
  const start = (currentPage.value - 1) * formsPerPage;
  const end = Math.min(start + formsPerPage, forms.value.length);
  for (let i = start; i < end; i++) {
    if (!forms.value[i].salvo) {
      forms.value[i].data = new Date().toLocaleDateString();
      forms.value[i].hora = new Date().toLocaleTimeString();
    }
  }
}

const onSubmit = (index) => {
  if (
    forms.value[index].usuario === '' ||
    forms.value[index].prestador === '' ||
    forms.value[index].informacoes === '' ||
    forms.value[index].conjunto === ''
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
      usuario: localStorage.getItem('usuarioLogado') || '',
      prestador: '',
      informacoes: '',
      conjunto: '',
      salvo: false, // Adicione esta linha
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
  if (forms.value.length > 1) {
    forms.value.splice(index, 1);
  } else {
    forms.value[index].prestador = '';
    forms.value[index].informacoes = '';
    forms.value[index].conjunto = '';
    forms.value[index].salvo = false; // Adicione esta linha
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
.paginação {
  margin-top: 2rem;
}
.custom-tooltip {
  font-size: 1.5em; /* Ajuste este valor para o tamanho desejado */
}
</style>
