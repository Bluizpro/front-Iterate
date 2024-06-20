import { defineStore } from 'pinia';

export const useAssinaturaStore = defineStore({
  id: 'assinatura',
  state: () => ({
    assinaturas: {} as Record<string, string>,
    currentAssinatura: null as string | null,
  }),
  actions: {
    salvarAssinatura(assinatura: string) {
      const chave = this.gerarChaveUnica();
      this.assinaturas[chave] = assinatura;
      this.currentAssinatura = assinatura;
    },
    gerarChaveUnica() {
      // Implementação para gerar uma chave única, por exemplo:
      return `assinatura-${Date.now()}`;
    },
  },
});
