<template>
  <div class="bg">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: 'SpinnerComponente',
};
</script>

<style scoped>
.bg {
  /* Fixando o spinner na tela */
  position: fixed; /* Fixa o spinner na tela */
  top: 0;
  left: 0;
  width: 100vw; /* Ocupa toda a largura da tela */
  height: 100vh; /* Ocupa toda a altura da tela */
  background-color: rgba(0, 0, 0, 0.5); /* Fundo transparente com leve sombra */
  display: flex;
  justify-content: center; /* Centraliza o spinner horizontalmente */
  align-items: center; /* Centraliza o spinner verticalmente */
  z-index: 9999; /* Garante que o spinner fique sobre outros elementos */
}

.loader {
  width: 60px;
  height: 60px; /* Ajustado para ter tamanho uniforme */
  position: relative;
  display: inline-block;
  background-color: transparent; /* Fundo transparente */
}

.loader::before {
  content: '';
  left: 0;
  top: 0;
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: transparent; /* Fundo transparente */
  background-image: radial-gradient(
      circle 8px at 18px 18px,
      #fff 100%,
      transparent 0
    ),
    radial-gradient(circle 4px at 18px 0px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 0px 18px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 36px 18px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 18px 36px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 30px 5px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 30px 5px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 30px 30px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 5px 30px, #fff 100%, transparent 0),
    radial-gradient(circle 4px at 5px 5px, #fff 100%, transparent 0);
  background-repeat: no-repeat;
  box-sizing: border-box;
  animation: rotationBack 3s linear infinite;
}

.loader::after {
  content: '';
  left: 35px;
  top: 15px;
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: transparent; /* Fundo transparente */
  background-image: radial-gradient(
      circle 5px at 12px 12px,
      #fff 100%,
      transparent 0
    ),
    radial-gradient(circle 2.5px at 12px 0px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 0px 12px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 24px 12px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 12px 24px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 20px 3px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 20px 3px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 20px 20px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 3px 20px, #fff 100%, transparent 0),
    radial-gradient(circle 2.5px at 3px 3px, #fff 100%, transparent 0);
  background-repeat: no-repeat;
  box-sizing: border-box;
  animation: rotationBack 4s linear infinite reverse;
}

@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>
