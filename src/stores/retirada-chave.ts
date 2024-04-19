// retirada-chave.ts
import { defineStore } from 'pinia';

interface Chave {
  conjunto: string;
  data: string;
  hora: string;
  usuario: string;
  assinatura: string;
  disponivel: boolean; // Adicione este campo
}

export const useRetiradaChaveStore = defineStore({
  id: 'retiradaChave',
  state: () => ({
    estadoChaves: [] as Chave[], // renomeado de 'chaves' para 'estadoChaves'
  }),
  // Em retirada-chave.ts
  getters: {
    isKeyAvailable: (state) => (key: string) => {
      const chave = state.estadoChaves.find((c) => c.conjunto === key);
      // Se a chave existir e estiver marcada como não disponível, retorne false
      if (chave && !chave.disponivel) {
        return false;
      }
      // Caso contrário, retorne true
      return true;
    },
  },

  actions: {
    addChave(chave: Chave) {
      this.estadoChaves.push(chave);
    },

    retirarChave(chave: Chave) {
      const index = this.estadoChaves.findIndex(
        (c) => c.conjunto === chave.conjunto
      );
      if (index !== -1) {
        this.estadoChaves[index].disponivel = false;
        console.log(`Chave ${chave.conjunto} retirada`);
      }
    },
  },
});
