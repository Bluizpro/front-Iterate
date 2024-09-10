// retirada-chave.ts
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
      if (
        !this.estadoChaves.find(
          (c: { conjunto: string }) => c.conjunto === chave.conjunto
        )
      ) {
        this.estadoChaves = [...this.estadoChaves, chave];
      } else {
        console.error(`Chave ${chave.conjunto} já existe`);
      }
    },
    retirarChave(chave: Chave) {
      const index = this.estadoChaves.findIndex(
        (c: { conjunto: string }) => c.conjunto === chave.conjunto
      );
      if (index !== -1) {
        this.estadoChaves = this.estadoChaves.map((c: any, i: any) =>
          i === index ? { ...c, disponivel: false } : c
        );
        console.log(`Chave ${chave.conjunto} retirada`);
      } else {
        console.error(`Chave ${chave.conjunto} não encontrada`);
      }
    },
  },
});
