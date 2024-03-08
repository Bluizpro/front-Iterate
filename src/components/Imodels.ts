

export interface listData {
  imagem: string[];
  tipo: string[];

}

export interface EncomendaSedex {
  id: number;
  data: string;
  hora: string;
  conjunto: string;
  destinatario: string;
  conteudo: string;
  tipo: 'sedex';
  notaFiscal: string;
}

export interface EncomendaInterno {
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

export interface EncomendaExterno {
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

export type Delivery = EncomendaSedex | EncomendaInterno | EncomendaExterno;


