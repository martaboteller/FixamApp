import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'first',
        loadChildren: () =>
          import('./first/first.module').then((m) => m.FirstPageModule),
      },
      {
        path: 'usersettings',
        loadChildren: () =>
          import('./usersettings/usersettings.module').then(
            (m) => m.UsersettingsPageModule
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./about/about.module').then((m) => m.AboutPageModule),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/menu/first',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
