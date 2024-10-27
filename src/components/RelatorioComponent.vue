<template>
  <q-page>
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
  </q-page>
</template>

<script setup>
import jsPDF from 'jspdf';
import { writeFile, utils } from 'xlsx';
import { ref } from 'vue';
import { getArchivedAnnotations } from '../services/anotacaoApi';
import { getArchivedQtcInfos } from '../services/qtcInforApi';
import { getLeiturasAgua } from '../services/leituraAguaApi';

const anotacoes = ref([]); // Array para incluir anotações no relatório
const qtcInfors = ref([]);
const leiturasAguas = ref([]);

// Função para gerar PDF
const gerarPDF = async (tipo) => {
  let pdf = new jsPDF();

  // -------------------- Anotações --------------------
  if (tipo === 'anotacoes') {
    try {
      anotacoes.value = await getArchivedAnnotations(); // Chamada para obter anotações arquivadas
    } catch (error) {
      console.error('Erro ao obter anotações arquivadas:', error);
      pdf.text('Erro ao buscar anotações arquivadas', 10, 20);
      pdf.save('Relatorio_Anotacoes.pdf');
      return;
    }

    if (anotacoes.value.length > 0) {
      pdf.setFontSize(12);
      pdf.text('Anotações Arquivadas:', 10, 10);
      anotacoes.value.forEach((nota, index) => {
        pdf.setFontSize(8);
        pdf.text(`Conjunto: ${nota.conjunto}`, 10, 20 + index * 30);
        pdf.text(`Usuário: ${nota.usuario}`, 10, 25 + index * 30);
        pdf.text(`Paciente: ${nota.paciente}`, 10, 30 + index * 30);
        pdf.text(`Info: ${nota.info}`, 10, 35 + index * 30);
        pdf.text(`Data: ${nota.data}`, 10, 40 + index * 30);
        pdf.text(`Hora: ${nota.hora}`, 10, 45 + index * 30);
      });
    } else {
      pdf.text('Nenhuma anotação arquivada', 10, 20);
    }
    pdf.save('Relatorio_Anotacoes.pdf');
    return;
  }

  // -------------------- Chaves Devolvidas --------------------
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
        let basePosition = 70 + (index % 4) * 90;
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage(); // Adiciona uma nova página após 4 chaves
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
    pdf.save('Relatorio_Chaves_Devolvidas.pdf'); // Salva o PDF
  }

  // -------------------- Encomendas --------------------
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
          pdf.addPage(); // Adiciona uma nova página após 4 encomendas
        }
        pdf.setFontSize(8);
        pdf.text(`Encomenda ${index + 1}:`, 10, basePosition);
        pdf.text(`Data: ${encomenda.data}`, 10, basePosition + 10);
        pdf.text(`Hora: ${encomenda.hora}`, 10, basePosition + 20);
        ('');
        pdf.text(
          `Data Baixa: ${new Date(encomenda.dataBaixa).toLocaleString(
            'pt-BR'
          )}`,
          10,
          basePosition + 30
        );
        pdf.text(
          `Destinatário: ${encomenda.destinatario}`,
          10,
          basePosition + 40
        );
        pdf.text(`Conteúdo: ${encomenda.conteudo}`, 10, basePosition + 50);
        pdf.text(`Tipo: ${encomenda.tipo}`, 10, basePosition + 60);
        pdf.text(`Assinatura: ${encomenda.assinatura}`, 10, basePosition + 80);
      });
    }
    pdf.save('Relatorio_Encomendas.pdf'); // Salva o PDF
  }
  // -------------------- Leituras de Água --------------------
  if (tipo === 'leiturasAgua') {
    const leiturasAgua = await getLeiturasAgua();

    if (!leiturasAgua || leiturasAgua.length === 0) {
      pdf.text('Nenhuma leitura de água registrada', 10, 20);
    } else {
      // Adiciona um título ao PDF
      pdf.setFontSize(12);
      pdf.text('Relatório de Leituras de Água', 10, 20);
      pdf.setFontSize(10);
      pdf.setDrawColor(0, 0, 0); // Define a cor da borda

      leiturasAgua.forEach((leitura, index) => {
        // Se não for a primeira leitura, adiciona uma nova página
        if (index !== 0) {
          pdf.addPage();
        }

        // Define a posição base para os elementos do PDF
        let basePosition = 30;

        // Desenha uma borda ao redor do bloco da leitura
        pdf.rect(5, basePosition - 5, 200, 160); // Ajuste as dimensões conforme necessário

        // Define o tamanho da fonte para os rótulos
        pdf.setFontSize(10);
        pdf.text(`Leitura ${index + 1}:`, 10, basePosition);

        // Adiciona as informações da leitura com um espaçamento adequado
        pdf.text(`Data Inicial: ${leitura.dataInicial}`, 10, basePosition + 10);
        pdf.text(`Hora: ${leitura.hora}`, 10, basePosition + 20);
        pdf.text(
          `Leitura Inicial: ${leitura.leituraInicial}`,
          10,
          basePosition + 30
        );
        pdf.text(`Data Parcial: ${leitura.dataParcial}`, 10, basePosition + 40);
        pdf.text(`Hora Parcial: ${leitura.parcial}`, 10, basePosition + 50);
        pdf.text(
          `Leitura Parcial: ${leitura.leituraParcial}`,
          10,
          basePosition + 60
        );
        pdf.text(`Data Meio: ${leitura.dataMeio}`, 10, basePosition + 70);
        pdf.text(
          `Hora Parcial 2: ${leitura.horaParcial2}`,
          10,
          basePosition + 80
        );
        pdf.text(
          `Leitura Parcial 2: ${leitura.leituraParcial2}`,
          10,
          basePosition + 90
        );
        pdf.text(`Data Final: ${leitura.dataFinal}`, 10, basePosition + 100);
        pdf.text(`Hora Final: ${leitura.horaFinal}`, 10, basePosition + 110);
        pdf.text(
          `Leitura Final: ${leitura.leituraFinal}`,
          10,
          basePosition + 120
        );
        pdf.text(`Consumo: ${leitura.consumo}`, 10, basePosition + 130);
      });
    }

    pdf.save('Relatorio_Leituras_Agua.pdf');
  }

  // -------------------- Qtc --------------------
  if (tipo === 'qtc') {
    try {
      qtcInfors.value = await getArchivedQtcInfos();
    } catch (error) {
      console.error('error ao obter QTC arquivado', error);
      pdf.text('Erro ao buscar QTC arquivadas', 10, 20);
      pdf.save('Relatorio_QTC.pdf');
      return;
    }
    if (qtcInfors.value.length > 0) {
      pdf.setFontSize(12);
      pdf.text('Anotações Arquivadas:', 10, 10);

      qtcInfors.value.forEach((qtc, index) => {
        pdf.setFontSize(8);
        // Definindo a posição vertical inicial para cada bloco de informações
        const yPos = 20 + index * 50; // Ajusta o espaçamento entre blocos de informações
        // Inserindo cada campo em uma posição vertical específica
        pdf.text(`Conjunto: ${qtc.conjunto}`, 10, yPos);
        pdf.text(`Data: ${qtc.data}`, 10, yPos + 5);
        pdf.text(`Hora: ${qtc.hora}`, 10, yPos + 10);
        pdf.text(`Usuario: ${qtc.usuario}`, 10, yPos + 15);
        pdf.text(`Prestador: ${qtc.prestador}`, 10, yPos + 20);
        // Dividindo o texto de "informacao" para que se ajuste na largura do PDF
        const informacaoTexto = pdf.splitTextToSize(
          `Informacao: ${qtc.informacao}`,
          180
        );
        pdf.text(informacaoTexto, 10, yPos + 25); // Exibe o texto ajustado em múltiplas linhas, se necessário
      });
    } else {
      pdf.text('Nenhuma anotação arquivada', 10, 20);
    }

    pdf.save('Relatorio_Qtc.pdf'); // Salva o PDF
  }
};

// Função para gerar Excel
const gerarExcel = async (tipo) => {
  let data = [];

  // -------------------- Anotações --------------------
  if (tipo === 'anotacoes') {
    try {
      anotacoes.value = await getArchivedAnnotations(); // Chamada para obter anotações arquivadas
    } catch (error) {
      console.error('Erro ao obter anotações arquivadas:', error);
      data.push({ Anotações: 'Erro ao buscar anotações arquivadas' });
    }

    if (anotacoes.value.length === 0) {
      data.push({ Anotações: 'Nenhuma anotação arquivada' });
    } else {
      anotacoes.value.forEach((nota) => {
        data.push({
          Conjunto: nota.conjunto,
          Usuário: nota.usuario,
          Paciente: nota.paciente,
          Info: nota.info,
          Data: nota.data,
          Hora: nota.hora,
        });
      });
    }
  }

  // -------------------- Chaves Devolvidas --------------------
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

  // -------------------- Encomendas --------------------
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
      Assinatura: encomenda.assinatura,
    }));
  }

  // -------------------- Leituras de Água --------------------
  if (tipo === 'leiturasAgua') {
    try {
      leiturasAguas.value = await getLeiturasAgua();
    } catch (error) {
      console.error('Erro ao obter leitura de aguas:', error);
      data.push({ LeiturasAguas: 'Erro ao buscar leitura de aguas' });
    }
    if (leiturasAguas.value.length === 0) {
      data.push({ LeiturasAguas: 'Nenhuma leitura de aguas' });
    } else {
      leiturasAguas.value.forEach((leitu) => {
        data.push({
          DadaInicial: leitu.dataInicial,
          Hora: leitu.hora,
          LeituraInicial: leitu.leituraInicial,
          VistoInicial: leitu.vistoInicial,
          DataParcial: leitu.dataParcial,
          Parcial: leitu.parcial,
          LeituraParcial: leitu.leituraParcial,
          DataMeio: leitu.dataMeio,
          HoraParcial2: leitu.horaParcial2,
          LeituraParcial2: leitu.leituraParcial2,
          DataFinal: leitu.dataFinal,
          HoraFinal: leitu.horaFinal,
          LeituraFinal: leitu.leituraFinal,
          VistoFinal: leitu.vistoFinal,
          Consumo: leitu.consumo,
        });
      });
    }
  }
  // -------------------- Qtc --------------------
  if (tipo === 'qtc') {
    try {
      qtcInfors.value = await getArchivedQtcInfos();
    } catch (error) {
      console.error('Erro ao obter QTC arquivadas:', error);
      data.push({ QTCS: 'Erro ao buscar QTC arquivadas' });
    }
    if (qtcInfors.value.length === 0) {
      data.push({ QTCS: 'Nenhum QTC arquivada' });
    } else {
      qtcInfors.value.forEach((qtc) => {
        data.push({
          Conjunto: qtc.conjunto,
          Data: qtc.data,
          Hora: qtc.hora,
          Usuario: qtc.usuario,
          prestador: qtc.prestador,
          informacao: qtc.informacao,
        });
      });
    }
  }

  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Relatório');

  writeFile(workbook, `Relatorio_${tipo}.xlsx`);
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
  margin-top: 2rem;
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

.card {
  transition: transform 0.3s, box-shadow 0.3s; /* Animação suave */
}

.card:hover {
  transform: scale(1.05); /* Aumenta o tamanho do card */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Adiciona sombra */
}
</style>
