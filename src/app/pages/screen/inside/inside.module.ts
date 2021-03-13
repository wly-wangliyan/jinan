import { InsideRoutingModule } from './inside-routing.module';
import { NgModule } from '@angular/core';
import { InsideComponent } from './inside.component';
import { CityFourRoadsSummaryComponent } from './components/city-four-roads-summary/city-four-roads-summary.component';
import { DistrictRoadTypeSummaryComponent } from './components/district-road-type-summary/district-road-type-summary.component';
import { ParkingAssessmentScoreTableComponent } from './components/parking-assessment-score-table/parking-assessment-score-table.component';
import { InformationOverviewComponent } from './components/information-overview/information-overview.component';
import { ParkingHourAndArrearsRateComponent } from './components/parking-hour-and-arrears-rate/parking-hour-and-arrears-rate.component';
import { ParkingTurnoverRateAndUtilizationRateComponent } from './components/parking-turnover-rate-and-utilization-rate/parking-turnover-rate-and-utilization-rate.component';
import { ShareModule } from '../../../share/share.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ItemHeaderComponent } from './components/item-header/item-header.component';
import { RoadModalComponent } from './components/road-modal/road-modal.component';

@NgModule({
  declarations: [
    InsideComponent,
    CityFourRoadsSummaryComponent,
    DistrictRoadTypeSummaryComponent,
    ParkingAssessmentScoreTableComponent,
    InformationOverviewComponent,
    ParkingHourAndArrearsRateComponent,
    ParkingTurnoverRateAndUtilizationRateComponent,
    ItemHeaderComponent,
    RoadModalComponent,
  ],
  imports: [
    ShareModule,
    NzButtonModule,
    NzSelectModule,
    InsideRoutingModule
  ]
})
export class InsideModule {
}
