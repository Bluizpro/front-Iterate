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
import { getCorrespondenciasSedexRetiradas } from '../services/encomenSedexAPI';
import { getCorrespondenciasInternasRetiradas } from '../services/encomenInterAPI';
import { getCorrespondenciasExternasRetiradas } from '../services/encomenExternoAPI';

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

    // Define a fonte como negrito para o título
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      'Anotações Arquivadas:',
      pdf.internal.pageSize.getWidth() / 2,
      10,
      { align: 'center' }
    ); // Centraliza o texto

    // Define a fonte como normal para as anotações
    pdf.setFont('helvetica', 'normal');
    let yPos = 30; // Posição vertical inicial para as anotações

    if (anotacoes.value.length > 0) {
      anotacoes.value.forEach((nota) => {
        pdf.setFontSize(8);

        // Inserindo cada campo em uma posição vertical específica
        pdf.text(`Conjunto: ${nota.conjunto}`, 10, yPos);
        pdf.text(`Usuário: ${nota.usuario}`, 10, yPos + 5);
        pdf.text(`Paciente: ${nota.paciente}`, 10, yPos + 10);
        pdf.text(`Info: ${nota.info}`, 10, yPos + 15);
        pdf.text(`Data: ${nota.data}`, 10, yPos + 20);
        pdf.text(`Hora: ${nota.hora}`, 10, yPos + 25);

        // Adiciona uma linha na parte inferior do bloco de anotações
        pdf.line(10, yPos + 30, 200, yPos + 30); // Linha horizontal

        // Atualiza a posição vertical para o próximo bloco
        yPos += 40; // Ajuste o espaçamento entre os blocos

        // Se a posição ultrapassar o limite da página, cria uma nova página
        if (yPos > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPos = 10; // Reinicia a posição vertical na nova página
          pdf.setFont('helvetica', 'bold'); // Define a fonte como negrito para o título na nova página
          pdf.text(
            'Anotações Arquivadas:',
            pdf.internal.pageSize.getWidth() / 2,
            10,
            { align: 'center' }
          );
          pdf.setFont('helvetica', 'normal'); // Define a fonte como normal novamente
        }
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
        pdf.setFont('helvetica', 'bold'); // Define a fonte como negrito
        pdf.text(
          'Chaves Devolvidas:',
          pdf.internal.pageSize.getWidth() / 2,
          10,
          { align: 'center' }
        ); // Centraliza o texto
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');

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
    // Funções para obter os dados das encomendas retiradas
    const fetchEncomendasRetiradas = async () => {
      try {
        const [sedex, internas, externas] = await Promise.all([
          getCorrespondenciasSedexRetiradas(),
          getCorrespondenciasInternasRetiradas(),
          getCorrespondenciasExternasRetiradas(),
        ]);
        return [...sedex, ...internas, ...externas]; // Combina todos os dados em um único array
      } catch (error) {
        console.error('Erro ao buscar encomendas retiradas:', error);
        return []; // Retorna um array vazio em caso de erro
      }
    };

    const encomendasBaixadas = await fetchEncomendasRetiradas();
    pdf.setFont('helvetica', 'bold'); // Define a fonte como negrito
    pdf.setFontSize(12); // Tamanho da fonte para o título
    pdf.text(
      'Encomendas Retiradas:',
      pdf.internal.pageSize.getWidth() / 2,
      10,
      { align: 'center' }
    );

    if (encomendasBaixadas.length === 0) {
      pdf.setFontSize(10); // Tamanho da fonte para texto normal
      pdf.text('Nenhuma encomenda retirada', 10, 20);
    } else {
      encomendasBaixadas.forEach((encomenda, index) => {
        let basePosition = 30 + (index % 4) * 80; // Aumentar espaço entre as encomendas
        if (index % 4 === 0 && index !== 0) {
          pdf.addPage(); // Adiciona uma nova página após 4 encomendas
        }

        // Centraliza o texto
        pdf.setFontSize(10); // Tamanho para o texto normal
        pdf.setFont('helvetica', 'bold'); // Define a fonte como negrito
        pdf.text(`Encomenda ${index + 1}:`, 10, basePosition);

        // Adicionando o tipo de encomenda
        let tipoEncomenda;
        pdf.setFontSize(8); // Tamanho do texto do tipo de encomenda
        pdf.setFont('helvetica', 'normal'); // Retorna à fonte normal para as anotações
        if (encomenda.nomePessoaRetiraInterno) {
          tipoEncomenda = 'Interna';
        } else if (encomenda.nomePessoaRetiraExterno) {
          tipoEncomenda = 'Externa';
        } else if (encomenda.nomePessoaRetiraSedex) {
          tipoEncomenda = 'Sedex';
        }

        pdf.text(`Tipo: ${tipoEncomenda}`, 10, basePosition + 10); // Exibe o tipo da encomenda

        pdf.text(`Data: ${encomenda.data}`, 10, basePosition + 20);
        pdf.text(`Hora: ${encomenda.hora}`, 10, basePosition + 30);
        pdf.text(
          `Data Baixa: ${new Date(encomenda.dataRetirada).toLocaleString(
            'pt-BR'
          )}`,
          10,
          basePosition + 40
        );
        pdf.text(`Conteúdo: ${encomenda.conteudo}`, 10, basePosition + 50);

        // Exibe as informações específicas de cada tipo de encomenda
        if (encomenda.nomePessoaRetiraInterno) {
          pdf.text(`Destinatário: ${encomenda.nome}`, 10, basePosition + 60); // Interno
          pdf.text(
            `Assinatura: ${encomenda.nomePessoaRetiraInterno}`,
            10,
            basePosition + 70
          );
        } else if (encomenda.nomePessoaRetiraExterno) {
          pdf.text(
            `Destinatário: ${encomenda.recebedor}`,
            10,
            basePosition + 60
          ); // Externo
          pdf.text(
            `Assinatura: ${encomenda.nomePessoaRetiraExterno}`,
            10,
            basePosition + 70
          );
        } else if (encomenda.nomePessoaRetiraSedex) {
          pdf.text(`Destinatário: ${encomenda.nome}`, 10, basePosition + 60); // Sedex
          pdf.text(
            `Assinatura: ${encomenda.nomePessoaRetiraSedex}`,
            10,
            basePosition + 70
          );
        }

        // Adicionando um espaço adicional após a assinatura para evitar sobreposição
        pdf.text('', 10, basePosition + 80); // Adiciona espaço extra para separar as encomendas
      });
    }
    pdf.save('Relatorio_Encomendas.pdf'); // Salva o PDF
  }

  // -------------------- Leituras de Água --------------------
  if (tipo === 'leiturasAgua') {
    pdf.setFont('helvetica', 'bold'); // Define a fonte como negrito
    pdf.text(
      'Relatório de Leituras de Água:',
      pdf.internal.pageSize.getWidth() / 2,
      10,
      { align: 'center' }
    ); // Centraliza o texto
    const leiturasAgua = await getLeiturasAgua();
    if (!leiturasAgua || leiturasAgua.length === 0) {
      pdf.text('Nenhuma leitura de água registrada', 10, 20);
    } else {
      // Adiciona um título ao PDF
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
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
        pdf.setFont('helvetica', 'bold'); // Mantenha a fonte como negrito para "Leitura"
        pdf.text(`Leitura ${index + 1}:`, 10, basePosition); // Texto em negrito

        pdf.setFont('helvetica', 'normal'); // Altera a fonte de volta para normal para os dados
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
      console.error('error ao obter QTC arquivada', error);
      pdf.text('Erro ao buscar QTC arquivadas', 10, 20);
      pdf.save('Relatorio_QTC.pdf');
      return;
    }

    // Define a fonte como negrito e o tamanho para o título
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12); // Tamanho da fonte para o título
    pdf.text('Qtc:', pdf.internal.pageSize.getWidth() / 2, 10, {
      align: 'center',
    }); // Centraliza o texto

    // Define a fonte como normal para as informações
    pdf.setFont('helvetica', 'normal');

    if (qtcInfors.value.length > 0) {
      qtcInfors.value.forEach((qtc, index) => {
        pdf.setFontSize(10);
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

        // Adiciona uma linha na parte inferior do bloco
        pdf.line(10, yPos + 30, 200, yPos + 30); // Linha horizontal
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

  // Define o estilo de borda
  const borderStyle = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };

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
      // Adiciona um título
      data.push({ Anotações: 'Relatório de Anotações Arquivadas' });

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
    // Adiciona um título
    data.unshift({ Chave: 'Relatório de Chaves Devolvidas' });
  }

  // -------------------- Encomendas --------------------
  if (tipo === 'encomendas') {
    const fetchEncomendasRetiradas = async () => {
      try {
        const [sedex, internas, externas] = await Promise.all([
          getCorrespondenciasSedexRetiradas(),
          getCorrespondenciasInternasRetiradas(),
          getCorrespondenciasExternasRetiradas(),
        ]);
        return [...sedex, ...internas, ...externas]; // Combina todos os dados em um único array
      } catch (error) {
        console.error('Erro ao buscar encomendas retiradas:', error);
        return []; // Retorna um array vazio em caso de erro
      }
    };

    const encomendasBaixadas = await fetchEncomendasRetiradas();

    if (encomendasBaixadas.length === 0) {
      data.push({ Encomendas: 'Nenhuma encomenda retirada' });
    } else {
      // Adiciona um título
      data.push({ Encomendas: 'Relatório de Encomendas Retiradas' });

      encomendasBaixadas.forEach((encomenda) => {
        let tipoEncomenda = '';
        if (encomenda.nomePessoaRetiraInterno) {
          tipoEncomenda = 'Interna';
        } else if (encomenda.nomePessoaRetiraExterno) {
          tipoEncomenda = 'Externa';
        } else if (encomenda.nomePessoaRetiraSedex) {
          tipoEncomenda = 'Sedex';
        }

        data.push({
          Tipo: tipoEncomenda,
          Destinatário: encomenda.nome || encomenda.recebedor,
          Conteúdo: encomenda.conteudo,
          Data: encomenda.data,
          Hora: encomenda.hora,
          DataBaixa: new Date(encomenda.dataRetirada).toLocaleString('pt-BR'),
          Assinatura:
            encomenda.nomePessoaRetiraInterno ||
            encomenda.nomePessoaRetiraExterno ||
            encomenda.nomePessoaRetiraSedex,
        });
      });
    }
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
      // Adiciona um título
      data.push({ LeiturasAguas: 'Relatório de Leituras de Água' });

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
      // Adiciona um título
      data.push({ QTCS: 'Relatório de QTCs Arquivadas' });

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

  // Aplica bordas e centraliza o texto
  for (let cell in worksheet) {
    if (worksheet[cell].v) {
      // Verifica se a célula tem um valor
      worksheet[cell].s = {
        border: borderStyle,
        alignment: { horizontal: 'center', vertical: 'center' }, // Centraliza o texto
      };
    }
  }

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
