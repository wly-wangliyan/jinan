import {ShareModule} from './../../share/share.module';
import {LoginRoutingModule} from './login-routing.module';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';

@NgModule({
  declarations: [LoginComponent],

  imports: [
    LoginRoutingModule,
    ShareModule,
  ]
})
export class LoginModule {
}
