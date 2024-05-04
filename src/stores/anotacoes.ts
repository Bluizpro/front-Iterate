interface AnotacaoStorage {
  data: string;
  hora: string;
  conjunto: number;
  usuario: string;
  paciente: string;
  status: string;
  info: string;
}

// Inicializa um objeto vazio para armazenar as anotações
let anotacoes: AnotacaoStorage[] = [];

// Função para salvar uma anotação no localStorage
function salvarAnotacao(anotacao: AnotacaoStorage) {
  // Adiciona a nova anotação à lista
  anotacoes.push(anotacao);

  // Salva a lista atualizada no localStorage
  localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
}

// Função para carregar as anotações do localStorage
function carregarAnotacoes() {
  const savedAnotacoes = localStorage.getItem('anotacoes');

  if (savedAnotacoes) {
    // Converte a string salva de volta em uma lista de anotações
    anotacoes = JSON.parse(savedAnotacoes);
  }
}
