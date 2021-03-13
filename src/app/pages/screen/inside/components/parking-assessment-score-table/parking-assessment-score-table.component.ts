import { ListScrollService, RollDataItem } from '../../../../../core/list-scroll.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import districts from 'src/app/pages/screen/home/map-districts';
import { OutsideHttpService, ParkingEntity, ParkingParams } from '../../../outside/outside-http.service';
import { TimerService } from '../../../../../core/timer.service';

const MAX_LIST_COUNT = 12;
const ROW_HEIGHT = 40;

@Component({
  selector: 'app-parking-assessment-score-table',
  templateUrl: './parking-assessment-score-table.component.html',
  styleUrls: ['./parking-assessment-score-table.component.less'],
  providers: [ListScrollService]
})
export class ParkingAssessmentScoreTableComponent implements OnInit, AfterViewInit, OnDestroy {

  public searchParams = new ParkingParams();
  public dataList: Array<RollDataItem> = [];
  public districts = districts;
  private isAppendDataOperation = false; // 是否在追加数据操作中
  private newDataList: Array<ParkingEntity> = [];
  private needUpdate = false; // 是否需要更新数据

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(private listScrollService: ListScrollService, private timerService: TimerService,
              private outsideHttpService: OutsideHttpService) {
    this.searchParams.parking_type = 1;
    this.searchParams.page_size = 2000;
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

  public ngOnDestroy() {
    this.listScrollService.destroyData();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public onDistrictChange(value: number) {
    this.listScrollService.stopScroll();
    this.requestData();
  }

  public requestData(): void {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.dataSubscription = this.outsideHttpService.requestParkingInfo(this.searchParams).subscribe(results => {
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
  private continueAppendData(): void {
    if (this.isAppendDataOperation) {
      return;
    }
    if (this.needUpdate) {
      // 需要更新
      this.isAppendDataOperation = true;
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.outsideHttpService.requestParkingInfo(this.searchParams).subscribe(results => {
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

  /**
   * 转换数据类型
   * @param lastItem 最后一项
   * @param newDataList 新数据
   */
  private convertRollData(lastItem: RollDataItem, newDataList: Array<ParkingEntity>): Array<RollDataItem> {
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
