import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlatformUserRoutingModule} from './platform-user-routing.module';
import {CreatePlatformUserComponent} from './create-platform-user/create-platform-user.component';

import {PlatformUserComponent} from './platform-user.component';
import {ShareModule} from '../../../share/share.module';




@NgModule({
  declarations: [CreatePlatformUserComponent, PlatformUserComponent],
  exports: [
    CreatePlatformUserComponent
  ],
    imports: [
        CommonModule,
        PlatformUserRoutingModule,
        ShareModule,
    ]
})
export class PlatformUserModule {
}
