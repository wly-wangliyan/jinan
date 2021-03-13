import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicSecurityComponent } from './public-security.component';



const routes: Routes = [
  {
    path: '', component: PublicSecurityComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicSecurityRoutingModule { }
