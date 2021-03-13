import { EventEmitter, Injectable } from '@angular/core';
import { Subscription, interval, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListScrollService {

  public dataList: Array<RollDataItem> = [];
  public loadMoreData$: EventEmitter<RollDataItem> = new EventEmitter<RollDataItem>();

  private currentScreenScale = 1; // 当前屏幕缩放比例
  private scrollSubscription: Subscription;
  private delaySubscription: Subscription;
  private isPauseScroll = false; // 是否暂停滚动
  private isStopScroll = true; // 是否停止滚动
  private scrollElement: any;
  private preLoadingHeight: number; // 预加载高度 当距离底部还有N条数据时就开始加载
  private calcHeight: number; // 计算后的最小公倍数，用于处理滚动比例与高度

  constructor() {
    this.currentScreenScale = Number(devicePixelRatio.toFixed(1));
  }

  public initData(itemHeight: number, scrollElement: any, dataList: Array<RollDataItem>) {
    this.preLoadingHeight = itemHeight * 15;
    this.scrollElement = scrollElement;
    this.dataList = dataList;
    this.calcHeight = this.calcMultiple(itemHeight, 1 / this.currentScreenScale);
  }

  public destroyData() {
    this.delaySubscription && this.delaySubscription.unsubscribe();
    this.scrollSubscription && this.scrollSubscription.unsubscribe();
  }

  public startScroll() {
    if (!this.isStopScroll || !this.scrollElement) {
      return;
    }
    this.scrollSubscription && this.scrollSubscription.unsubscribe();
    this.delaySubscription && this.delaySubscription.unsubscribe();
    this.scrollElement.nativeElement.scrollTop = 0;
    this.isStopScroll = false;
    this.continueScroll();
  }

  public pauseScroll() {
    this.scrollSubscription && this.scrollSubscription.unsubscribe();
    this.delaySubscription && this.delaySubscription.unsubscribe();
    this.isPauseScroll = true;
  }

  public stopScroll() {
    this.scrollSubscription && this.scrollSubscription.unsubscribe();
    this.delaySubscription && this.delaySubscription.unsubscribe();
    this.isStopScroll = true;
  }

  public continueScroll() {
    if (this.isStopScroll) {
      return;
    }
    this.isPauseScroll = false;
    this.scrollSubscription = interval(15).subscribe(() => {
      if (this.scrollElement.nativeElement.scrollTop % this.calcHeight === 0) {
        // 滚动一条之后有短暂的停顿效果
        this.scrollSubscription && this.scrollSubscription.unsubscribe();
        this.delaySubscription && this.delaySubscription.unsubscribe();
        if (this.scrollElement.nativeElement.scrollTop === this.calcHeight) {
          // 循环移除数据项,防止长时间数据溢出
          this.dataList.shift();
        }
        this.delaySubscription = timer(1500).subscribe(() => {
          if (!this.isPauseScroll) {
            this.scrollElement.nativeElement.scrollTop = this.scrollElement.nativeElement.scrollTop + 1 / this.currentScreenScale;
            this.continueScroll();
          }
        });
      } else {
        this.scrollElement.nativeElement.scrollTop = this.scrollElement.nativeElement.scrollTop + 1 / this.currentScreenScale;
      }

      if (this.scrollElement.nativeElement.scrollHeight <= this.preLoadingHeight && this.scrollElement.nativeElement.scrollHeight > 10) {
        // 当距离底部还有N条数据时就开始加载
        this.loadMoreData$.emit();
      }
    });
  }

  /**
   * 计算最小公倍数
   * @param x x
   * @param y y
   */
  calcMultiple(x: number, y: number): number {
    let tmpX = x;
    let tmpY = y;
    let tmpC = 0;
    while (tmpY !== 0) {
      tmpC = tmpX % tmpY;
      tmpX = tmpY;
      tmpY = tmpC;
    }
    // 获取最小公约数tmpX
    return x * (y / tmpX);
  }
}

export class RollDataItem {
  public isOdd: boolean; // 是否为单数项,用来控制背景颜色
  public source: any;

  constructor(source: any, isOdd: boolean) {
    this.isOdd = isOdd;
    this.source = source;
  }
}
