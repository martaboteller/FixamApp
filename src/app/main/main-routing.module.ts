import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'nav',
    component: MainPage,
    children: [
      {
        path: 'about',
        loadChildren: () =>
          import('../about/about.module').then((m) => m.AboutPageModule),
      },
      {
        path: '',
        redirectTo: '/main/about',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/main/about',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
