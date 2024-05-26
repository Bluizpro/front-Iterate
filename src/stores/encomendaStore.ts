import { defineStore } from 'pinia';
import { Delivery } from 'src/components/Imodels';
import { watch } from 'vue';

export interface EncomendasState {
  encomendas: Delivery[];
}

export const useEncomendasStore = defineStore('encomendasStore', {
  state: (): EncomendasState => ({
    encomendas: [],
  }),
  actions: {
    init() {
      const savedState = localStorage.getItem('encomendasStore');
      if (savedState) {
        this.encomendas = JSON.parse(savedState);
      }

      watch(
        () => this.encomendas,
        (newState) => {
          localStorage.setItem('encomendasStore', JSON.stringify(newState));
        },
        { deep: true }
      );
    },

    adicionarEncomenda(encomenda: Delivery) {
      this.$patch((state) => {
        state.encomendas.push(encomenda);
      });
    },
    // e aqui deleta encomenda
    deletarEncomenda(id: number) {
      this.$patch((state) => {
        const index = state.encomendas.findIndex(
          (encomenda) => encomenda.id === id
        );
        if (index !== -1) {
          state.encomendas.splice(index, 1);
        }
      });
    },
    //aqui da baixa na encomenda
    removerEncomenda(id: number) {
      this.$patch((state) => {
        const index = state.encomendas.findIndex(
          (encomenda) => encomenda.id === id
        );
        if (index !== 1) {
          state.encomendas.splice(index, 1);
        }
      });
    },
    atualizarEncomenda(id: number, encomendaEditada: Delivery) {
      const index = this.encomendas.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.encomendas[index] = encomendaEditada;
      }
    },
  },
  getters: {
    getQuantidadeEncomendasInterno(): number {
      return this.encomendas.filter((encomenda) => encomenda.tipo === 'interno')
        .length;
    },
    getQuantidadeEncomendasSedex(): number {
      return this.encomendas.filter((encomenda) => encomenda.tipo === 'sedex')
        .length;
    },
    getQuantidadeEncomendasExterno(): number {
      return this.encomendas.filter((encomenda) => encomenda.tipo === 'externo')
        .length;
    },
  },
});
