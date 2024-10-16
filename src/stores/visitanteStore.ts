import { defineStore } from 'pinia';
import {
  getVisitantes,
  createVisitante,
  deleteVisitante,
} from '../services/visitanteApi'; // Certifique-se de que o caminho está correto

interface Visitante {
  id: string; // Adiciona o ID ao tipo Visitante
  conjunto: string;
  nome: string;
  cpf: string;
  empresa: string;
  autorizacao: string;
  dataHora: string;
}

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
        const visitantes = await getVisitantes();
        this.visitantes = visitantes;
      } catch (error) {
        console.error('Erro ao carregar visitantes:', error);
      }
    },
    async adicionarVisitante(novoVisitante: Visitante) {
      try {
        const visitanteCriado = await createVisitante(novoVisitante);
        this.visitantes.push(visitanteCriado);
      } catch (error) {
        console.error('Erro ao adicionar visitante:', error);
      }
    },
    async removerVisitante(id: string) {
      try {
        await deleteVisitante(id); // Remover visitante via API usando ID
        this.visitantes = this.visitantes.filter(
          (visitante) => visitante.id !== id
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
