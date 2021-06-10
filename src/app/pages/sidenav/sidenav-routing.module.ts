import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidenavPage } from './sidenav.page';

const routes: Routes = [
  {
    path: '',
    component: SidenavPage,
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('../list/list.module').then((m) => m.ListPageModule),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('../about/about.module').then((m) => m.AboutPageModule),
      },
      {
        path: 'usersettings',
        loadChildren: () =>
          import('../usersettings/usersettings.module').then(
            (m) => m.UsersettingsPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/sidenav/list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/sidenav/list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidenavPageRoutingModule {}
