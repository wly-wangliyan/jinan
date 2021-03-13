import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { timer, Subscription, fromEvent } from 'rxjs';
@Component({
  selector: 'app-magic-number-item',
  templateUrl: './magic-number-item.component.html',
  styleUrls: ['./magic-number-item.component.less']
})
export class MagicNumberItemComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('magicNumber', { static: false }) magicNumberRef: ElementRef;

  offsetY = 0;

  isActivateAnimation = true; // 是否激活动画效果

  private firstShow = true; // 是否为第一次呈现数据

  private _sNumber = '0';
  @Input() set sNumber(sNumber: string) {
    const stepLength = this.calcStepLength(Number(this._sNumber), Number(sNumber));
    this._sNumber = sNumber;
    this.isActivateAnimation = true;
    if (this.firstShow) {
      this.displayNumber = this.generateNumber(Number(sNumber));
      this.firstShow = false;
      timer(0).subscribe(() => {
        this.offsetY = - this.sHeight * 10;
      });
    } else {
      timer(0).subscribe(() => {
        this.offsetY = - this.sHeight * stepLength;
      });
    }
  }

  get sNumber(): string {
    return this._sNumber;
  }

  displayNumber = '01234567890';

  @Input() sHeight = 0;

  @Input() sWidth = 0;

  @Input() sFontSize = 0;

  private endSubscription: Subscription;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.endSubscription = fromEvent(this.magicNumberRef.nativeElement, 'transitionend').subscribe(() => {
      this.isActivateAnimation = false;
      timer(0).subscribe(() => {
        this.displayNumber = this.generateNumber(Number(this.sNumber));
        this.offsetY = 0;
      });
    });
  }

  ngOnDestroy() {
    this.endSubscription && this.endSubscription.unsubscribe();
  }

  /**
   * 生成数字字符串
   * @param num 目标数字
   */
  private generateNumber(num: number): string {
    const numList = [];
    for (let index = 0; index < 11; index++) {
      numList.push((num + index) % 10);
    }
    return numList.join('');
  }

  /**
   * 计算步长
   * @param sourceNum 原始数字
   * @param targetNum 目标数字
   */
  private calcStepLength(sourceNum: number, targetNum: number): number {
    if (sourceNum > targetNum) {
      return targetNum + 10 - sourceNum;
    } else if (sourceNum === targetNum) {
      return 10;
    } else {
      return targetNum - sourceNum;
    }
  }
}
