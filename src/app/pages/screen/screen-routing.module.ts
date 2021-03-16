import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScreenComponent} from './screen.component';
import {AuthGuardService} from '../../core/auth-guard.service';

const routes: Routes = [{
  path: '', component: ScreenComponent, children: [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {
      path: 'home', canActivate: [AuthGuardService], loadChildren: () => import('./home/home.module')
        .then(m => m.HomeModule)
    },
    {
      path: 'inside', canLoad: [AuthGuardService],
      loadChildren: () => import('./inside/inside.module')
        .then(m => m.InsideModule)
    },
    {
      path: 'outside', canLoad: [AuthGuardService],
      loadChildren: () => import('./outside/outside.module')
        .then(m => m.OutsideModule)
    },
    {
      path: 'bike', canLoad: [AuthGuardService],
      loadChildren: () => import('./bike/bike.module')
        .then(m => m.BikeModule)
    },
    {
      path: 'power', canLoad: [AuthGuardService],
      loadChildren: () => import('./power/power.module')
        .then(m => m.PowerModule)
    },
    {
      path: 'security', canLoad: [AuthGuardService],
      loadChildren: () => import('./public-security/public-security.module')
        .then(m => m.PublicSecurityModule)
    },
    {
      path: 'hotspot', canLoad: [AuthGuardService],
      loadChildren: () => import('./hotspot/hotspot.module')
        .then(m => m.HotspotModule)
    },
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreenRoutingModule {
}
