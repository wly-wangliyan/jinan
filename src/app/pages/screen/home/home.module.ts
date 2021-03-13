import { NzSelectModule } from 'ng-zorro-antd/select';
import { LeftOneComponent } from './components/left-one/left-one.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { ShareModule } from '../../../share/share.module';
import { RightTwoComponent } from './components/right-two/right-two.component';
import { LeftTwoComponent } from './components/left-two/left-two.component';
import { LeftThreeComponent } from './components/left-three/left-three.component';
import { RightOneComponent } from './components/right-one/right-one.component';
import { BottomPanelComponent } from './components/bottom-panel/bottom-panel.component';
import { MapModalComponent } from './components/map-modal/map-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    LeftOneComponent,
    RightTwoComponent,
    LeftTwoComponent,
    LeftThreeComponent,
    RightOneComponent,
    BottomPanelComponent,
    MapModalComponent,
  ],
  imports: [
    ShareModule,
    HomeRoutingModule,
    NzSelectModule
  ]
})
export class HomeModule {
}
