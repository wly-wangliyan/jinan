import { ListScrollService, RollDataItem } from '../../../../../core/list-scroll.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TimerService } from '../../../../../core/timer.service';
import { HomeHttpService, RoadTrafficEntity } from '../../home-http.service';

const MAX_LIST_COUNT = 5;
const ROW_HEIGHT = 48;

@Component({
  selector: 'app-left-one',
  templateUrl: './left-one.component.html',
  styleUrls: ['./left-one.component.less'],
  providers: [ListScrollService]
})
export class LeftOneComponent implements OnInit, AfterViewInit, OnDestroy {

  public dataList: Array<RollDataItem> = [];
  private dataSubscription: Subscription;
  private isAppendDataOperation = false; // 是否在追加数据操作中
  private needUpdate = false; // 是否需要更新数据
  private timerSubscription: Subscription;
  private newDataList: Array<RoadTrafficEntity> = [];

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;

  constructor(private listScrollService: ListScrollService, private homeHttpService: HomeHttpService, private timerService: TimerService) {
    listScrollService.loadMoreData$.subscribe(() => {
      this.continueAppendData();
    });
    this.timerSubscription = timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.needUpdate = true;
    });
  }

  ngOnInit(): void {
    this.dataSubscription = this.homeHttpService.requestRoadCongestionData().subscribe((results: Array<RoadTrafficEntity>) => {
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

  /* 继续追加数据 */
  private continueAppendData() {
    if (this.isAppendDataOperation) {
      return;
    }
    this.isAppendDataOperation = true;
    if (this.needUpdate) {
      // 需要更新
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.homeHttpService.requestRoadCongestionData().subscribe((results: Array<RoadTrafficEntity>) => {
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

  public onScrollDivMouseEnter() {
    this.listScrollService.pauseScroll();
  }

  public onScrollDivMouseLeave() {
    this.listScrollService.continueScroll();
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
  private convertRollData(lastItem: RollDataItem, newDataList: Array<RoadTrafficEntity>): Array<RollDataItem> {
    const rollDataList = [];
    for (const tempItem of newDataList) {
      lastItem = new RollDataItem(tempItem, lastItem ? !lastItem.isOdd : true);
      rollDataList.push(lastItem);
    }
    return rollDataList;
  }
}
