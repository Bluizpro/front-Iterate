import { defineStore } from 'pinia';
import { Delivery } from 'src/components/Imodels';


interface Condomino {
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

export const useCondominosStore = defineStore('condominosStore', {
  state: (): CondominosState => ({
    condominos: [
      {
        conjunto: '23',
        especialidade: 'direito',
        locatario: ['renan almeida', 'Bruno silva'],
        interfone: 'sim',
        proprietario: 'raimundo',
        telefone: '91999815499',
        encomendas: [
          {
            id: 1,
            data: '23/02/2023',
            hora: '08:00',
            conjunto: '23',
            destinatario: 'renan',
            remetente: 'pedro',
            conteudo: '3 caixas',
            empresa: 'avon',
            tipo: 'interno'
          },
          {
            id: 2,
            data: '24/02/2023',
            hora: '08:00',
            conjunto: '23',
            destinatario: 'renan',
            conteudo: '3 caixas',
            notaFiscal: '785452',
            tipo: 'sedex'
          }
        ],
        visitantes: []
      },
      {
        conjunto: '24',
        especialidade: 'Psicologia',
        locatario: ['Augusto cezar', ' Fabio Junior'],
        interfone: 'não',
        proprietario: 'Augusto',
        telefone: '91999896678',
        encomendas: [
          {
            id: 3,
            data: '24/02/2023',
            hora: '09:00',
            conjunto: '24',
            destinatario: 'augusto',
            conteudo: '3 caixas',
            notaFiscal: '785452',
            tipo: 'sedex'
          },
          {
            id: 4,
            data: '25/01/2023',
            hora: '10:55',
            conjunto: '24',
            destinatario: 'Bruno',
            conteudo: '1 caixa',
            tipo: 'externo',
            recebedor: 'Paulo',
            local: 'belem',
          }
        ],
        visitantes: []
      },
    ],


  }),
  actions: {

    adicionarEncomendaACondomino(numeroConjunto: string, encomenda: Delivery) {
      const condomino = this.condominos.find(condomino => condomino.conjunto === numeroConjunto);

      if (condomino) {

        condomino.encomendas.push(encomenda);
        return true;

      } else {
        return false;
      }

    },

    adicionarLocatarioACondomino(numeroConjunto: string, locatario: string) {
      const condomino = this.condominos.find(condomino => condomino.conjunto === numeroConjunto);

      if (condomino) {
        // Verifica se o locatário já existe
        if (!condomino.locatario.includes(locatario)) {
          condomino.locatario.push(locatario);
          return true;
        } else {
          console.error(`Este locatário já existe para o condomínio.`);
          return false;
        }
      } else {
        console.error(`Condomínio não encontrado.`);
        return false;
      }
    },

    adicionarVisitanteACondomino(numeroConjunto: string, visitante: string) {
      const condomino = this.condominos.find(condomino => condomino.conjunto === numeroConjunto);

      if (condomino) {
        // Verifica se o visitante já existe
        if (!condomino.visitantes.includes(visitante)) {
          condomino.visitantes.push(visitante);
          return true;
        } else {
          console.error(`Este visitante já existe para o condomínio.`);
          return false;
        }
      } else {
        console.error(`Condomínio não encontrado.`);
        return false;
      }
    },
    deletarEncomenda(id: number) {
      this.condominos.forEach(condomino => {
        const index = condomino.encomendas.findIndex(encomenda => encomenda.id === id);
        if (index !== -1) {
          condomino.encomendas.splice(index, 1);
        }
      });
    },
    atualizarEncomenda(id: number, encomendaEditada: Delivery) {
      this.condominos.forEach(condomino => {
        const encomendaIndex = condomino.encomendas.findIndex(encomenda => encomenda.id === id);
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
        return total + condomino.encomendas.filter(encomenda => encomenda.tipo === 'interno').length;
      }, 0);
    },
    getQuantidadeEncomendasSedex(): number {
      return this.condominos.reduce((total, condomino) => {
        return total + condomino.encomendas.filter(encomenda => encomenda.tipo === 'sedex').length;
      }, 0);
    },
    getQuantidadeEncomendasExterno(): number {
      return this.condominos.reduce((total, condomino) => {
        return total + condomino.encomendas.filter(encomenda => encomenda.tipo === 'externo').length;
      }, 0);
    },
  },



});
