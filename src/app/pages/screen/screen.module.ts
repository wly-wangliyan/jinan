import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ScreenRoutingModule} from './screen-routing.module';
import {ScreenComponent} from './screen.component';
import {ShareModule} from '../../share/share.module';


@NgModule({
  declarations: [ScreenComponent],
  imports: [
    CommonModule,
    ScreenRoutingModule,
    ShareModule,
  ]
})
export class ScreenModule {
}
