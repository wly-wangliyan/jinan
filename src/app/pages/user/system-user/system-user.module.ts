import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemUserRoutingModule } from './system-user-routing.module';
import {SystemUserComponent} from "./system-user.component";
import {ShareModule} from "../../../share/share.module";
import { CreateSystemUserComponent } from './create-system-user/create-system-user.component';


@NgModule({
  declarations: [SystemUserComponent, CreateSystemUserComponent],
  imports: [
    CommonModule,
    SystemUserRoutingModule,
    ShareModule
  ]
})
export class SystemUserModule { }
