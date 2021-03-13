import { ShareModule } from '../../../share/share.module';
import { OutsideRoutingModule } from './outside-routing.module';
import { NgModule } from '@angular/core';
import { OutsideComponent } from './outside.component';
import { ParkingInfoComponent } from './components/parking-info/parking-info.component';
import { BillingTypeProportionComponent } from './components/billing-type-proportion/billing-type-proportion.component';
import { ParkingAccessRankingComponent } from './components/parking-access-ranking/parking-access-ranking.component';
import { BerthBookingComponent } from './components/berth-booking/berth-booking.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { OfflineWarningComponent } from './components/offline-warning/offline-warning.component';
import { ParkingMonitorComponent } from './components/parking-monitor/parking-monitor.component';

@NgModule({
  declarations: [OutsideComponent, ParkingInfoComponent, BillingTypeProportionComponent, ParkingAccessRankingComponent, BerthBookingComponent, OfflineWarningComponent, ParkingMonitorComponent],
  imports: [
    ShareModule,
    NzSelectModule,
    OutsideRoutingModule
  ]
})
export class OutsideModule {
}
