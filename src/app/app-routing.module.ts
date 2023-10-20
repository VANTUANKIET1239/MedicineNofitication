import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'add-medicine',
    loadChildren: () => import('./add-medicine/add-medicine.module').then( m => m.AddMedicinePageModule)
  },

  {
    path: 'detail-news',
    loadChildren: () => import('./detail-news/detail-news.module').then( m => m.DetailNewsPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },  {
    path: 'add-appointment',
    loadChildren: () => import('./add-appointment/add-appointment.module').then( m => m.AddAppointmentPageModule)
  },
  {
    path: 'edit-appointment',
    loadChildren: () => import('./edit-appointment/edit-appointment.module').then( m => m.EditAppointmentPageModule)
  },
  {
    path: 'user-edit',
    loadChildren: () => import('./user-edit/user-edit/user-edit.module').then( m => m.UserEditPageModule)
  },







  // add-medicine
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
   declarations: [

  ]
})
export class AppRoutingModule {}
