const routes = [
  {
    path: '/usuario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/AnotacoesPage.vue'),
      },
      {
        path: 'cadastro',
        name: 'cadastro',
        component: () => import('pages/CadastroPage.vue'),
      },
      {
        path: 'pesquisa',
        name: 'pesquisa',
        component: () => import('pages/PesquisaPage.vue'),
      },
      {
        path: 'Pessoas',
        name: 'Pessoas',
        component: () => import('pages/CadastroPessoasPage.vue'),
      },
      {
        path: 'Cadastro-de-Encomendas',
        name: 'CadastroDeEncomendas',
        component: () => import('pages/CadastroEncomendasPage.vue'),
      },
      {
        path: 'agua',
        name: 'agua',
        component: () => import('pages/CadastroLeituraDeAgua.vue'),
      },
      {
        path: 'Lista-de-Andares',
        name: 'listaDeAndares',
        component: () => import('pages/ListaDeAndares.vue'),
      },
      {
        path: 'Lista-de-Encomendas',
        name: 'listaDeEncomendas',
        component: () => import('pages/ListaDeEncomendasPage.vue'),
      },
      {
        path: 'Cards-Encomendas',
        name: 'cardsEncomendas',
        component: () => import('pages/CardsButaoPage.vue'),
      },
      {
        path: 'Dar-baixa',
        name: 'baixa',
        component: () => import('pages/BaixaPage.vue'),
      },

      {
        path: 'Relatorio',
        name: 'relatorio',
        component: () => import('pages/RelatorioPage.vue'),
      },
      {
        path: 'Anotacao',
        name: 'anotacao',
        component: () => import('pages/AnotacoesPage.vue'),
      },
      {
        path: 'Craviculario',
        name: 'craviculario',
        component: () => import('pages/CravicularioPage.vue'),
      },
      {
        path: 'deletar-encomenda/:id?',
        name: 'deletarEncomenda',
        component: () => import('pages/DeletarEncomenda.vue'),
      },
      {
        path: 'editar-encomenda/:id?',
        name: 'editarEncomenda',
        component: () => import('pages/AtualizarEncomenda.vue'),
      },
      {
        path: 'retirar-chaves/:key',
        name: 'RetiradaChaves',
        component: () =>
          import('src/components/Formulario/FormRetiraChave.vue'),
      },
      {
        path: 'lista-chave/:selectedKeys?',
        name: 'listaChave',
        component: () => import('pages/ListaChaveRetiradaPage.vue'),
      },
      {
        path: '/baixa-chave/:conjunto',
        name: 'BaixaChave',
        component: () => import('src/components/Formulario/FormBaixaChave.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  // Always leave this as the last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
