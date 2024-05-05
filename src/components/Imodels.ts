export interface listData {
  imagem: string[];
  tipo: string[];
}
interface Selecionavel {
  selecionado?: boolean;
  dataBaixa?: Date; // Adicione esta linha
}

export interface EncomendaSedex extends Selecionavel {
  id: number;
  data: string;
  hora: string;
  conjunto: string;
  destinatario: string;
  conteudo: string;
  tipo: 'sedex';
  notaFiscal: string;
}

export interface EncomendaInterno extends Selecionavel {
  id: number;
  data: string;
  hora: string;
  conjunto: string;
  destinatario: string;
  remetente: string;
  conteudo: string;
  tipo: 'interno';
  empresa: string;
}

export interface EncomendaExterno extends Selecionavel {
  id: number;
  data: string;
  hora: string;
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
  conjuto: string;
  usuario: string;
  usuarioDevolucao: string;
}

export type Delivery = EncomendaSedex | EncomendaInterno | EncomendaExterno;
