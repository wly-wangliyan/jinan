import { NgModule } from '@angular/core';
import { PublicSecurityComponent } from './public-security.component';
import { ShareModule } from '../../../share/share.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PublicSecurityRoutingModule } from './public-security-routing.module';
import { LeftOneComponent } from './components/left-one/left-one.component';
import { LeftTwoComponent } from './components/left-two/left-two.component';
import { LeftThreeComponent } from './components/left-three/left-three.component';
import { LeftFourComponent } from './components/left-four/left-four.component';
import { RightOneComponent } from './components/right-one/right-one.component';
import { RightTwoComponent } from './components/right-two/right-two.component';
import { RightThreeComponent } from './components/right-three/right-three.component';
import { RightFourComponent } from './components/right-four/right-four.component';

@NgModule({
  declarations: [
    PublicSecurityComponent,
    LeftOneComponent,
    LeftTwoComponent,
    LeftThreeComponent,
    LeftFourComponent,
    RightOneComponent,
    RightTwoComponent,
    RightThreeComponent,
    RightFourComponent
  ],
  imports: [
    ShareModule,
    NzButtonModule,
    NzSelectModule,
    PublicSecurityRoutingModule
  ]
})
export class PublicSecurityModule {
}
