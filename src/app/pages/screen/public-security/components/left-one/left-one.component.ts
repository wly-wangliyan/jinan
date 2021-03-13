import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListScrollService, RollDataItem } from '../../../../../core/list-scroll.service';
import { Subscription, timer } from 'rxjs';
import { TimerService } from '../../../../../core/timer.service';
import { NormalEntity, PublicSecurityHttpService } from '../../public-security-http.service';

const MAX_LIST_COUNT = 5;
const ROW_HEIGHT = 72;

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
  private newDataList: Array<NormalEntity> = [];

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;

  constructor(private listScrollService: ListScrollService, private timerService: TimerService, private securityHttpService: PublicSecurityHttpService) {
    listScrollService.loadMoreData$.subscribe(() => {
      this.continueAppendData();
    });
    this.timerSubscription = timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.needUpdate = true;
    });
  }

  ngOnInit(): void {
    this.dataSubscription = this.securityHttpService.requestCommunityAccessRankingList().subscribe((results: Array<NormalEntity>) => {
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

  public ngOnDestroy() {
    this.listScrollService.destroyData();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
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
      this.dataSubscription = this.securityHttpService.requestCommunityAccessRankingList().subscribe((results: Array<NormalEntity>) => {
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
  private convertRollData(lastItem: RollDataItem, newDataList: Array<NormalEntity>): Array<RollDataItem> {
    const rollDataList = [];
    for (const tempItem of newDataList) {
      lastItem = new RollDataItem(tempItem, lastItem ? !lastItem.isOdd : true);
      rollDataList.push(lastItem);
    }
    return rollDataList;
  }
}
