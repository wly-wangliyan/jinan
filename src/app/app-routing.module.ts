import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './core/auth-guard.service';
import {MainComponent} from './pages/main/main.component';

const routes: Routes = [
  // {
  //   path: '', component: AppComponent, children: [
  //
  //   ]
  // },
  // {path: '', pathMatch: 'full', redirectTo: '/guide'},
  {
    path: 'login', canLoad: [AuthGuardService],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '', component: MainComponent, canActivate: [AuthGuardService], children: [
      {path: '', redirectTo: 'guide', pathMatch: 'full'},
      {
        path: 'guide', canLoad: [AuthGuardService], loadChildren: () => import('./pages/guide/guide.module')
          .then(m => m.GuideModule)
      },
      {
        path: 'user', canLoad: [AuthGuardService], loadChildren: () => import('./pages/user/user.module')
          .then(m => m.UserModule)
      },
      {
        path: 'screen', canLoad: [AuthGuardService], loadChildren: () => import('./pages/screen/screen.module')
          .then(m => m.ScreenModule)
      },
    ]
  },
  {path: '**', redirectTo: 'guide', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
