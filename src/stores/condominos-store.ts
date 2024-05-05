import { defineStore } from 'pinia';
import { Delivery } from 'src/components/Imodels';
import { watch } from 'vue';

export interface Condomino {
  conjunto: string;
  especialidade: string;
  locatario: string[];
  proprietario: string;
  interfone: string;
  telefone: string;
  encomendas: Delivery[];
  visitantes: string[];
}

interface CondominosState {
  condominos: Condomino[];
}
export interface EncomendaConsulta {
  conjunto: string;
  destinatario: string;
  conteudo: string;
}

export const useCondominosStore = defineStore('condominosStore', {
  state: (): CondominosState => ({
    condominos: [],
  }),
  actions: {
    init() {
      const savedState = localStorage.getItem('condominosStore');
      if (savedState) {
        this.condominos = JSON.parse(savedState);
      }

      watch(
        () => this.condominos,
        (newState) => {
          localStorage.setItem('condominosStore', JSON.stringify(newState));
        },
        { deep: true }
      );
    },
    adicionarConjunto(novoConjunto: Condomino) {
      // Verifica se o conjunto já existe
      const conjuntoExistente = this.condominos.find(
        (condomino) => condomino.conjunto === novoConjunto.conjunto
      );

      if (!conjuntoExistente) {
        this.condominos.push(novoConjunto);
        return true;
      } else {
        console.error('Este conjunto já existe.');
        return false;
      }
    },
    adicionarEncomendaACondomino(numeroConjunto: string, encomenda: Delivery) {
      const condomino = this.condominos.find(
        (condomino) => condomino.conjunto === numeroConjunto
      );

      if (condomino) {
        condomino.encomendas.push(encomenda);
        return true;
      } else {
        return false;
      }
    },
    adicionarLocatarioACondomino(numeroConjunto: string, locatario: string) {
      const condomino = this.condominos.find(
        (condomino) => condomino.conjunto === numeroConjunto
      );

      if (condomino) {
        // Verifica se o locatário já existe
        if (!condomino.locatario.includes(locatario)) {
          condomino.locatario.push(locatario);
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

    deletarEncomenda(id: number) {
      this.condominos.forEach((condomino) => {
        const index = condomino.encomendas.findIndex(
          (encomenda) => encomenda.id === id
        );
        if (index !== -1) {
          condomino.encomendas.splice(index, 1);
        }
      });
    },
    atualizarEncomenda(id: number, encomendaEditada: Delivery) {
      this.condominos.forEach((condomino) => {
        const encomendaIndex = condomino.encomendas.findIndex(
          (encomenda) => encomenda.id === id
        );
        if (encomendaIndex !== -1) {
          // Atualiza a encomenda com os novos dados
          condomino.encomendas[encomendaIndex] = encomendaEditada;
        }
      });
    },
  },
  getters: {
    getQuantidadeEncomendasInterno(): number {
      return this.condominos.reduce((total, condomino) => {
        return (
          total +
          condomino.encomendas.filter(
            (encomenda) => encomenda.tipo === 'interno'
          ).length
        );
      }, 0);
    },
    getQuantidadeEncomendasSedex(): number {
      return this.condominos.reduce((total, condomino) => {
        return (
          total +
          condomino.encomendas.filter((encomenda) => encomenda.tipo === 'sedex')
            .length
        );
      }, 0);
    },
    getQuantidadeEncomendasExterno(): number {
      return this.condominos.reduce((total, condomino) => {
        return (
          total +
          condomino.encomendas.filter(
            (encomenda) => encomenda.tipo === 'externo'
          ).length
        );
      }, 0);
    },
  },
});

// ...

const condominosStore = useCondominosStore();
condominosStore.init();
