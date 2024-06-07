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
            <img src="../assets/logo6.jpeg" />
          </q-avatar>
          <span class="title-text">ITERATE TECNOLOGIA AVANÇADA</span>
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
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue';
import PainelInterSedex from 'src/components/PainelInterSedex.vue';
import AvatarUser from 'src/components/AvatarUser.vue';
import MenuTree from 'src/components/MenuTree.vue';
import { onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();

const linksList = ref([
  {
    title: 'Anotacões',
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
    title: 'Lista de Correspondencia',
    icon: 'format_list_bulleted',
    link: 'listaCorrespondencia',
  },
  {
    title: 'QTC',
    icon: 'feedback',
    link: 'qtc',
  },
  {
    title: 'Ocorrencia',
    icon: 'warning',
    link: 'ocorrencia',
  },
  {
    title: 'Leitura de Água',
    icon: 'water',
    link: 'agua',
  },

  {
    title: 'Relatorio',
    icon: 'assignment',
    link: 'relatorio',
  },
  {
    title: 'Craviculario',
    icon: '_keys',
    link: 'craviculario',
  },
  {
    title: 'Saida',
    icon: 'logout',
    link: 'logout',
  },
]);

const essentialLinks = linksList;
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

let timer: NodeJS.Timeout | null = null;

onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    $q.loading.hide();
  }
});

const showLoading = () => {
  $q.loading.show();
};
const hideLoading = () => {
  $q.loading.hide();
};

const logout = () => {
  router.push({ path: '/' });
};
const handleLinkClick = async (link: { link: string }) => {
  if (link.link === 'logout') {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    hideLoading();

    logout();
  } else {
    console.log('erro');
  }
};
</script>
<style scoped>
.title-text {
  font-size: 14px;
  font-weight: bold;
  color: #c0c0c4;
  margin-left: 5px;
}
.q-header,
.q-toolbar {
  background-color: #0905e6 !important;
}
</style>
