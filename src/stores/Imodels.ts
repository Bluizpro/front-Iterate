export interface listData {
  imagem: string[];
  tipo: string[];
}
// Em Imodels.ts ou onde você define suas interfaces
// Aqui está uma representação de interface em JavaScript, não uma exportação real
export const EncomendaConsulta = {
  conjunto: String,
  destinatario: String,
  conteudo: String,
  tipo: String, // Pode ser 'interno', 'sedex', ou 'externo'
};

interface Selecionavel {
  selecionado?: boolean;
  dataBaixa?: Date; // Campo adicionado
}

export interface EncomendaSedex extends Selecionavel {
  id: number;
  data: string; // Considere usar Date se possível
  hora: string; // Considere usar Date se possível
  conjunto: string;
  destinatario: string;
  conteudo: string;
  tipo: 'sedex';
  notaFiscal: string;
}

export interface EncomendaInterno extends Selecionavel {
  id: number;
  data: string; // Considere usar Date se possível
  hora: string; // Considere usar Date se possível
  conjunto: string;
  destinatario: string;
  remetente: string;
  conteudo: string;
  tipo: 'interno';
  empresa: string;
}

export interface EncomendaExterno extends Selecionavel {
  id: number;
  data: string; // Considere usar Date se possível
  hora: string; // Considere usar Date se possível
  conjunto: string;
  destinatario: string;
  conteudo: string;
  tipo: 'externo';
  recebedor: string;
  local: string;
}

export interface RetiradaChave {
  data: Date;
  hora: Date;
  conjunto: string;
  usuario: string;
}

export interface DevolucaoChave {
  data: Date;
  hora: Date;
  conjunto: string; // Corrigido de "conjuto" para "conjunto"
  usuario: string;
  usuarioDevolucao: string;
}

export type Delivery = EncomendaSedex | EncomendaInterno | EncomendaExterno;
