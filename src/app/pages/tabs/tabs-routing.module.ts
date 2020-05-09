import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

const routes: Routes = [
  {
    path:'tabs',
    component:TabsPage,
    children:[
      {
        path:"",
        redirectTo:'message'
      },
      {
        path: 'message',
        loadChildren: () => import('../message/message.module').then( m => m.MessagePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('../contact/contact.module').then( m => m.ContactPageModule)
      },
    ]
  },
  {
    path:"",
    redirectTo:'tabs'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
