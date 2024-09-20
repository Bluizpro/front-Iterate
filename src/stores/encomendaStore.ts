// src/stores/encomendaStore.ts

import { defineStore } from 'pinia';
import { watch } from 'vue';
import {
  createCorrespondenciaInterno,
  getCorrespondenciasInternas,
  updateCorrespondenciaInterno,
  deleteCorrespondenciaInterno,
} from '../services/encomenInterAPI';

import {
  createCorrespondenciaExterno,
  getCorrespondenciasExterno,
  updateCorrespondenciaExterno,
  deleteCorrespondenciaExterno,
} from '../services/encomenExternoAPI';

import {
  getCorrespondenciaSedexById,
  deleteCorrespondenciaSedex,
} from '../services/encomenSedexAPI';

export interface Delivery {
  id: number;
  tipo: string; // 'interno', 'externo', 'sedex'
  [key: string]: any;
}

export interface EncomendasState {
  encomendasInternas: Delivery[];
  encomendasExternas: Delivery[];
  encomendasSedex: Delivery[];
}

export const useEncomendasStore = defineStore('encomendasStore', {
  state: (): EncomendasState => ({
    encomendasInternas: [],
    encomendasExternas: [],
    encomendasSedex: [],
  }),

  actions: {
    init() {
      const savedState = localStorage.getItem('encomendasStore');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        this.$patch(parsedState);
      }

      watch(
        () => this.$state,
        (newState) => {
          localStorage.setItem('encomendasStore', JSON.stringify(newState));
        },
        { deep: true }
      );
    },

    async fetchEncomendasInternas() {
      this.encomendasInternas = await getCorrespondenciasInternas();
    },

    async fetchEncomendasExternas() {
      this.encomendasExternas = await getCorrespondenciasExterno();
    },

    async fetchEncomendasSedex(id: number) {
      const encomenda = await getCorrespondenciaSedexById(id);
      this.encomendasSedex.push(encomenda);
    },

    async adicionarEncomendaInterna(encomenda: Delivery) {
      const novaEncomenda = await createCorrespondenciaInterno(encomenda);
      this.encomendasInternas.push(novaEncomenda);
    },

    async adicionarEncomendaExterna(encomenda: Delivery) {
      const novaEncomenda = await createCorrespondenciaExterno(encomenda);
      this.encomendasExternas.push(novaEncomenda);
    },

    async atualizarEncomendaInterna(id: number, encomendaEditada: Delivery) {
      await updateCorrespondenciaInterno(id, encomendaEditada);
      const index = this.encomendasInternas.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.encomendasInternas[index] = encomendaEditada;
      }
    },

    async atualizarEncomendaExterna(id: number, encomendaEditada: Delivery) {
      await updateCorrespondenciaExterno(id, encomendaEditada);
      const index = this.encomendasExternas.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.encomendasExternas[index] = encomendaEditada;
      }
    },

    async deletarEncomendaInterna(id: number) {
      await deleteCorrespondenciaInterno(id);
      this.encomendasInternas = this.encomendasInternas.filter(
        (e) => e.id !== id
      );
    },

    async deletarEncomendaExterna(id: number) {
      await deleteCorrespondenciaExterno(id);
      this.encomendasExternas = this.encomendasExternas.filter(
        (e) => e.id !== id
      );
    },

    async deletarEncomendaSedex(id: number) {
      await deleteCorrespondenciaSedex(id);
      this.encomendasSedex = this.encomendasSedex.filter((e) => e.id !== id);
    },
  },

  getters: {
    getTotalEncomendasInternas(state): number {
      return state.encomendasInternas.length;
    },
    getTotalEncomendasExternas(state): number {
      return state.encomendasExternas.length;
    },
    getTotalEncomendasSedex(state): number {
      return state.encomendasSedex.length;
    },
    allEncomendas(state): Delivery[] {
      return [
        ...state.encomendasInternas,
        ...state.encomendasExternas,
        ...state.encomendasSedex,
      ];
    },
  },
});
