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

        <GeraAssinatura
          :exibirModal="exibirModalAssinatura"
          @update:exibirModal="exibirModalAssinatura = $event"
          @salvarAssinatura="salvarAssinatura"
        />
        <q-btn
          label="Registrar"
          rounded
          color="indigo-14"
          v-on:click="gerarAssinatura"
        />
        <q-btn label="Volta" rounded color="indigo-14" v-on:click="voltar" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // Importe o useRoute
import { useRetiradaChaveStore } from '../../stores/retirada-chave';
import GeraAssinatura from '../../components/GeraAssinatura.vue'; // Importação do componente

const store = useRetiradaChaveStore();
const router = useRouter();
const route = useRoute(); // Crie uma instância da rota
const chave = ref({
  conjunto: Array.isArray(route.params.key)
    ? route.params.key[0]
    : route.params.key,
  data: new Date().toLocaleDateString(),
  hora: new Date().toLocaleTimeString(),
  usuario: '',
  assinatura: '',
  disponivel: true, // Adicione este campo
});
const exibirModalAssinatura = ref(false);

const voltar = () => {
  router.push('/usuario/Craviculario');
};

const gerarAssinatura = () => {
  exibirModalAssinatura.value = true;
};
const salvarAssinatura = (assinatura: unknown) => {
  if (typeof assinatura === 'string') {
    chave.value.assinatura = assinatura;

    // Mova a lógica de salvar as informações para aqui
    console.log('salvou aqui');
    let item = localStorage.getItem('chavesRetiradas');

    let chavesRetiradas = item ? JSON.parse(item) : [];
    chavesRetiradas.push(chave.value);
    localStorage.setItem('chavesRetiradas', JSON.stringify(chavesRetiradas));

    chave.value.disponivel = false;
    store.retirarChave({ ...chave.value }); // Desembrulhe o valor da referência aqui
  } else {
    voltar();
  }
  exibirModalAssinatura.value = false;
  let item = localStorage.getItem('chavesRetiradas');
  let chavesRetiradas = item ? JSON.parse(item) : [];
  chavesRetiradas.push(chave.value);
  localStorage.setItem('chavesRetiradas', JSON.stringify(chavesRetiradas));
};

onMounted(() => {
  let keyNumber = localStorage.getItem('keyNumber');
  if (keyNumber !== null) {
    chave.value.conjunto = keyNumber; // Não converta para um número
  }

  let keyRetirada = localStorage.getItem('keyRetirada');
  if (keyRetirada !== null) {
    chave.value = JSON.parse(keyRetirada);
  }
});
</script>
