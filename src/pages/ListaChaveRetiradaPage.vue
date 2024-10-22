<template>
  <div class="border">
    <q-page>
      <h1 style="font-size: 1.5em; text-align: center">
        Lista de Chaves Retiradas
      </h1>

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
      </div>

      <!-- Verifica se não há chaves cadastradas -->
      <div v-if="!chavesRetiradas.length" class="no-chaves-message">
        <p style="text-align: center; font-size: 1.2em">
          Nenhuma chave cadastrada.
        </p>
      </div>

      <div class="row items-wcenter justify-evenly">
        <div class="q-gutter-md col-md-10 col-sm-10 col-xs-12">
          <!-- Main Container -->
          <div class="main-container">
            <!-- Cards Container -->
            <div class="container">
              <div class="row">
                <q-card
                  v-for="(chave, index) in paginatedChaves"
                  :key="index"
                  class="my-card col-3"
                  :class="{ selected: chave.selected }"
                  @click="handleClick(chave)"
                >
                  <q-card-section class="card-section">
                    <div>Conjunto: {{ chave.conjunto }}</div>
                    <div>Data: {{ chave.data }}</div>
                    <div>Hora: {{ chave.hora }}</div>
                    <div>Usuário: {{ chave.usuario }}</div>
                    <img :src="chave.assinatura" alt="Assinatura do usuário" />
                  </q-card-section>
                </q-card>
              </div>

              <div v-if="search.value && !filteredChaves.length">
                Chave não retirada
              </div>
            </div>

            <div class="q-pa-lg flex flex-center">
              <q-pagination
                v-model="currentPage"
                :max="Math.ceil(filteredChaves.length / itemsPerPage)"
              />
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const chavesRetiradas = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(3);
const selectedChave = ref(null);
let message = ref('');
const search = ref(''); // Adiciona uma ref para a pesquisa
provide('selectedChave', selectedChave);

// Adiciona uma computed property para filtrar as chaves com base na pesquisa
const filteredChaves = computed(() => {
  if (search.value) {
    return chavesRetiradas.value.filter(
      (chave) =>
        chave.conjunto && chave.conjunto.toString().includes(search.value)
    );
  }
  return chavesRetiradas.value;
});

const paginatedChaves = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredChaves.value.slice(start, end); // Usa filteredChaves em vez de chavesRetiradas
});

const handleClick = (chave) => {
  chave.status = 'disponível';
  chave.selected = !chave.selected;
  selectedChave.value = chave;
  router.push({ name: 'BaixaChave', params: { conjunto: chave.conjunto } });
};

onMounted(() => {
  const chavesRetiradasFromStorage = localStorage.getItem('chavesRetiradas');
  if (chavesRetiradasFromStorage) {
    chavesRetiradas.value = JSON.parse(chavesRetiradasFromStorage);
  }
});
watch(search, () => {
  if (search.value && filteredChaves.value.length === 0) {
    message.value = 'Chave não Retirada';
  } else {
    message.value = '';
  }
});
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

.my-card {
  margin: 20px;
  cursor: pointer;
  border-radius: 15px;
  border: 2px solid black;
}

.my-card.selected {
  background-color: #84a0f5;
}

.q-pa-lg.flex.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.my-card {
  transition: background-color 0.3s ease;
}

.selected {
  background-color: rgb(19, 59, 241);
}

.my-card.disabled {
  background-color: red;
}
.card-section img {
  max-width: 100%; /* A imagem não pode ser maior que o contêiner */
  max-height: 150px; /* Limite a altura da imagem conforme necessário */
  object-fit: contain; /* Mantém a proporção da imagem */
  display: block; /* Remove espaço em branco abaixo da imagem */
  margin-top: 10px; /* Adiciona um espaço acima da imagem, se necessário */
}
</style>
