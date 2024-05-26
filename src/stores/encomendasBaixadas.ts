export interface EncomendaBaixada {
  id: string;
  data: string;
  hora: string;
  destinatario: string;
  conjunto: string;
  conteudo: string;
  tipo: string;
  dataBaixa: Date;
}

const STORAGE_KEY = 'encomendasBaixadas';

export const carregarEncomendasBaixadas = (): EncomendaBaixada[] => {
  const encomendasBaixadas = localStorage.getItem(STORAGE_KEY);
  return encomendasBaixadas ? JSON.parse(encomendasBaixadas) : [];
};

export const salvarEncomendasBaixadas = (encomendas: EncomendaBaixada[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(encomendas));
};
