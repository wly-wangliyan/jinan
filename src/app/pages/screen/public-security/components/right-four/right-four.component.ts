import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListScrollService, RollDataItem } from '../../../../../core/list-scroll.service';
import { Subscription, timer } from 'rxjs';
import { TimerService } from '../../../../../core/timer.service';
import { mockData } from '../../mock-data';
import { ParkingSourceAnalysisEntity, PublicSecurityHttpService } from '../../public-security-http.service';

const MAX_LIST_COUNT = 9;
const ROW_HEIGHT = 72;

@Component({
  selector: 'app-right-four',
  templateUrl: './right-four.component.html',
  styleUrls: ['./right-four.component.less'],
  providers: [ListScrollService]
})
export class RightFourComponent implements OnInit, AfterViewInit, OnDestroy {

  public dataList: Array<RollDataItem> = [];
  private isAppendDataOperation = false; // 是否在追加数据操作中
  private newDataList: Array<ParkingSourceAnalysisEntity> = [];
  private needUpdate = false; // 是否需要更新数据

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(private listScrollService: ListScrollService,
              private timerService: TimerService,
              private securityHttpService: PublicSecurityHttpService) {
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
    this.listScrollService.stopScroll();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public onDistrictChange(value: number) {
    this.listScrollService.stopScroll();
    this.requestData();
  }

  public requestData(): void {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.dataSubscription = this.securityHttpService.requestParkingSourceAnalysis().subscribe(results => {
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
    });
  }

  /* 继续追加数据 */
  private continueAppendData(): void {
    if (this.isAppendDataOperation) {
      return;
    }
    if (this.needUpdate) {
      // 需要更新
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.securityHttpService.requestParkingSourceAnalysis().subscribe(results => {
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
  private convertRollData(lastItem: RollDataItem, newDataList: Array<ParkingSourceAnalysisEntity>): Array<RollDataItem> {
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
