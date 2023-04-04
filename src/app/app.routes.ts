import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path:'',
        pathMatch:'full',
        redirectTo:'home'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'evenements',
        loadComponent: () =>
          import('./pages/evenements/evenements.page').then(
            (m) => m.EvenementsPage
          ),
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./pages/articles/articles.page').then((m) => m.ArticlesPage),
      },
      {
        path: 'options',
        loadComponent: () =>
          import('./pages/options/options.page').then((m) => m.OptionsPage),
      },
    ],
  },
];
