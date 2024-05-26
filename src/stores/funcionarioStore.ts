/* import { defineStore } from 'pinia';
import { Delivery } from 'src/components/Imodels';
import { useEncomendasStore } from './encomendaStore';

export interface Funcionario {
  conjunto: string;
  telefone: string;
  setor: string;
  nome: string;
  encomendas: Delivery[]; // Novo campo
}

interface FuncionariosState {
  funcionarios: Funcionario[];
}

export const useFuncionariosStore = defineStore('funcionariosStore', {
  state: (): FuncionariosState => ({
    funcionarios: [],
  }),
  actions: {
    init() {
      const savedState = localStorage.getItem('funcionariosStore');
      if (savedState) {
        this.funcionarios = JSON.parse(savedState);
      }
    },
    adicionarFuncionario(novoFuncionario: Funcionario) {
      novoFuncionario.encomendas = []; // Inicializa o campo encomendas como uma lista vazia
      this.funcionarios.push(novoFuncionario);
      localStorage.setItem(
        'funcionariosStore',
        JSON.stringify(this.funcionarios)
      );
    },
    removerFuncionario(nome: string) {
      this.funcionarios = this.funcionarios.filter(
        (funcionario) => funcionario.nome !== nome
      );
      localStorage.setItem(
        'funcionariosStore',
        JSON.stringify(this.funcionarios)
      );
    },
    getFuncionarios() {
      return this.funcionarios;
    },
    adicionarEncomendaAFuncionario(
      numeroConjuntoFuncionario: string,
      encomenda: Delivery
    ) {
      const funcionario = this.funcionarios.find(
        (funcionario) => funcionario.conjunto === numeroConjuntoFuncionario
      );

      if (funcionario) {
        funcionario.encomendas.push(encomenda);
        console.log();

        // Adicionar a encomenda no store de encomendas
        const encomendasStore = useEncomendasStore();
        encomendasStore.adicionarEncomenda(encomenda);

        return true;
      } else {
        return false;
      }
    },
  },
});

const funcionariosStore = useFuncionariosStore();
funcionariosStore.init();
 */

import { defineStore } from 'pinia';
import { Delivery } from 'src/components/Imodels';
import { useEncomendasStore } from './encomendaStore';
import { watch } from 'vue';

export interface Funcionario {
  conjunto: string;
  telefone: string;
  setor: string;
  nome: string;
  encomendas: Delivery[];
}

interface FuncionariosState {
  funcionarios: Funcionario[];
}

export const useFuncionariosStore = defineStore('funcionariosStore', {
  state: (): FuncionariosState => ({
    funcionarios: [],
  }),
  actions: {
    init() {
      const savedState = localStorage.getItem('funcionariosStore');
      if (savedState) {
        this.funcionarios = JSON.parse(savedState);
      }

      watch(
        () => this.funcionarios,
        (newState) => {
          localStorage.setItem('funcionariosStore', JSON.stringify(newState));
        },
        { deep: true }
      );
    },
    adicionarFuncionario(novoFuncionario: Funcionario) {
      novoFuncionario.encomendas = []; // Inicializa o campo encomendas como uma lista vazia
      this.funcionarios.push(novoFuncionario);
      localStorage.setItem(
        'funcionariosStore',
        JSON.stringify(this.funcionarios)
      );
    },
    removerFuncionario(nome: string) {
      this.funcionarios = this.funcionarios.filter(
        (funcionario) => funcionario.nome !== nome
      );
      localStorage.setItem(
        'funcionariosStore',
        JSON.stringify(this.funcionarios)
      );
    },
    getFuncionarios() {
      return this.funcionarios;
    },
    adicionarEncomendaAFuncionario(
      numeroConjunto: string,
      encomenda: Delivery
    ) {
      const funcionario = this.funcionarios.find(
        (funcionario) => funcionario.conjunto === numeroConjunto
      );

      if (funcionario) {
        funcionario.encomendas.push(encomenda);

        // Adicionar a encomenda no store de encomendas
        const encomendasStore = useEncomendasStore();
        encomendasStore.adicionarEncomenda(encomenda);

        return true;
      } else {
        return false;
      }
    },
  },
});

const funcionariosStore = useFuncionariosStore();
funcionariosStore.init();
