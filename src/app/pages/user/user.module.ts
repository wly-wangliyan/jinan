import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {ShareModule} from '../../share/share.module';
import {NzButtonModule} from 'ng-zorro-antd/button';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ShareModule,
    NzButtonModule
  ]
})
export class UserModule {
}
