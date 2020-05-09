import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"chat",
    loadChildren:() => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path:"",
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path:"**",
  //   redirectTo:'tabs/message'
  // },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },  {
    path: 'addfriends',
    loadChildren: () => import('./pages/addfriends/addfriends.module').then( m => m.AddfriendsPageModule)
  },


  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
