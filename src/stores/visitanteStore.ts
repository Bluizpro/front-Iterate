import { defineStore } from 'pinia';

export interface Visitante {
  conjunto: string;
  nome: string;
  cpf: string;
  empresa: string;
  autorizacao: string;
}

interface VisitantesState {
  visitantes: Visitante[];
}
import {
  getVisitantes,
  createVisitante,
  deleteVisitante,
} from '../services/visitanteApi'; // Ajuste o caminho para o serviço

interface VisitantesState {
  visitantes: Visitante[];
}

export const useVisitantesStore = defineStore('visitantesStore', {
  state: (): VisitantesState => ({
    visitantes: [],
  }),
  actions: {
    async init() {
      try {
        const visitantes = await getVisitantes(); // Buscar visitantes da API
        this.visitantes = visitantes;
        localStorage.setItem(
          'visitantesStore',
          JSON.stringify(this.visitantes)
        );
      } catch (error) {
        console.error('Erro ao carregar visitantes:', error);
      }
    },
    async adicionarVisitante(novoVisitante: Visitante) {
      try {
        const visitanteCriado = await createVisitante(novoVisitante); // Adicionar visitante via API
        this.visitantes.push(visitanteCriado);
        localStorage.setItem(
          'visitantesStore',
          JSON.stringify(this.visitantes)
        );
      } catch (error) {
        console.error('Erro ao adicionar visitante:', error);
      }
    },
    async removerVisitante(cpf: string) {
      try {
        await deleteVisitante(cpf); // Remover visitante via API
        this.visitantes = this.visitantes.filter(
          (visitante) => visitante.cpf !== cpf
        );
        localStorage.setItem(
          'visitantesStore',
          JSON.stringify(this.visitantes)
        );
      } catch (error) {
        console.error('Erro ao remover visitante:', error);
      }
    },
    getVisitantes() {
      return this.visitantes;
    },
  },
});
