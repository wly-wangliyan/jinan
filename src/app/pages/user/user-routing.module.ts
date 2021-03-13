import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {AuthGuardService} from '../../core/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: UserComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'platform-user'},
      {
        path: 'platform-user',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./platform-user/platform-user.module')
          .then(m => m.PlatformUserModule)
      },
      {
        path: 'system-user',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./system-user/system-user.module')
          .then(m => m.SystemUserModule)
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
