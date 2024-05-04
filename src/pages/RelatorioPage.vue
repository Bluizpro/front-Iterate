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
import jsPDF from 'jspdf';

const gerarPDF = (tipo) => {
  let pdf = new jsPDF();

  if (tipo === 'chavesDevolvidas') {
    const chavesDevolvidasFromStorage =
      localStorage.getItem('chavesDevolvidas');
    let chavesDevolvidas = [];

    if (chavesDevolvidasFromStorage) {
      chavesDevolvidas = JSON.parse(chavesDevolvidasFromStorage);
    }

    if (chavesDevolvidas.length === 0) {
      pdf.text('Nenhuma chave devolvida', 10, 10);
    } else {
      chavesDevolvidas.forEach((chave, index) => {
        let basePosition = 10 + (index % 4) * 70;
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage();
        }

        pdf.setFontSize(8);
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
        pdf.text(`Assinatura: ${chave.assinatura}`, 10, basePosition + 60);

        if ((index + 1) % 4 !== 0 && index < chavesDevolvidas.length - 1) {
          pdf.line(10, basePosition + 65, 200, basePosition + 65);
        }
      });
    }
    pdf.save('Relatorio_Chaves_Devolvidas.pdf');
  }
  if (tipo === 'encomendas') {
    const encomendasBaixadasFromStorage =
      localStorage.getItem('encomendasBaixadas');
    let encomendasBaixadas = [];

    if (encomendasBaixadasFromStorage) {
      encomendasBaixadas = JSON.parse(encomendasBaixadasFromStorage);
    }

    if (encomendasBaixadas.length === 0) {
      pdf.text('Nenhuma encomenda retirada', 10, 10);
    } else {
      pdf.setFontSize(16);
      pdf.text('Encomendas', 10, 10);

      encomendasBaixadas.forEach((encomenda, index) => {
        let basePosition = 20 + (index % 4) * 70;
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage();
        }

        pdf.setFontSize(8);
        pdf.text(`Encomenda ${index + 1}:`, 10, basePosition);
        pdf.text(`Data: ${encomenda.data}`, 10, basePosition + 10);
        pdf.text(`Hora: ${encomenda.hora}`, 10, basePosition + 20);
        pdf.text(
          `Destinatario: ${encomenda.destinatario}`,
          10,
          basePosition + 30
        );
        pdf.text(`Conteudo: ${encomenda.conteudo}`, 10, basePosition + 40);
        pdf.text(`Tipo: ${encomenda.tipo}`, 10, basePosition + 50);

        if ((index + 1) % 4 !== 0 && index < encomendasBaixadas.length - 1) {
          pdf.line(10, basePosition + 55, 200, basePosition + 55);
        }
      });
    }
    pdf.save('Relatorio_Encomendas.pdf');
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  background-color: #ffffff;
  border-radius: 15px;
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
}
</style>
