import { defineStore } from 'pinia';

interface relatorio {
  id: number;
  usuarioLogado: string;
  data: string;
  hora: string;
  encomendas: object[];

}


interface relatorioState {
  relatorio: relatorio[];

}

export const relatorioStore = defineStore('relatorioStore', {
  state: (): relatorioState => ({
    relatorio: []
  }),

});
