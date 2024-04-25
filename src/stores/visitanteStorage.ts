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

export const useVisitantesStore = defineStore('visitantesStore', {
  state: (): VisitantesState => ({
    visitantes: [],
  }),
  actions: {
    init() {
      const savedState = localStorage.getItem('visitantesStore');
      if (savedState) {
        this.visitantes = JSON.parse(savedState);
      }
    },
    adicionarVisitante(novoVisitante: Visitante) {
      this.visitantes.push(novoVisitante);
      localStorage.setItem('visitantesStore', JSON.stringify(this.visitantes));
    },
    removerVisitante(cpf: string) {
      this.visitantes = this.visitantes.filter(
        (visitante) => visitante.cpf !== cpf
      );
      localStorage.setItem('visitantesStore', JSON.stringify(this.visitantes));
    },
    getVisitantes() {
      return this.visitantes;
    },
  },
});
