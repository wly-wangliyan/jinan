import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuideRoutingModule} from './guide-routing.module';
import {GuideComponent} from './guide.component';
import {RectangleButtonComponent} from './rectangle-button/rectangle-button.component';
import {ShareModule} from '../../share/share.module';


@NgModule({
  declarations: [GuideComponent, RectangleButtonComponent],
  imports: [
    CommonModule,
    GuideRoutingModule,
    ShareModule
  ]
})
export class GuideModule {
}
