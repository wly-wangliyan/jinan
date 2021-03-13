import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {ListScrollService, RollDataItem} from '../../../../../core/list-scroll.service';
import {DynamicInfoEntity, InsideHttpService, ParkingDynamicParams} from '../../inside-http.service';
import {TimerService} from '../../../../../core/timer.service';
import {isNullOrUndefined} from 'util';

const MAX_LIST_COUNT = 9;
const ROW_HEIGHT = 48;

@Component({
  selector: 'app-parking-turnover-rate-and-utilization-rate',
  templateUrl: './parking-turnover-rate-and-utilization-rate.component.html',
  styleUrls: ['./parking-turnover-rate-and-utilization-rate.component.less'],
  providers: [ListScrollService]
})
export class ParkingTurnoverRateAndUtilizationRateComponent implements OnInit, AfterViewInit, OnDestroy {

  public currentIndex = 0; // 0 周转率 1 利用率
  public dataList: Array<RollDataItem> = [];
  private searchParams: ParkingDynamicParams = new ParkingDynamicParams();
  private newDataList: Array<DynamicInfoEntity> = [];
  private needUpdate = false; // 是否需要更新数据
  private isAppendDataOperation = false; // 是否在追加数据操作中

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(private listScrollService: ListScrollService,
              private timerService: TimerService,
              private insideHttpService: InsideHttpService) {
    this.searchParams.parking_type = 1;
    listScrollService.loadMoreData$.subscribe(() => {
      this.continueAppendData();
    });
    this.timerSubscription = timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      if (this.dataList.length > MAX_LIST_COUNT) {
        this.needUpdate = true;
      } else {
        this.requestData();
      }
    });
  }

  ngOnInit(): void {
    this.requestData();
  }

  public ngAfterViewInit() {
    if (this.dataList.length > MAX_LIST_COUNT) {
      // 列表显示不下了才需要滚动
      this.listScrollService.startScroll();
    }
  }

  public ngOnDestroy(): void {
    this.listScrollService.destroyData();
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onNameChange(index: number): void {
    this.currentIndex = index;
    this.requestData();
  }

  public rateColor(data: DynamicInfoEntity): string {
    const value = this.currentIndex === 0 ? data.parking_turnover_rate : data.parking_use_rate;
    if (isNullOrUndefined(value)) {
      return '';
    }
    switch (this.currentIndex) {
      case 0:
        if (value <= 1) {
          return '#32FFB4';
        } else if (value > 1 && value <= 1.1) {
          return '#F7B500';
        } else {
          return '#FF6F6F';
        }
      case 1:
        if (value <= 100) {
          return '#32FFB4';
        } else if (value > 100 && value <= 110) {
          return '#F7B500';
        } else {
          return '#FF6F6F';
        }
    }
  }

  private requestData(): void {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.dataSubscription = this.insideHttpService.requestDynamicInfo(this.searchParams).subscribe(results => {
      if (results.length > MAX_LIST_COUNT) {
        // 列表显示不下了才需要滚动
        this.newDataList = results.concat(results); // 延长数组元素
        // 制作为UI效果定制的数据
        const rollDataList = this.convertRollData(null, this.newDataList);
        this.dataList = rollDataList;
        this.listScrollService.initData(ROW_HEIGHT, this.scrollDiv, this.dataList);
        this.listScrollService.startScroll();
      } else {
        this.dataList = this.convertRollData(null, results);
      }
    }, err => {
      this.listScrollService.stopScroll();
    });
  }

  /* 继续追加数据 */
  private continueAppendData() {
    if (this.isAppendDataOperation) {
      return;
    }
    if (this.needUpdate) {
      // 需要更新
      this.isAppendDataOperation = true;
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.insideHttpService.requestDynamicInfo(this.searchParams).subscribe(results => {
        // 制作为UI效果定制的数据
        this.newDataList = results.concat(results); // 延长数组元素
        const rollDataList = this.convertRollData(this.dataList[this.dataList.length - 1], this.newDataList);
        rollDataList.forEach(item => {
          this.dataList.push(item);
        });
        this.needUpdate = false;
        timer(1).subscribe(() => {
          // 为了绑定数据更新提供缓冲时间
          this.isAppendDataOperation = false;
        });
      }, err => {
        this.listScrollService.stopScroll();
        timer(1).subscribe(() => {
          // 为了绑定数据更新提供缓冲时间
          this.isAppendDataOperation = false;
        });
      });
    } else {
      this.appendLocalData();
      this.isAppendDataOperation = false;
    }
  }

  private appendLocalData() {
    // 制作为UI效果定制的数据
    const rollDataList = this.convertRollData(this.dataList[this.dataList.length - 1], this.newDataList);
    rollDataList.forEach(item => {
      this.dataList.push(item);
    });
  }

  private convertRollData(lastItem: RollDataItem, newDataList: Array<DynamicInfoEntity>): Array<RollDataItem> {
    const rollDataList = [];
    for (const tempItem of newDataList) {
      lastItem = new RollDataItem(tempItem, lastItem ? !lastItem.isOdd : true);
      rollDataList.push(lastItem);
    }
    return rollDataList;
  }

  public onScrollDivMouseEnter() {
    this.listScrollService.pauseScroll();
  }

  public onScrollDivMouseLeave() {
    this.listScrollService.continueScroll();
  }
}
