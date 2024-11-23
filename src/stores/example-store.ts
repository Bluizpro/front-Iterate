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
        usuario: 'Lohane',
        senha: '123456',
      },
    ] as Usuario[],
  }),

  actions: {
    async fazerLogin(): Promise<Usuario | null> {
      const usuario = this.usuario.toLowerCase();
      const senha = this.senha;

      const usuarioValido = this.listaDeUsuario.find(
        (user: { usuario: string; senha: unknown }) =>
          user.usuario.toLowerCase() === usuario && user.senha === senha
      );

      if (usuarioValido) {
        this.nomeUsuario = usuarioValido.usuario;
        this.usuarioLogado = usuarioValido.usuario;
        localStorage.setItem('usuarioLogado', usuarioValido.usuario);
        this.limparCamposFormulario();
        return usuarioValido;
      } else {
        return null;
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
