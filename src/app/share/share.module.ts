import {MagicNumberItemComponent} from './components/magic-number-item/magic-number-item.component';
import {MagicNumberComponent} from './components/magic-number/magic-number.component';
import {ZMaxLengthPipe} from './pipes/z-max-length.pipe';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxEchartsModule} from 'ngx-echarts';
import {MainHeaderComponent} from './components/main-header/main-header.component';
import {ParkingTypeComponent} from './components/parking-type/parking-type.component';
import {ExpandedMenuComponent} from './components/expanded-menu/expanded-menu.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {RouterModule} from '@angular/router';
import {CrumbComponent} from './components/crumb/crumb.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {ZPlaceholderPipe} from './pipes/z-placeholder.pipe';
import {FormBoxComponent} from './components/form-box/form-box.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {ConfirmationBoxComponent} from './components/confirmation-box/confirmation-box.component';
import {PromptBoxComponent} from './components/prompt-box/prompt-box.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {IgnoreSpaceDirective} from './directives/ignore-space.directive';
import {Http500PageComponent} from './components/http-500-page/http-500-page.component';
import {Http403PageComponent} from './components/http-403-page/http-403-page.component';
import {UserTypePipe} from "./pipes/user-type.pipe";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NzMenuModule,
    RouterModule,
    NzTableModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
  ],
  declarations: [
    MainHeaderComponent,
    ZMaxLengthPipe,
    MagicNumberComponent,
    MagicNumberItemComponent,
    ParkingTypeComponent,
    ExpandedMenuComponent,
    CrumbComponent,
    FormBoxComponent,
    ConfirmationBoxComponent,
    PromptBoxComponent,
    Http500PageComponent,
    Http403PageComponent,

    IgnoreSpaceDirective,

    ZPlaceholderPipe,
    UserTypePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NzTableModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,

    MainHeaderComponent,
    ZMaxLengthPipe,
    MagicNumberComponent,
    MagicNumberItemComponent,
    ParkingTypeComponent,
    ExpandedMenuComponent,
    CrumbComponent,
    FormBoxComponent,
    ConfirmationBoxComponent,
    PromptBoxComponent,
    Http500PageComponent,
    Http403PageComponent,

    IgnoreSpaceDirective,

    ZPlaceholderPipe,
    UserTypePipe
  ],
})
export class ShareModule {
}
