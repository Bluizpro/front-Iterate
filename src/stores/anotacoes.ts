interface AnotacaoStorage {
  id: string; // Novo campo de ID
  data: string;
  hora: string;
  conjunto: number;
  usuario: string;
  paciente: string;
  status: string;
  info: string;
}

// Função para gerar um ID único para cada anotação
function gerarIdAnotacao(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Função para salvar uma anotação no localStorage
function salvarAnotacao(anotacao: AnotacaoStorage) {
  // Gera um ID único para a nova anotação
  anotacao.id = gerarIdAnotacao();

  // Adiciona a nova anotação à lista
  anotacoes.push(anotacao);

  // Salva a lista atualizada no localStorage
  localStorage.setItem('anotacoes', JSON.stringify(anotacoes));
}
