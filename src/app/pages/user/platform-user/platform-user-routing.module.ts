import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlatformUserComponent} from './platform-user.component';

const routes: Routes = [
  {
    path: '', component: PlatformUserComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformUserRoutingModule {
}
