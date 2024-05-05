<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Retirada De Chave</h1>
    <div class="row items-center justify-evenly">
      <q-form
        @submit.prevent="gerarAssinatura"
        class="q-gutter-md col-md-10 col-sm-10 col-xs-12"
      >
        <q-input
          disable
          readonly
          name="Data"
          outlined
          v-model="chave.data"
          color="indigo-13"
          label="Data"
        >
          <template v-slot:prepend>
            <q-icon name="date_range" />
          </template>
        </q-input>
        <q-input
          disable
          name="Hora"
          outlined
          v-model="chave.hora"
          color="indigo-13"
          label="Hora"
        >
          <template v-slot:prepend>
            <q-icon name="access_time" />
          </template>
        </q-input>
        <q-input
          disable
          name="ChaveSelecionada"
          outlined
          readonly
          v-model="chave.conjunto"
          color="indigo-13"
          label="Chave Selecionada"
        >
          <div v-if="chave.conjunto"></div>
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
        </q-input>
        <q-input
          required
          disable
          name="Usuario"
          outlined
          clearable
          clear-icon="close"
          v-model="chave.usuario"
          color="indigo-13"
          label="Nome do usuário"
          :rules="[
            (val) => (val && val.length > 0) || 'Digite o nome do usuário',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          required
          name="Usuario-devoluçao"
          outlined
          clearable
          clear-icon="close"
          v-model="chave.usuarioDevolucao"
          color="indigo-13"
          label="Nome do usuário Devolução Chave"
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Digite o Nome De quem esta Devolvendo a Chave ',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <GeraAssinatura
          :exibirModal="exibirModalAssinatura"
          @update:exibirModal="exibirModalAssinatura = $event"
          @salvarAssinatura="salvarAssinatura"
        /><q-btn label="Volta" rounded color="indigo-14" v-on:click="voltar" />
        <q-btn
          label="Devolver Chave"
          rounded
          color="indigo-14"
          v-on:click="devolverChave"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GeraAssinatura from 'src/components/GeraAssinatura.vue';

const router = useRouter();
const route = useRoute();
const chave = ref({
  conjunto: '',
  data: '',
  hora: '',
  usuario: '',
  dataDevolucao: '', // novo campo para data de devolução
  horaDevolucao: '', // novo campo para hora de devolução
  usuarioDevolucao: '',
  assinatura: '',
});
const exibirModalAssinatura = ref(false);
const chavesRetiradas = ref([]);

const atualizarDataHora = () => {
  chave.value.data = new Date().toLocaleDateString();
  chave.value.hora = new Date().toLocaleTimeString();
};

const voltar = () => {
  router.push('/usuario/lista-chave');
};

const gerarAssinatura = () => {
  exibirModalAssinatura.value = true;
};

const devolverChave = () => {
  chave.value.dataDevolucao = new Date().toLocaleDateString(); // atualiza a data de devolução
  chave.value.horaDevolucao = new Date().toLocaleTimeString(); // atualiza a hora de devolução
  exibirModalAssinatura.value = true;
};

const salvarAssinatura = (assinatura) => {
  chave.value.assinatura = assinatura;
  exibirModalAssinatura.value = false;

  const index = chavesRetiradas.value.findIndex(
    (chave) => String(chave.conjunto) === String(route.params.conjunto)
  );
  if (index !== -1) {
    const chaveDevolvida = chavesRetiradas.value.splice(index, 1)[0];
    chaveDevolvida.assinatura = assinatura;
    let chavesDevolvidas =
      JSON.parse(localStorage.getItem('chavesDevolvidas')) || [];
    chavesDevolvidas.push(chaveDevolvida);
    localStorage.setItem('chavesDevolvidas', JSON.stringify(chavesDevolvidas));
    localStorage.setItem(
      'chavesRetiradas',
      JSON.stringify(chavesRetiradas.value)
    );
  }

  voltar();
};

onMounted(() => {
  const conjunto = route.params.conjunto;
  const chavesRetiradasFromStorage = localStorage.getItem('chavesRetiradas');
  if (chavesRetiradasFromStorage) {
    chavesRetiradas.value = JSON.parse(chavesRetiradasFromStorage);
  }

  if (conjunto) {
    const chaveRetirada = chavesRetiradas.value.find(
      (chave) => String(chave.conjunto) === String(conjunto)
    );

    if (chaveRetirada) {
      chave.value = chaveRetirada;
    }
  }

  atualizarDataHora();
});
</script>
