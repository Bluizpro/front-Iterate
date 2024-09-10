import { defineStore } from 'pinia';
import { Delivery } from '../stores/Imodels';
import {
  createCondomino,
  getCondominos,
  updateCondomino,
} from '../services/condonimoApi';

export interface Condomino {
  conjunto: string;
  nome: string;
  especialidade: string;
  locatario: string[];
  proprietario: string;
  interfone: string;
  telefone: string;
  visitantes: string[];
  encomendas: Delivery[];
}

interface CondominosState {
  condominos: Condomino[];
}

export const useCondominosStore = defineStore('condominosStore', {
  state: (): CondominosState => ({
    condominos: [],
  }),
  actions: {
    async init() {
      try {
        const data = await getCondominos();
        this.condominos = data;
      } catch (error) {
        console.error('Erro ao buscar dados de condomínios:', error);
      }
    },
    async adicionarConjunto(novoConjunto: Condomino) {
      try {
        const addedCondomino = await createCondomino(novoConjunto);
        this.condominos.push(addedCondomino); // Atualiza a lista local
        return true;
      } catch (error) {
        console.error('Erro ao adicionar condomínio:', error);
        return false;
      }
    },
    async atualizarCondomino(condomino: Condomino) {
      try {
        const updatedCondomino = await updateCondomino(condomino);
        const index = this.condominos.findIndex(
          (c: { conjunto: any }) => c.conjunto === updatedCondomino.conjunto
        );
        if (index !== -1) {
          this.condominos.splice(index, 1, updatedCondomino); // Força reatividade
        } else {
          console.error('Condomínio não encontrado na lista.');
        }
        return true;
      } catch (error) {
        console.error('Erro ao atualizar condomínio:', error);
        return false;
      }
    },

    async adicionarLocatarioACondomino(
      numeroConjunto: string,
      locatario: string
    ) {
      const condomino = this.condominos.find(
        (condomino: { conjunto: string }) =>
          condomino.conjunto === numeroConjunto
      );

      if (condomino) {
        if (!condomino.locatario.includes(locatario)) {
          condomino.locatario.push(locatario);
          await this.atualizarCondomino(condomino); // Atualiza no backend
          return true;
        } else {
          console.error('Este locatário já existe para o condomínio.');
          return false;
        }
      } else {
        console.error('Condomínio não encontrado.');
        return false;
      }
    },

    async adicionarEncomendaACondomino(
      numeroConjunto: string,
      encomenda: Delivery
    ) {
      const condomino = this.condominos.find(
        (condomino: { conjunto: string }) =>
          condomino.conjunto === numeroConjunto
      );

      if (condomino) {
        condomino.encomendas.push(encomenda);
        await this.atualizarCondomino(condomino); // Atualiza no backend
        return true;
      } else {
        console.error('Condomínio não encontrado.');
        return false;
      }
    },
  },
});

// Inicializa o store
const condominosStore = useCondominosStore();
condominosStore.init();
