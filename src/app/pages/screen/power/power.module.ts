import { ShareModule } from '../../../share/share.module';
import { PowerRoutingModule } from './power-routing.module';
import { NgModule } from '@angular/core';
import { PowerComponent } from './power.component';
import { PowerTotalInfoComponent } from './power-total-info/power-total-info.component';
import { ChargingAmountComponent } from './charging-amount/charging-amount.component';
import { ChargingPileComponent } from './charging-pile/charging-pile.component';
import { ChargingAllowanceNumberComponent } from './charging-allowance-number/charging-allowance-number.component';
import { ChargingSubsidyVehicleComponent } from './charging-subsidy-vehicle/charging-subsidy-vehicle.component';
import { DeviceOverviewComponent } from './device-overview/device-overview.component';
import { OverviewModalComponent } from './overview-modal/overview-modal.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PowerHttpService } from './power-http.service';

@NgModule({
  declarations: [
    PowerComponent,
    PowerTotalInfoComponent,
    ChargingAmountComponent,
    ChargingPileComponent,
    ChargingAllowanceNumberComponent,
    ChargingSubsidyVehicleComponent,
    DeviceOverviewComponent,
    OverviewModalComponent],
  imports: [
    ShareModule,
    PowerRoutingModule,
    NzSelectModule
  ],
  providers: [PowerHttpService]
})
export class PowerModule { }
