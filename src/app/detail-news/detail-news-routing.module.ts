import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailNewsPage } from './detail-news.page';

const routes: Routes = [
  {
    path: '', 
    component: DetailNewsPage,
    children:[
    {
      path: ':id',
      loadChildren: () => import('./detail-news.module').then( m => m.DetailNewsPageModule)
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailNewsPageRoutingModule {}
