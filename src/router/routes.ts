

const routes = [
  {
    path: '/usuario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/usuario',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
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
        path: 'Cadastro de Encomendas',
        name: 'CadastroDeEncomendas',
        component: () => import('pages/CadastroEncomendasPage.vue'),
      },
      {
        path: 'agua',
        name: 'agua',
        component: () => import('pages/CadastroLeituraDeAgua.vue'),
      },
      {
        path: 'Lista de Andares',
        name: 'listaDeAndares',
        component: () => import('pages/ListaDeAndares.vue'),
      },
      {
        path: 'Lista de Encomendas',
        name: 'listaDeEncomendas',
        component: () => import('pages/ListaDeEncomendasPage.vue'),
      },
      {
        path: 'Cards Encomendas',
        name: 'cardsEncomendas',
        component: () => import('pages/CardsButaoPage.vue'),
      },
      {
        path: 'Dar baixa',
        name: 'baixa',
        component: () => import('pages/BaixaPage.vue'),
      },
      {
        path: '/deletar-encomenda/:id',
        component: () => import('pages/DeletarEncomenda.vue'),
      },
      {
        path: '/editar-encomenda/:id',
        component: () => import('pages/AtualizarEncomenda.vue'),
      },



    ]

  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }]

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
