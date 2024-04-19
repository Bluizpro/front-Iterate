// storage/assinatura.ts
import { defineStore } from 'pinia';

export const useAssinaturaStore = defineStore({
  id: 'assinatura',
  state: () => ({
    assinaturas: {} as Record<string, string | null>,
  }),
  actions: {
    salvarAssinatura(chave: string, assinatura: string) {
      // Cria uma URL de objeto a partir dos dados da assinatura
      this.assinaturas[chave] = URL.createObjectURL(
        this._base64ToBlob(assinatura)
      );
    },
    _base64ToBlob(base64: string) {
      if (base64) {
        const binaryString = window.atob(base64.split(',')[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: 'image/png' });
      } else {
        console.log('base64 é undefined');
        return new Blob([], { type: 'image/png' });
      }
    },
  },
});
