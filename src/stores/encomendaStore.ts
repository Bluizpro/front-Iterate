/* import { defineStore } from 'pinia';
import {
  createCorrespondenciaInterno,
  getCorrespondenciasInternas,
  deleteCorrespondenciaInterno,
} from '../services/encomenInterAPI';

import {
  createCorrespondenciaExterno,
  getCorrespondenciasExterno,
  deleteCorrespondenciaExterno,
} from '../services/encomenExternoAPI';

import {
  getCorrespondenciasSedex,
  deleteCorrespondenciaSedex,
} from '../services/encomenSedexAPI';

export interface Delivery {
  id: number;
  tipo: string; // 'interno', 'externo', 'sedex'
  [key: string]: unknown;
}

export interface EncomendasState {
  encomendasInternas: Delivery[];
  encomendasExternas: Delivery[];
  encomendasCorreio: Delivery[];
}

export const useEncomendasStore = defineStore('encomendasStore', {
  state: (): EncomendasState => ({
    encomendasInternas: [],
    encomendasExternas: [],
    encomendasCorreio: [],
  }),

  actions: {
    // Funções para buscar encomendas das APIs diretamente
    async fetchEncomendasInternas() {
      this.encomendasInternas = await getCorrespondenciasInternas();
    },

    async fetchEncomendasExternas() {
      this.encomendasExternas = await getCorrespondenciasExterno();
    },

    async fetchEncomendasSedex() {
      const encomenda = await getCorrespondenciasSedex();
      this.encomendasCorreio.push(encomenda);
    },

    // Funções para adicionar encomendas
    async adicionarEncomendaInterna(encomenda: Delivery) {
      const novaEncomenda = await createCorrespondenciaInterno(encomenda);
      this.encomendasInternas.push(novaEncomenda);
    },

    async adicionarEncomendaExterna(encomenda: Delivery) {
      const novaEncomenda = await createCorrespondenciaExterno(encomenda);
      this.encomendasExternas.push(novaEncomenda);
    },

    // Funções para deletar encomendas
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
      this.encomendasCorreio = this.encomendasCorreio.filter(
        (e) => e.id !== id
      );
    },
  },

  getters: {
    // Getters para obter o total de encomendas
    getTotalEncomendasInternas(state): number {
      return state.encomendasInternas.length;
    },
    getTotalEncomendasExternas(state): number {
      return state.encomendasExternas.length;
    },
    getTotalEncomendasSedex(state): number {
      return state.encomendasCorreio.length;
    },

    // Getter para combinar todas as encomendas
    allEncomendas(state): Delivery[] {
      return [
        ...state.encomendasInternas,
        ...state.encomendasExternas,
        ...state.encomendasCorreio,
      ];
    },
  },
});
 */
/* import { defineStore } from 'pinia';
import {
  createCorrespondenciaInterno,
  getCorrespondenciasInternas,
  deleteCorrespondenciaInterno,
} from '../services/encomenInterAPI';

import {
  createCorrespondenciaExterno,
  getCorrespondenciasExterno,
  deleteCorrespondenciaExterno,
} from '../services/encomenExternoAPI';

import {
  getCorrespondenciasSedex,
  deleteCorrespondenciaSedex,
} from '../services/encomenSedexAPI';

export interface Delivery {
  id: number;
  tipo: string; // 'interno', 'externo', 'sedex'
  [key: string]: unknown;
}

export interface EncomendasState {
  encomendasInternas: Delivery[];
  encomendasExternas: Delivery[];
  encomendasCorreio: Delivery[];
}

export const useEncomendasStore = defineStore('encomendasStore', {
  state: (): EncomendasState => ({
    encomendasInternas: [],
    encomendasExternas: [],
    encomendasCorreio: [],
  }),

  actions: {
    // Funções para buscar encomendas das APIs diretamente
    async fetchEncomendasInternas() {
      this.encomendasInternas = await getCorrespondenciasInternas();
    },

    async fetchEncomendasExternas() {
      this.encomendasExternas = await getCorrespondenciasExterno();
    },

    async fetchEncomendasSedex() {
      const encomendas = await getCorrespondenciasSedex();
      this.encomendasCorreio = encomendas; // Atualiza a lista de correios com todas as encomendas
    },

    // Funções para adicionar encomendas
    async adicionarEncomendaInterna(encomenda: Delivery) {
      const novaEncomenda = await createCorrespondenciaInterno(encomenda);
      this.encomendasInternas.push(novaEncomenda);
    },

    async adicionarEncomendaExterna(encomenda: Delivery) {
      const novaEncomenda = await createCorrespondenciaExterno(encomenda);
      this.encomendasExternas.push(novaEncomenda);
    },

    // Funções para deletar encomendas
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
      this.encomendasCorreio = this.encomendasCorreio.filter(
        (e) => e.id !== id
      );
    },

    // Função para atualizar as contagens automaticamente
    async atualizarContagens() {
      await this.fetchEncomendasInternas();
      await this.fetchEncomendasExternas();
      await this.fetchEncomendasSedex();
    },
  },

  getters: {
    // Getters para obter o total de encomendas
    getTotalEncomendasInternas(state): number {
      return state.encomendasInternas.length;
    },
    getTotalEncomendasExternas(state): number {
      return state.encomendasExternas.length;
    },
    getTotalEncomendasSedex(state): number {
      return state.encomendasCorreio.length;
    },

    // Getter para combinar todas as encomendas
    allEncomendas(state): Delivery[] {
      return [
        ...state.encomendasInternas,
        ...state.encomendasExternas,
        ...state.encomendasCorreio,
      ];
    },
  },
});
 */
