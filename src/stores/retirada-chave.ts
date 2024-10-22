import { defineStore } from 'pinia';

interface Chave {
  conjunto: string;
  chaveSelecionada: string;
  data: string;
  hora: string;
  usuario: string;
  assinatura: string;
  disponivel: boolean;
}

export const useRetiradaChaveStore = defineStore({
  id: 'retiradaChave',
  state: () => ({
    estadoChaves: [] as Chave[],
  }),
  getters: {
    isKeyAvailable: (state) => (key: string) => {
      const chave = state.estadoChaves.find(
        (c: { conjunto: string }) => c.conjunto === key
      );
      return chave ? chave.disponivel : true; // Retorna true se a chave não for encontrada
    },
  },
  actions: {
    addChave(chave: Chave) {
      const existingChave = this.estadoChaves.find(
        (c: { conjunto: string }) => c.conjunto === chave.conjunto
      );
      if (!existingChave) {
        this.estadoChaves = [...this.estadoChaves, chave];

        // Atualizar o localStorage também
        const chavesRetiradas = JSON.parse(
          localStorage.getItem('chavesRetiradas') || '[]'
        );
        chavesRetiradas.push(chave);
        localStorage.setItem(
          'chavesRetiradas',
          JSON.stringify(chavesRetiradas)
        );

        console.log(`Chave ${chave.conjunto} adicionada`);
      } else {
        console.error(`Chave ${chave.conjunto} já existe`);
      }
    },

    retirarChave(chave: Chave) {
      const index = this.estadoChaves.findIndex(
        (c: { conjunto: string }) => c.conjunto === chave.conjunto
      );
      if (index !== -1) {
        // Atualizar o estado interno
        this.estadoChaves = this.estadoChaves.map((c: any, i: any) =>
          i === index ? { ...c, disponivel: false } : c
        );

        // Atualizar o localStorage
        let chavesRetiradas = JSON.parse(
          localStorage.getItem('chavesRetiradas') || '[]'
        );
        chavesRetiradas = chavesRetiradas.map((c: any) =>
          c.conjunto === chave.conjunto ? { ...c, disponivel: false } : c
        );
        localStorage.setItem(
          'chavesRetiradas',
          JSON.stringify(chavesRetiradas)
        );
      }
    },
  },
});
