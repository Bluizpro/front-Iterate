<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Relatorios</h1>
    <div class="card-outer">
      <div class="card-container">
        <div class="card">
          <div class="card-body">
            <h1 style="font-size: 1.5em; text-align: center">
              Relatório de Chaves Devolvidas
            </h1>
            <img
              class="report-image"
              src="../assets/chave1.png"
              alt="Imagem do relatório de chaves devolvidas"
            />
            <button
              @click="gerarPDF('chavesDevolvidas')"
              class="btn btn-primary"
            >
              Gerar PDF Chaves
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h1 style="font-size: 1.5em; text-align: center">
              Relatório de Encomendas
            </h1>
            <img
              class="report-image"
              src="../assets/encomenda.png"
              alt="Imagem do relatório de encomendas"
            />
            <button @click="gerarPDF('encomendas')" class="btn btn-primary">
              Gerar PDF Encomendas
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import jsPDF from 'jspdf';

const gerarPDF = (tipo) => {
  let pdf = new jsPDF();

  if (tipo === 'chavesDevolvidas') {
    // Recupera as chaves devolvidas do armazenamento local
    const chavesDevolvidasFromStorage =
      localStorage.getItem('chavesDevolvidas');
    let chavesDevolvidas = [];

    if (chavesDevolvidasFromStorage) {
      chavesDevolvidas = JSON.parse(chavesDevolvidasFromStorage);
    }

    // Adicione o conteúdo do relatório aqui
    chavesDevolvidas.forEach((chave, index) => {
      // Verifica se a posição base ultrapassa o limite da página
      let basePosition = 10 + (index % 4) * 70; // Ajusta a posição base para cada chave
      if (index % 4 === 0 && index !== 0) {
        pdf.addPage(); // Adiciona uma nova página
      }

      // Adiciona as informações da chave ao PDF
      pdf.setFontSize(8); // Diminui o tamanho da fonte
      pdf.text(`Chave ${index + 1}:`, 10, basePosition);
      pdf.text(`Conjunto: ${chave.conjunto}`, 10, basePosition + 10);
      pdf.text(`Data: ${chave.data}`, 10, basePosition + 20);
      pdf.text(`Hora: ${chave.hora}`, 10, basePosition + 30);
      pdf.text(`Usuário: ${chave.usuario}`, 10, basePosition + 40);
      pdf.text(
        `Usuário Devolução: ${chave.usuarioDevolucao}`,
        10,
        basePosition + 50
      );
      pdf.text(`Assinatura: ${chave.assinatura}`, 10, basePosition + 60); // Adiciona a assinatura

      // Desenha uma linha para dividir as seções
      if ((index + 1) % 4 !== 0 && index < chavesDevolvidas.length - 1) {
        pdf.line(10, basePosition + 65, 200, basePosition + 65); // (x1, y1, x2, y2)
      }
    });

    pdf.save('Relatorio_Chaves_Devolvidas.pdf');
  } else if (tipo === 'encomendas') {
    pdf.setFontSize(16); // Aumenta o tamanho da fonte
    pdf.text('Encomendas', 10, 10); // Adiciona um título ao PDF

    pdf.save('Relatorio_Encomendas.pdf');
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-around; /* Ajusta o espaçamento entre os cards */
  margin-top: 20px; /* Adiciona uma margem no topo para descer os cards */
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%; /* Ajuste este valor para alterar a largura dos cards */
  background-color: #e9e8e8; /* Adiciona um fundo cinza */
  border-radius: 15px; /* Adiciona uma borda arredondada */
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.report-image {
  width: 50%;
}

.btn {
  border-radius: 6px;
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: #e3e3e9;
}
</style>
