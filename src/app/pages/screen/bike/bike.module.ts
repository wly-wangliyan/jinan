import { ShareModule } from '../../../share/share.module';
import { BikeRoutingModule } from './bike-routing.module';
import { NgModule } from '@angular/core';
import { BikeComponent } from './bike.component';
import { BicycleRecordComponent } from './bicycle-record/bicycle-record.component';
import { BicycleTypesComparisonComponent } from './bicycle-types-comparison/bicycle-types-comparison.component';
import { BicycleUsageComponent } from './bicycle-usage/bicycle-usage.component';
import { BikeHttpService } from './bike-http.service';
import { BicycleTurnoverRateComponent } from './bicycle-turnover-rate/bicycle-turnover-rate.component';
import { FullBicycleAxisComponent } from './common-component/full-bicycle-axis/full-bicycle-axis.component';
import { FullBicycleBarComponent } from './common-component/full-bicycle-bar/full-bicycle-bar.component';
import { BicycleAreaNumComponent } from './bicycle-area-num/bicycle-area-num.component';
import { BicycleInspectionResultComponent } from './bicycle-inspection-result/bicycle-inspection-result.component';
import { BicycleAverageUtilizationComponent } from './bicycle-average-utilization/bicycle-average-utilization.component';
import { AreaBicycleOverviewModalComponent } from './common-component/area-bicycle-overview-modal/area-bicycle-overview-modal.component';
import { FullBicycleInfoTableComponent } from './common-component/full-bicycle-info-table/full-bicycle-info-table.component';
import { FullCompanyTypePipe } from './pipes/full-screen-bicycle.pipe';
import { HeatMapLevelComponent } from './common-component/heat-map-level/heat-map-level.component';

@NgModule({
  declarations: [
    BikeComponent,
    BicycleRecordComponent,
    BicycleTypesComparisonComponent,
    BicycleUsageComponent,
    BicycleTurnoverRateComponent,
    FullBicycleAxisComponent,
    FullBicycleBarComponent,
    BicycleAreaNumComponent,
    BicycleInspectionResultComponent,
    BicycleAverageUtilizationComponent,
    AreaBicycleOverviewModalComponent,
    FullBicycleInfoTableComponent,

    FullCompanyTypePipe,

    HeatMapLevelComponent],
  imports: [
    ShareModule,
    BikeRoutingModule
  ],
  exports: [FullCompanyTypePipe],
  providers: [BikeHttpService]
})
export class BikeModule { }
