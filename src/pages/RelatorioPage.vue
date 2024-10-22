<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Relatórios</h1>
    <div class="border">
      <div class="card-outer">
        <div class="card-container">
          <!-- Relatório de Chaves Devolvidas -->
          <div class="card">
            <div class="card-body">
              <h1 style="font-size: 1.5em; text-align: center">
                Chaves Devolvidas
              </h1>
              <img
                class="report-image"
                src="../assets/keys.svg"
                alt="Imagem do relatório de chaves devolvidas"
              />
              <div class="button-container">
                <q-btn
                  @click="gerarPDF('chavesDevolvidas')"
                  label="Gerar PDF Chaves"
                  class="custom-btn pdf-btn"
                />
                <q-btn
                  @click="gerarExcel('chavesDevolvidas')"
                  label="Gerar Excel Chaves"
                  class="custom-btn excel-btn"
                />
              </div>
            </div>
          </div>

          <!-- Relatório de Encomendas -->
          <div class="card">
            <div class="card-body">
              <h1 style="font-size: 1.5em; text-align: center">
                Relatório de Encomendas
              </h1>
              <img
                class="report-image"
                src="../assets/encomenda.svg"
                alt="Imagem do relatório de encomendas"
              />
              <div class="button-container">
                <q-btn
                  @click="gerarPDF('encomendas')"
                  label="Gerar PDF Encomendas"
                  class="custom-btn pdf-btn"
                />
                <q-btn
                  @click="gerarExcel('encomendas')"
                  label="Gerar Excel Encomendas"
                  class="custom-btn excel-btn"
                />
              </div>
            </div>
          </div>

          <!-- Relatório de Leituras de Água -->
          <div class="card">
            <div class="card-body">
              <h1 style="font-size: 1.5em; text-align: center">
                Relatório de Leituras de Água
              </h1>
              <img
                class="report-image"
                src="../assets/agua.svg"
                alt="Imagem do relatório de leituras de água"
              />
              <div class="button-container">
                <q-btn
                  @click="gerarPDF('leiturasAgua')"
                  label="Gerar PDF Leituras"
                  class="custom-btn pdf-btn"
                />
                <q-btn
                  @click="gerarExcel('leiturasAgua')"
                  label="Gerar Excel Leituras"
                  class="custom-btn excel-btn"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h1 style="font-size: 1.5em; text-align: center">Qtc</h1>
              <img
                class="report-image"
                src="../assets/feedback.svg"
                alt="Imagem do relatório de qtc devolvidas"
              />
              <div class="button-container">
                <q-btn
                  @click="gerarPDF('qtc')"
                  label="Gerar PDF qtc"
                  class="custom-btn pdf-btn"
                />
                <q-btn
                  @click="gerarExcel('qtc')"
                  label="Gerar Excel qtc"
                  class="custom-btn excel-btn"
                />
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h1 style="font-size: 1.5em; text-align: center">Anotaçoes</h1>
              <img
                class="report-image"
                src="../assets/node_add.svg"
                alt="Imagem do relatório de anotacoes devolvidas"
              />
              <div class="button-container">
                <q-btn
                  @click="gerarPDF('anotacoes')"
                  label="Gerar PDF anotacoes"
                  class="custom-btn pdf-btn"
                />
                <q-btn
                  @click="gerarExcel('anotacoes')"
                  label="Gerar Excel anotacoes"
                  class="custom-btn excel-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import jsPDF from 'jspdf';
import { writeFile, utils } from 'xlsx';
import { ref } from 'vue';

const anotacoes = ref(''); // Anotações para incluir no relatório

const gerarPDF = (tipo) => {
  let pdf = new jsPDF();

  // Adicionando anotações personalizadas no PDF
  if (anotacoes.value) {
    pdf.setFontSize(12);
    pdf.text(`Anotações: ${anotacoes.value}`, 10, 10);
  }

  if (tipo === 'chavesDevolvidas') {
    const chavesDevolvidasFromStorage =
      localStorage.getItem('chavesDevolvidas');
    let chavesDevolvidas = chavesDevolvidasFromStorage
      ? JSON.parse(chavesDevolvidasFromStorage)
      : [];

    if (chavesDevolvidas.length === 0) {
      pdf.text('Nenhuma chave devolvida', 10, 20);
    } else {
      chavesDevolvidas.forEach((chave, index) => {
        let basePosition = 30 + (index % 4) * 90;
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
          `Data Devolução: ${chave.dataDevolucao}`,
          10,
          basePosition + 50
        );
        pdf.text(
          `Hora Devolução: ${chave.horaDevolucao}`,
          10,
          basePosition + 60
        );
        pdf.text(
          `Usuário Devolução: ${chave.usuarioDevolucao}`,
          10,
          basePosition + 70
        );
        pdf.text(`Assinatura: ${chave.assinatura}`, 10, basePosition + 80);
      });
    }
    pdf.save('Relatorio_Chaves_Devolvidas.pdf');
  }

  if (tipo === 'encomendas') {
    const encomendasBaixadasFromStorage =
      localStorage.getItem('encomendasBaixadas');
    let encomendasBaixadas = encomendasBaixadasFromStorage
      ? JSON.parse(encomendasBaixadasFromStorage)
      : [];

    if (encomendasBaixadas.length === 0) {
      pdf.text('Nenhuma encomenda retirada', 10, 20);
    } else {
      encomendasBaixadas.forEach((encomenda, index) => {
        let basePosition = 30 + (index % 4) * 70;
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage();
        }
        pdf.setFontSize(8);
        pdf.text(`Encomenda ${index + 1}:`, 10, basePosition);
        pdf.text(`Data: ${encomenda.data}`, 10, basePosition + 10);
        pdf.text(`Hora: ${encomenda.hora}`, 10, basePosition + 20);
        pdf.text(
          `Data Baixa: ${new Date(encomenda.dataBaixa).toLocaleString(
            'pt-BR'
          )}`,
          10,
          basePosition + 30
        );
        pdf.text(
          `Destinatario: ${encomenda.destinatario}`,
          10,
          basePosition + 40
        );
        pdf.text(`Conteudo: ${encomenda.conteudo}`, 10, basePosition + 50);
        pdf.text(`Tipo: ${encomenda.tipo}`, 10, basePosition + 60);
        pdf.text(`Assinatura: ${encomenda.assinatura}`, 10, basePosition + 80);
      });
    }
    pdf.save('Relatorio_Encomendas.pdf');
  }

  if (tipo === 'leiturasAgua') {
    const leiturasAguaFromStorage = localStorage.getItem('leiturasAgua');
    let leiturasAgua = leiturasAguaFromStorage
      ? JSON.parse(leiturasAguaFromStorage)
      : [];

    if (leiturasAgua.length === 0) {
      pdf.text('Nenhuma leitura de água registrada', 10, 20);
    } else {
      leiturasAgua.forEach((leitura, index) => {
        let basePosition = 30 + (index % 4) * 70;
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage();
        }
        pdf.setFontSize(8);
        pdf.text(`Leitura ${index + 1}:`, 10, basePosition);
        pdf.text(`Data: ${leitura.data}`, 10, basePosition + 10);
        pdf.text(`Consumo: ${leitura.consumo}`, 10, basePosition + 20);
      });
    }
    pdf.save('Relatorio_Leituras_Agua.pdf');
  }

  if (tipo === 'anotacoes') {
    // Gerar PDF para Anotações
    if (anotacoes.value.trim() === '') {
      pdf.text('Nenhuma anotação registrada', 10, 20);
    } else {
      pdf.text(`Anotacao ${index + 1}:`, 10, basePosition);
      pdf.text(`data ${anotacao.data}:`, 10, basePosition);
    }
    pdf.save('Relatorio_Anotacoes.pdf');
  }

  if (tipo === 'qtc') {
    // Gerar PDF para Qtc
    const qtcDataFromStorage = localStorage.getItem('qtcData');
    let qtcData = qtcDataFromStorage ? JSON.parse(qtcDataFromStorage) : [];

    if (qtcData.length === 0) {
      pdf.text('Nenhuma Qtc registrada', 10, 20);
    } else {
      qtcData.forEach((item, index) => {
        let basePosition = 30 + (index % 4) * 70;
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage();
        }
        pdf.setFontSize(8);
        pdf.text(`Qtc ${index + 1}:`, 10, basePosition);
        pdf.text(`Data: ${item.data}`, 10, basePosition + 10);
        pdf.text(`Data: ${item.hora}`, 10, basePosition + 10);
        pdf.text(`Detalhes: ${item.infomarcao}`, 10, basePosition + 20);
      });
    }
    pdf.save('Relatorio_Qtc.pdf');
  }
};

const gerarExcel = (tipo) => {
  let data = [];

  if (tipo === 'chavesDevolvidas') {
    const chavesDevolvidasFromStorage =
      localStorage.getItem('chavesDevolvidas');
    let chavesDevolvidas = chavesDevolvidasFromStorage
      ? JSON.parse(chavesDevolvidasFromStorage)
      : [];

    data = chavesDevolvidas.map((chave, index) => ({
      Chave: `Chave ${index + 1}`,
      Conjunto: chave.conjunto,
      Data: chave.data,
      Hora: chave.hora,
      Usuário: chave.usuario,
      'Data Devolução': chave.dataDevolucao,
      'Hora Devolução': chave.horaDevolucao,
      'Usuário Devolução': chave.usuarioDevolucao,
      Assinatura: chave.assinatura,
    }));
  }

  if (tipo === 'encomendas') {
    const encomendasBaixadasFromStorage =
      localStorage.getItem('encomendasBaixadas');
    let encomendasBaixadas = encomendasBaixadasFromStorage
      ? JSON.parse(encomendasBaixadasFromStorage)
      : [];

    data = encomendasBaixadas.map((encomenda, index) => ({
      Encomenda: `Encomenda ${index + 1}`,
      Data: encomenda.data,
      Hora: encomenda.hora,
      'Data Baixa': new Date(encomenda.dataBaixa).toLocaleString('pt-BR'),
      Destinatário: encomenda.destinatario,
      Conteúdo: encomenda.conteudo,
      Tipo: encomenda.tipo,
    }));
  }

  if (tipo === 'leiturasAgua') {
    const leiturasAguaFromStorage = localStorage.getItem('leiturasAgua');
    let leiturasAgua = leiturasAguaFromStorage
      ? JSON.parse(leiturasAguaFromStorage)
      : [];

    data = leiturasAgua.map((leitura, index) => ({
      Leitura: `Leitura ${index + 1}`,
      Data: leitura.data,
      Consumo: leitura.consumo,
    }));
  }

  if (tipo === 'anotacoes') {
    // Gerar Excel para Anotações
    data = [{ Anotacoes: anotacoes.value }];
  }

  if (tipo === 'qtc') {
    // Gerar Excel para Qtc
    const qtcDataFromStorage = localStorage.getItem('qtcData');
    let qtcData = qtcDataFromStorage ? JSON.parse(qtcDataFromStorage) : [];

    data = qtcData.map((item, index) => ({
      Qtc: `Qtc ${index + 1}`,
      Data: item.data,
      Detalhes: item.detalhes,
    }));
  }

  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Relatório');
  writeFile(workbook, `${tipo}_Relatorio.xlsx`);
};
</script>

<style scoped>
.card-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  justify-items: center;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.report-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.button-container {
  display: flex;
  flex-direction: column; /* Para manter os botões um abaixo do outro */
  gap: 10px; /* Espaçamento entre os botões */
}

.custom-btn {
  width: 100%; /* Faz o botão ocupar toda a largura disponível */
  border-radius: 5px; /* Bordas arredondadas */
}

.pdf-btn {
  background-color: #4caf50; /* Cor do botão PDF */
  color: rgb(245, 235, 235); /* Cor do texto */
}

.pdf-btn:hover {
  background-color: #0f5f13; /* Cor do hover para PDF */
}

.excel-btn {
  background-color: #2196f3; /* Cor do botão Excel */
  color: white; /* Cor do texto */
}

.excel-btn:hover {
  background-color: #04477e; /* Cor do hover para Excel */
}
.border {
  border: 1px solid #000 !important;
  margin-left: 4rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}
.card {
  transition: transform 0.3s, box-shadow 0.3s; /* Animação suave */
}

.card:hover {
  transform: scale(1.05); /* Aumenta o tamanho do card */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Adiciona sombra */
}
</style>
