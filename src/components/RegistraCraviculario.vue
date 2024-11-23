<template>
  <div class="border">
    <div class="search-container">
      <label for="search" class="search-label">Pesquisar:</label>
      <div class="search-input">
        <input
          id="search"
          type="text"
          v-model="search"
          aria-label="Campo de pesquisa"
        />
        <i class="material-icons search-icon" v-if="!search" aria-hidden="true"
          >search</i
        >
      </div>
    </div>
    <div class="cards-container">
      <div v-if="message" class="message">{{ message }}</div>
      <div
        class="key-container border"
        v-for="key in paginatedKeys"
        :key="key"
        @click="handleCardClick(key)"
        :class="{
          selected: selectedKey === key,
          disabled: !isKeyAvailableAndNotRegistered(key.toString()),
        }"
        tabindex="0"
        role="button"
      >
        <div>Chave {{ key }}</div>
        <i class="material-icons" style="font-size: 36px">key</i>
        <input
          type="checkbox"
          v-model="selectedKeys[key]"
          :checked="selectedKeys[key]"
          :style="{ backgroundColor: selectedKeys[key] ? '#ff0000' : '' }"
          aria-label="Selecionar chave"
        />
      </div>
    </div>
    <div class="pagination-container">
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
        @click="navigateToListaChave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useRetiradaChaveStore } from '../stores/retirada-chave';

const router = useRouter();
const retiradaChaveStore = useRetiradaChaveStore();

const keys = Array.from({ length: 128 }, (_, i) => i + 11).filter(
  (key) => ![0, 9].includes(key % 10)
);
const currentPage = ref(1);
const keysPerPage = 8;
const search = ref('');
let selectedKeys = ref({});
let message = ref('');
let selectedKey = ref(null);

const totalPages = computed(() =>
  Math.ceil(filteredKeys.value.length / keysPerPage)
);

const paginatedKeys = computed(() => {
  const start = (currentPage.value - 1) * keysPerPage;
  const end = start + keysPerPage;
  return filteredKeys.value.slice(start, end);
});

const filteredKeys = computed(() => {
  if (search.value) {
    return keys.filter((key) => key.toString().includes(search.value.trim()));
  }
  return keys;
});

watch(search, () => {
  message.value = filteredKeys.value.length ? '' : 'Chave não encontrada';
});

const isKeyRegistered = (key) => {
  const item = localStorage.getItem('chavesRetiradas');
  const chavesRetiradas = item ? JSON.parse(item) : [];
  return chavesRetiradas.some((chave) => chave.conjunto === key.toString());
};

const isKeyAvailableAndNotRegistered = (key) => {
  return (
    retiradaChaveStore.isKeyAvailable(key) && !isKeyRegistered(Number(key))
  );
};

const handleCardClick = (key) => {
  if (isKeyAvailableAndNotRegistered(key.toString())) {
    selectedKey.value = key;
    router.push({ name: 'RetiradaChaves', params: { key: key.toString() } });
  }
};

const navigateToListaChave = () => {
  router.push({ name: 'listaChave' });
};
</script>

<style scoped lang="scss">
.border {
  border: 1px solid #000;
  margin-left: 2rem;
  margin-right: 1rem;
  background-color: rgba(235, 208, 208, 0.2);
}

.search-container {
  display: flex;
  align-items: center;
  margin-top: 3rem;
}

.search-label {
  margin-right: 10px;
  margin-left: 2rem;
}

.search-input {
  position: relative;
  width: 8rem;
}

#search {
  width: 100%;
  height: 2rem;
  padding-left: 2rem;
  background-color: #d9d2d2;
  border: none;
  border-radius: 4px;
}

.search-icon {
  position: absolute;
  left: 3px;
  top: 7px;
  font-size: 23px;
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
  position: relative;
  transition: background-color 0.3s ease;
}

.key-container.disabled {
  background-color: #e25555;
  cursor: not-allowed;
}

.key-checkbox {
  margin-top: 0.5rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.button-container {
  padding: 10px;
  margin-left: 2rem;
}

.message {
  color: red;
  font-weight: bold;
  text-align: center;
}

@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }
  .key-container {
    width: 100%;
    height: auto;
  }
}
</style>
