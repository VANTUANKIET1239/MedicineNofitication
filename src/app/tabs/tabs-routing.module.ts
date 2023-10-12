import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../MedicineManager/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'news',
        loadChildren: () => import('../news/news.module').then(m => m.NewsPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../slideshow/slideshow.module').then(m => m.SlideshowPageModule)
      },
      {
        path: 'appointment',
        loadChildren: () => import('../appointment/appointment.module').then( m => m.AppointmentPageModule)
      },
      {
        path: 'user-setting',
        loadChildren: () => import('../user-setting/user-setting.module').then( m => m.UserSettingPageModule)
      },
      {
        path: '',
        redirectTo: 'tab3',
        pathMatch: 'full'
      },

    ]
  },
  {
    path: '',
    redirectTo: 'tab3',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
