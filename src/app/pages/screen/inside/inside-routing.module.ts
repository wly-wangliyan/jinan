import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsideComponent } from './inside.component';

const routes: Routes = [
  {
    path: '', component: InsideComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule { }
