import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HotspotRoutingModule} from './hotspot-routing.module';
import {HotspotComponent} from './hotspot.component';
import {ViolationStatisticsComponent} from './components/violation-statistics/violation-statistics.component';
import {TrafficControllerViolationComponent} from './components/traffic-controller-violation/traffic-controller-violation.component';
import {InspectionLinkageComponent} from './components/inspection-linkage/inspection-linkage.component';
import {DishonestPersonComponent} from './components/dishonest-person/dishonest-person.component';
import {HotlineComponent} from './components/hotline/hotline.component';
import {ComplaintTypesComponent} from './components/complaint-types/complaint-types.component';
import {ComplaintRankingComponent} from './components/complaint-ranking/complaint-ranking.component';
import {CarouselMapComponent} from './components/carousel-map/carousel-map.component';
import {ShareModule} from '../../../share/share.module';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';


@NgModule({
  declarations: [HotspotComponent, ViolationStatisticsComponent, TrafficControllerViolationComponent, InspectionLinkageComponent, DishonestPersonComponent, HotlineComponent, ComplaintTypesComponent, ComplaintRankingComponent, CarouselMapComponent],
  imports: [
    CommonModule,
    HotspotRoutingModule,
    ShareModule,
    NzCarouselModule,
  ]
})
export class HotspotModule {
}
