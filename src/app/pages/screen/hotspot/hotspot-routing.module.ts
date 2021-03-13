import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HotspotComponent} from './hotspot.component';

const routes: Routes = [
  {
    path: '', component: HotspotComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotspotRoutingModule {
}
