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

interface Usuario {
  usuario: string;
  senha: string;
}

export const usuarioStore = defineStore('usuario', {
  state: () => ({
    nomeUsuario: '',
    usuario: '',
    senha: '',
    usuarioLogado: localStorage.getItem('usuarioLogado') || '', // Carregar o usuário logado do localStorage

    listaDeUsuario: [
      {
        usuario: 'renan',
        senha: '123456',
      },
      {
        usuario: 'bruno',
        senha: '123456',
      },
      {
        usuario: 'augusto',
        senha: '123456',
      },
      {
        usuario: 'rafael',
        senha: '123456',
      },
      {
        usuario: 'junior',
        senha: '123456',
      },
      {
        usuario: 'marcos',
        senha: '123456',
      },
      {
        usuario: 'miriam',
        senha: '123456',
      },
    ] as Usuario[],
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
        this.usuarioLogado = usuario;
        localStorage.setItem('usuarioLogado', usuario); // Salvar o usuário logado no localStorage
        this.limparCamposFormulario();
        return true; // Login bem-sucedido
      } else {
        return false; // Login falhou
      }
    },
    limparCamposFormulario() {
      // Limpar os campos do formulário
      this.usuario = '';
      this.senha = '';
    },
    fazerLogout() {
      // Limpar o usuário logado
      this.usuarioLogado = '';
      localStorage.removeItem('usuarioLogado'); // Remover o usuário logado do localStorage
    },
  },
});
