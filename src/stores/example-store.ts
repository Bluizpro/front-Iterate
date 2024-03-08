import { defineStore } from 'pinia';

export const useStore = defineStore('formularioStore', {
  state: () => ({
    formularioAtual: '',
  }),
  actions: {
    setFormularioAtual(formulario: string) {
      this.formularioAtual = formulario;
    },
    resetFormularioAtual() {
      this.formularioAtual = '';
    },
  },
});

export const usuarioStore = defineStore('usuario', {
  state: () => ({
    nomeUsuario: '',
    usuario: '',
    senha: '',
    usuarioLogado: '', // Altere null para string vazia

    listaDeUsuario: [
      {
        usuario: 'renan',
        senha: '123456'
      },
      {
        usuario: 'bruno',
        senha: '123456'
      },
      {
        usuario: 'augusto',
        senha: '123456'
      },
      {
        usuario: 'junior',
        senha: '123456'
      },
      {
        usuario: 'khalil',
        senha: '123456'
      }
    ]
  }),

  actions: {
    async fazerLogin(): Promise<boolean> {
      const usuario = this.usuario;
      const senha = this.senha;

      const usuarioValido = this.listaDeUsuario.find(
        (user) => user.usuario === usuario && user.senha === senha
      );

      if (usuarioValido) {
        this.nomeUsuario = usuario;
        this.usuarioLogado = usuario; // Adicione esta linha
        this.limparCamposFormulario();
        return true; // Login bem-sucedido
      } else {
        return false; // Login falhou
      }
    },
    limparCamposFormulario() {
      // Limpar os campos do formulário
      (this as { [key: string]: any })['usuario'] = '';
      (this as { [key: string]: any })['senha'] = '';
    }
  },
});
