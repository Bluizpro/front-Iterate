import { defineStore } from 'pinia';
import { Delivery } from '../stores/Imodels';
import {
  getFuncionario,
  createFuncionario,
  removeFuncionario,
} from '../services/funcionarioApi';
import { useEncomendasStore } from './encomendaStore';

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
    async init() {
      try {
        this.funcionarios = await getFuncionario();
      } catch (error) {
        console.error('Erro ao inicializar funcionários:', error);
      }
    },
    async adicionarFuncionario(novoFuncionario: Funcionario) {
      novoFuncionario.encomendas = []; // Inicializa o campo encomendas como uma lista vazia
      try {
        await createFuncionario(novoFuncionario);
        this.funcionarios.push(novoFuncionario);
      } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
      }
    },
    async removerFuncionario(conjunto: string) {
      try {
        await removeFuncionario(conjunto);
        this.funcionarios = this.funcionarios.filter(
          (funcionario: { conjunto: string }) =>
            funcionario.conjunto !== conjunto
        );
      } catch (error) {
        console.error('Erro ao remover funcionário:', error);
      }
    },
    async atualizarFuncionarios() {
      try {
        this.funcionarios = await getFuncionario();
      } catch (error) {
        console.error('Erro ao atualizar funcionários:', error);
      }
    },
    adicionarEncomendaAFuncionario(
      numeroConjunto: string,
      encomenda: Delivery
    ) {
      const funcionario = this.funcionarios.find(
        (funcionario: { conjunto: string }) =>
          funcionario.conjunto === numeroConjunto
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
