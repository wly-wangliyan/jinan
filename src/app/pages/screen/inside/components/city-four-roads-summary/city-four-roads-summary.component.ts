import { REFRESH_DURATION } from '../../../../../core/timer.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { InsideHttpService } from '../../inside-http.service';
import { isNullOrUndefined } from 'util';
import { TimerService } from '../../../../../core/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-city-four-roads-summary',
  templateUrl: './city-four-roads-summary.component.html',
  styleUrls: ['./city-four-roads-summary.component.less']
})
export class CityFourRoadsSummaryComponent implements OnInit, OnDestroy {

  public dataList: Array<RoadTypeItem> = [];

  @Output() public roadTypeClick = new EventEmitter();

  public currentData: RoadTypeItem;

  private timerSubscription: Subscription;

  constructor(private insideHttpService: InsideHttpService,
              private timerService: TimerService) {
    this.dataList = this.generateRoadTypeList();
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
  }

  ngOnInit(): void {
    this.requestData();
  }

  public ngOnDestroy(): void {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public toString(value: any): string {
    if (isNullOrUndefined(value)) {
      return '';
    }
    return String(value);
  }

  public onRoadTypeClick(data: RoadTypeItem, index: number): void {
    if (this.currentData && this.currentData.roadType !== data.roadType) {
      this.currentData.isShow = false;
    }
    this.currentData = data;
    // this.roadTypeClick.emit(data);
  }

  private requestData(): void {
    this.insideHttpService.requestCityRoadInfo().subscribe(results => {
      results.forEach(res => {
        const item = this.dataList.find(data => data.roadType === res.road_type);
        item.value = res.num;
      });
    }, err => {

    });
  }

  private generateRoadTypeList(): Array<RoadTypeItem> {
    const tempList = [];
    tempList.push(new RoadTypeItem('准停', '#81ff5d', 0, 1));
    tempList.push(new RoadTypeItem('临停', '#3473fe', 0, 4));
    tempList.push(new RoadTypeItem('限停', '#f7b500', 0, 3));
    tempList.push(new RoadTypeItem('禁停', '#ff6f6f', 0, 2));
    return tempList;
  }

}

export class RoadTypeItem {
  public name: string;
  public color: string;
  public value: number;
  public roadType: number;
  public isShow = false;

  constructor(name: string, color: string, value: number, roadType: number) {
    this.name = name;
    this.color = color;
    this.value = value;
    this.roadType = roadType;
  }

}
