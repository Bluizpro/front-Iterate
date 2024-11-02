<template>
  <q-page
    class="row items-center justify-evenly back"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <q-card
      class="row items-center justify-evenly col-md-3 col-sm-3 col-xs-12 card-login"
    >
      <q-form
        @submit.prevent="onSubmit"
        class="q-gutter-md q-py-lg q-px-lg col-md-12 col-sm-12 col-xs-12"
      >
        <div class="row items-center justify-evenly">
          <img src="../assets/tekoha_logo.svg" alt="Logo" class="logo" />
        </div>
        <span class="centered-text">TEKOHÁ CODE </span>
        <q-input
          required
          filled
          v-model="store.usuario"
          label="Login *"
          hint="Digite seu nome de usuário"
          lazy-rules
          :rules="[(val:string) => formSubmitted || val.length > 0 || 'Digite seu usuário']"
          class="input-hover"
        />
        <q-input
          required
          filled
          :type="isPwd ? 'password' : 'text'"
          v-model="store.senha"
          label="Senha *"
          clear-icon="close"
          :rules="[
            (val:string) => formSubmitted || val.length > 0 || 'Campo Obrigatório',
            (val:string) => formSubmitted || val.length > 4 || 'Mínimo de 5 caracteres',
          ]"
          class="input-hover"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrar"
            />
          </template>
        </q-input>

        <div class="row">
          <q-btn
            label="Enviar"
            type="submit"
            color="primary"
            class="col-md-12 col-sm-12 col-xs-12"
          />
        </div>
      </q-form>
    </q-card>

    <!-- Ícone de luz no canto superior direito -->
    <!-- <q-icon
      class="absolute-top-right q-ma-md cursor-pointer"
      :name="isDarkMode ? 'light_mode' : 'dark_mode'"
      color="primary"
      @click="toggleDarkMode"
    /> -->
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { onBeforeUnmount } from 'vue';
import { usuarioStore } from '../stores/example-store';

const store = usuarioStore();
const $q = useQuasar();
const $router = useRouter();

const isPwd = ref(true);
const isDarkMode = ref(false);
const formSubmitted = ref(false);

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

const mostrar = () => (isPwd.value = !isPwd.value);

const onSubmit = async () => {
  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const loginSucesso = await store.fazerLogin();

  hideLoading();

  if (loginSucesso) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Login bem-sucedido',
    });

    $router.push('/usuario');
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Credenciais inválidas ou aceite a licença e os termos',
    });
  }

  formSubmitted.value = true;
};

/* const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
}; */

// Recuperar o usuário logado do localStorage quando o componente é montado
onMounted(() => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    store.usuarioLogado = usuarioLogado;
  }
});
</script>

<style scoped lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.back {
  /* background-image: url('https://www.cecadi.com.br/cdn/shop/articles/paisagem_4_1170x.jpg?v=1585840672'); */
  background-image: url('https://www.cecadi.com.br/cdn/shop/articles/paisagem_4_1170x.jpg?v=1585840672');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh; /* Garantindo que o fundo cubra toda a tela */
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes opacity-in {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@keyframes opacity-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.4;
  }
}

.card-login {
  opacity: 0.4;
  animation-name: opacity-out;
  animation-duration: 2s;
  transition: opacity 2s ease-in-out;
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Um fundo semi-transparente no card */
  border-radius: 10px; /* Cantos arredondados */
}

.card-login:hover {
  opacity: 1;
  animation-name: opacity-in;
  animation-duration: 2s;
}

.logo {
  max-width: 150px;
  margin-bottom: 20px;
}

.centered-text {
  display: block;
  text-align: center;
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #5c6bc0;
}
</style>
