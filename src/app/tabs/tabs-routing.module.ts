import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('../main/main.module').then((m) => m.MainPageModule),
      },
      {
        path: 'map',
        loadChildren: () =>
          import('../map/map.module').then((m) => m.Tab2PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/main',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/main',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
