import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ListScrollService, RollDataItem} from '../../../../../core/list-scroll.service';
import {Subscription, timer} from 'rxjs';
import {HotspotService, TrafficControllerEntity} from '../../hotspot.service';
import {TimerService} from '../../../../../core/timer.service';

const MAX_LIST_COUNT = 5;
const ROW_HEIGHT = 48;

@Component({
  selector: 'app-traffic-controller-violation',
  templateUrl: './traffic-controller-violation.component.html',
  styleUrls: ['./traffic-controller-violation.component.less'],
  providers: [ListScrollService]
})
export class TrafficControllerViolationComponent implements OnInit, AfterViewInit, OnDestroy {

  public dataList: Array<RollDataItem> = [];
  private dataSubscription: Subscription;
  private isAppendDataOperation = false; // 是否在追加数据操作中
  private needUpdate = false; // 是否需要更新数据
  private timerSubscription: Subscription;
  private newDataList: Array<TrafficControllerEntity> = [];

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;

  constructor(private listScrollService: ListScrollService, private hotPotService: HotspotService, private timerService: TimerService) {
    listScrollService.loadMoreData$.subscribe(() => {
      this.continueAppendData();
    });
    this.timerSubscription = timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.needUpdate = true;
    });
  }

  ngOnInit(): void {
    this.dataSubscription = this.hotPotService.requestTrafficControllerList().subscribe((results: Array<TrafficControllerEntity>) => {
      // 制作为UI效果定制的数据
      this.newDataList = results.concat(results); // 延长数组元素
      const rollDataList = this.convertRollData(null, this.newDataList);
      this.dataList = rollDataList;
      this.listScrollService.initData(ROW_HEIGHT, this.scrollDiv, this.dataList);
      if (this.dataList.length > MAX_LIST_COUNT) {
        // 列表显示不下了才需要滚动
        this.listScrollService.startScroll();
      }
    });
  }

  public ngOnDestroy() {
    this.listScrollService.destroyData();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public ngAfterViewInit() {

    if (this.dataList.length > MAX_LIST_COUNT) {
      // 列表显示不下了才需要滚动
      this.listScrollService.startScroll();
    }
  }

  public onScrollDivMouseEnter() {
    this.listScrollService.pauseScroll();
  }

  public onScrollDivMouseLeave() {
    this.listScrollService.continueScroll();
  }

  /* 继续追加数据 */
  private continueAppendData() {
    if (this.isAppendDataOperation) {
      return;
    }
    this.isAppendDataOperation = true;
    if (this.needUpdate) {
      // 需要更新
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.hotPotService.requestTrafficControllerList().subscribe((results: Array<TrafficControllerEntity>) => {
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
        this.appendLocalData();
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

  /**
   * 加载本地数据
   */
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
  private convertRollData(lastItem: RollDataItem, newDataList: Array<TrafficControllerEntity>): Array<RollDataItem> {
    const rollDataList = [];
    for (const tempItem of newDataList) {
      lastItem = new RollDataItem(tempItem, lastItem ? !lastItem.isOdd : true);
      rollDataList.push(lastItem);
    }
    return rollDataList;
  }

}
