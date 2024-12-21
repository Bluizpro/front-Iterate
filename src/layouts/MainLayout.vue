<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-indigo-14 text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/Tekoha1.jpg" />
          </q-avatar>
          <span class="title-text">GESTOR DE ENCOMENDA</span>
        </q-toolbar-title>
        <!-- Painel -->
        <PainelInterSedex />
        <!-- Avatar com Nome -->
        <AvatarUser />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <q-list>
        <q-item-label header> Menu </q-item-label>
        <MenuTree />
        <EssentialLink
          v-for="(link, idx) in essentialLinks"
          :key="idx"
          v-bind="link"
          @click="handleLinkClick(link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <!-- Spinner -->
      <SpinnerComponente v-if="isLoading" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue';
import PainelInterSedex from 'src/components/PainelInterSedex.vue';
import AvatarUser from 'src/components/AvatarUser.vue';
import MenuTree from 'src/components/MenuTree.vue';
import { useQuasar } from 'quasar';
import SpinnerComponente from 'src/components/SpinnerComponente.vue'; // Importe o componente

const $q = useQuasar();
const router = useRouter();

const linksList = ref([
  {
    title: 'Painel',
    icon: 'dashboard',
    link: 'painelEncomenda',
  },
  {
    title: 'Anotações',
    icon: 'note_add',
    link: 'anotacao',
  },
  {
    title: 'Lista de Andares',
    icon: 'format_list_bulleted',
    link: 'listaDeAndares',
  },
  {
    title: 'Lista de Visitante',
    icon: 'format_list_bulleted',
    link: 'listaDeVisitante',
  },
  {
    title: 'Correspondência Externa',
    icon: 'format_list_bulleted',
    link: 'listaCorrespondencia',
  },
  {
    title: 'Lista de Funcionário',
    icon: 'format_list_bulleted',
    link: 'listaFuncionario',
  },
  {
    title: 'QTC',
    icon: 'feedback',
    link: 'qtc',
  },
  {
    title: 'Ocorrência',
    icon: 'warning',
    link: 'ocorrencia',
  },
  {
    title: 'Leitura de Água',
    icon: 'water',
    link: 'agua',
  },
  {
    title: 'Craviculário',
    icon: '_keys',
    link: 'craviculario',
  },
  {
    title: 'Relatório',
    icon: 'assignment',
    link: 'relatorio',
  },
  {
    title: 'Saída',
    icon: 'logout',
    link: 'logout',
  },
]);

const essentialLinks = linksList;
const leftDrawerOpen = ref(false);
const isLoading = ref(false); // Controle de estado para o spinner

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const showLoading = () => {
  isLoading.value = true; // Mostra o spinner
};

const hideLoading = () => {
  isLoading.value = false; // Esconde o spinner
  $q.loading.hide();
};

const logout = () => {
  router.push({ path: '/' });
};

const handleLinkClick = async (link: { link: string }) => {
  if (link.link === 'logout') {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula o tempo de logout
    hideLoading();
    logout();
  } else {
    console.log('Erro ao processar link');
  }
};

// Timeout de inatividade
let inactivityTimer: NodeJS.Timeout | null = null;
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos em milissegundos

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    showLoading();
    logout();
  }, INACTIVITY_LIMIT);
};

const startInactivityTimer = () => {
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('keydown', resetInactivityTimer);
  window.addEventListener('click', resetInactivityTimer);
  resetInactivityTimer(); // Inicializa o timer
};

const stopInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  window.removeEventListener('mousemove', resetInactivityTimer);
  window.removeEventListener('keydown', resetInactivityTimer);
  window.removeEventListener('click', resetInactivityTimer);
};

onMounted(() => {
  startInactivityTimer();
});

onBeforeUnmount(() => {
  stopInactivityTimer();
});
</script>

<style scoped>
.title-text {
  font-size: 14px;
  font-weight: bold;
  color: #9898e0;
  margin-left: 10px;
}
.q-header,
.q-toolbar {
  background-color: #0905e6 !important;
}
</style>
