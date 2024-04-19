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
          Iterate
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

    <!--<q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/logoIterate.png" />
          </q-avatar>
          <div>Iterate</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>-->
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
    title: 'Lista de Andares',
    icon: 'format_list_bulleted',
    link: 'listaDeAndares',
  },
  {
    title: 'Pesquisar',
    icon: 'search',
    link: 'pesquisa',
  },
  {
    title: 'Leitura de Agua',
    icon: 'waves',
    link: 'agua',
  },
  {
    title: 'Anotações',
    icon: 'note',
    link: 'anotacao',
  },
  {
    title: 'Relatorio',
    icon: 'description',
    link: 'relatorio',
  },
  {
    title: 'Craviculario',
    icon: 'key',
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
