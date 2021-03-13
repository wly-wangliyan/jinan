import { REFRESH_DURATION } from '../../../../../core/timer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InsideHttpService, ParkingDynamicEntity } from '../../inside-http.service';
import { isNullOrUndefined } from 'util';
import { TimerService } from '../../../../../core/timer.service';
import { Subject, Subscription } from 'rxjs';
import { OutsideHttpService, ParkingEntity, ParkingParams } from 'src/app/pages/screen/outside/outside-http.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-information-overview',
  templateUrl: './information-overview.component.html',
  styleUrls: ['./information-overview.component.less']
})
export class InformationOverviewComponent implements OnInit, OnDestroy {

  public parkingData: ParkingDynamicEntity = new ParkingDynamicEntity();

  public selectedParkingId;

  public searchParams: ParkingParams = new ParkingParams();

  public parkingList: Array<ParkingEntity> = [];

  public searchStream = new Subject();

  private linkUrl = '';

  private timerSubscription: Subscription;

  constructor(private insideHttpService: InsideHttpService,
    private timerService: TimerService,
    private outsideHttpService: OutsideHttpService) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
  }

  ngOnInit(): void {
    this.requestData();
    // this.requestParkingList();
    this.searchStream.next();
    this.searchStream.pipe(debounceTime(500)).subscribe((parkingName: string) => {
      this.searchParams.parking_name = parkingName;
      this.requestParkingList();
    });
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

  public requestData(): void {
    this.insideHttpService.requestParkingDynamicInfo(this.selectedParkingId).subscribe(result => {
      this.parkingData = result;
    });
  }

  // 选择停车场
  public onSelectParking(event): void {
    this.requestData();
  }

  // 筛选框下拉到底部
  public onScrollToBottom() {
    if (this.linkUrl) {
      this.outsideHttpService.continueRequestParkingInfoList(this.linkUrl).subscribe(data => {
        this.parkingList = [...this.parkingList, ...data.results];
        this.linkUrl = data.linkUrl;
      })
    }
  }

  // 筛选框文本发生变化
  public onSearchParking(event: any) {
    this.searchStream.next(event);
  }

  public requestParkingList() {
    this.outsideHttpService.requestParkingInfoList(this.searchParams).subscribe(data => {
      this.parkingList = data.results;
      this.linkUrl = data.linkUrl;
    })
  }
}
