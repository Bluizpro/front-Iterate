<template>
  <q-page
    class="row items-center justify-evenly back"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <Spinner v-if="isLoading" />
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
          :rules="[ (val:string) => formSubmitted || val.length > 0 || 'Campo Obrigatório', (val:string) => formSubmitted || val.length > 4 || 'Mínimo de 5 caracteres' ]"
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
        <button @click="onSubmit">Login</button>

        <!-- Exibir o Spinner de Carregamento -->
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { usuarioStore } from '../stores/example-store';
import Spinner from '../components/SpinnerComponente.vue'; // Importando o componente Spinner

const store = usuarioStore();
const $q = useQuasar();
const $router = useRouter();

const isPwd = ref(true);
const isDarkMode = ref(false);
const formSubmitted = ref(false);
const isLoading = ref(false); // Controle do estado de carregamento

const showLoading = () => {
  isLoading.value = true;
};

const hideLoading = () => {
  isLoading.value = false;
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
  }

  formSubmitted.value = true;
};

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
  font-family: 'Arial', sans-serif;
}

.back {
  background-image: url('https://www.cecadi.com.br/cdn/shop/articles/paisagem_4_1170x.jpg?v=1585840672');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
}

.card-login {
  opacity: 0.9;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 350px;
}

.card-login:hover {
  opacity: 1;
  transform: translateY(-5px);
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
}

.logo {
  max-width: 120px;
  margin: 10px auto 20px auto;
  display: block;
}

.centered-text {
  font-size: 16px;
  font-weight: bold;
  color: #3f51b5;
  margin-bottom: 20px;
}

.q-input {
  width: 100%;
  padding: 21px 15px;
  margin: 15px 0;
  border: 2px solid transparent;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  margin: 15px 0;
  border: 2px solid transparent;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.q-input:focus {
  border: 2px solid #3f51b5;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(63, 81, 181, 0.4);
  outline: none;
}

/* Novo estilo para o botão customizado */
button {
  width: 9em;
  height: 3em;
  border-radius: 30em;
  font-size: 15px;
  font-family: inherit;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
}

button::before {
  content: '';
  width: 0;
  height: 3em;
  border-radius: 30em;
  position: absolute;
  top: 0;
  left: 0;
  background-image: linear-gradient(to right, #0fd850 0%, #f9f047 100%);
  transition: 0.5s ease;
  display: block;
  z-index: -1;
}

button:hover::before {
  width: 9em;
}

button:hover {
  cursor: pointer;
}
</style>
