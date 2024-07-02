<template>
  <div class="border">
    <div class="search-container">
      <label
        style="font-size: 1.5em; text-align: center"
        for="search"
        class="search-label"
        >Pesquisar:</label
      >
      <div class="search-input">
        <input id="search" type="text" v-model="search" />
        <i class="material-icons search-icon" v-if="!search">search</i>
      </div>
    </div>
    <div class="cards-container">
      <div v-if="message">{{ message }}</div>
      <div
        class="key-container border"
        v-for="key in paginatedKeys"
        :key="key"
        @click="
          isKeyAvailableAndNotRegistered(key.toString())
            ? handleClick(key)
            : null
        "
        :class="{
          selected: selectedKey === key,
          disabled: !isKeyAvailableAndNotRegistered(key.toString()),
        }"
      >
        <div>Chave {{ key }}</div>
        <i class="material-icons" style="font-size: 36px">key</i>
        <input
          type="checkbox"
          v-model="selectedKeys[key]"
          :checked="!isKeyAvailableAndNotRegistered(key.toString())"
          :style="{ backgroundColor: selectedKeys[key] ? 'red' : '' }"
        />
      </div>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        direction-links
        boundary-links
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
      />
    </div>
    <div class="button-container">
      <q-btn
        label="Chaves Retiradas"
        rounded
        color="indigo-14"
        class="register-button"
        v-on:click="listachave()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useRetiradaChaveStore } from '../stores/retirada-chave';

const router = useRouter();
const retiradaChaveStore = useRetiradaChaveStore();

const keys = Array.from({ length: 128 }, (_, i) => i + 11).filter(
  (key) => ![0, 9].includes(key % 10)
);
const currentPage = ref(1);
const keysPerPage = 16;
const search = ref('');
let selectedKeys = ref<Record<number, boolean>>({});
let message = ref('');
let selectedKey = ref<number | null>(null);

const totalPages = computed(() => {
  return Math.ceil(filteredKeys.value.length / keysPerPage);
});

const paginatedKeys = computed(() => {
  const start = (currentPage.value - 1) * keysPerPage;
  const end = start + keysPerPage;
  return filteredKeys.value.slice(start, end);
});

const filteredKeys = computed(() => {
  if (search.value) {
    return keys.filter((key) => key.toString() === search.value.trim());
  }
  return keys;
});

watch(search, () => {
  if (search.value && filteredKeys.value.length === 0) {
    message.value = 'Chave não encontrada';
  } else {
    message.value = '';
  }
});

/* const isKeyRegistered = (key: number) => {
  let item = localStorage.getItem('chavesRetiradas');
  let chavesRetiradas = item ? JSON.parse(item) : [];
  return chavesRetiradas.some(
    (chave: any) => chave.conjunto === key.toString()
  );
}; */
const isKeyRegistered = (key: number) => {
  let item = localStorage.getItem('chavesRetiradas');
  let chavesRetiradas: { conjunto: string }[] = item ? JSON.parse(item) : [];
  return chavesRetiradas.some(
    (chave: { conjunto: string }) => chave.conjunto === key.toString()
  );
};

const isKeyAvailableAndNotRegistered = (key: string) => {
  return (
    retiradaChaveStore.isKeyAvailable(key) && !isKeyRegistered(Number(key))
  );
};

const handleClick = (key: number) => {
  selectedKey.value = key;
  router.push({ name: 'RetiradaChaves', params: { key: key.toString() } });
};

const listachave = () => {
  router.push({ name: 'listaChave' });
};
</script>

<style scoped lang="scss">
.border {
  border: 1px solid #000;
  margin-left: 2rem;
  margin-right: 1rem;
  background-color: rgb(235 208 208 / 20%);
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 3rem;
}

.search-label {
  margin-right: 10px;
  margin-left: 2rem;
}

.search-input {
  position: relative;
  width: 8rem;
  color: #000;
}

#search {
  width: 100%;
  height: 2rem;
  padding-left: 2rem;
  text-align: left;
  background-color: #d9d2d2;
}

.search-icon {
  position: absolute;
  left: 3px;
  top: 7px;
  font-size: 23px;
}

.search-container i {
  margin-left: 0rem;
}
.cards-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 2rem;
}

.key-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 4px;
  padding: 5px;
  border-radius: 1rem;
  width: 10rem;
  height: 5rem;
  cursor: pointer;
  position: relative; /* Para posicionar o checkbox */
}
.key-container.selected {
  background-color: rgb(19, 59, 241);
}

.checkbox {
  position: absolute;
  bottom: 5px; /* Ajuste conforme necessário */
  right: 5px; /* Ajuste conforme necessário */
}
.q-pa-lg.flex.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}
.button-container {
  padding: 10px; /* Ajuste o valor conforme necessário */
  margin-left: 2rem;
}
.key-container {
  transition: background-color 0.3s ease;
}
.selected {
  background-color: rgb(19, 59, 241);
}
.key-container.disabled {
  background-color: red; /* ou qualquer cor que você preferir */
}
</style>
