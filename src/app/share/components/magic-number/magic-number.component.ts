import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-magic-number',
  templateUrl: './magic-number.component.html',
  styleUrls: ['./magic-number.component.less']
})
export class MagicNumberComponent {

  /**
   * 显示的数字字符串,如果需要前面用0占位，请自行格式化
   */
  @Input() set sNumber(num: string) {
    this._sNumber = num;
    this.numbers = (num === null || num === undefined) ? [] : num.split('');
    this.numLength = this.numbers.length;
  }
  get sNumber(): string {
    return this._sNumber;
  }

  // 数字长度
  public numLength = 0;

  /**
   * 数字宽度
   */
  @Input() sNumberWidth = 0;

  /**
   * 高度
   */
  @Input() sHeight = 0;

  /**
   * 数字最大长度
   */
  @Input() sMaxLength = 0;

  /**
   * 字体大小
   */
  @Input() sFontSize = 0;

  /**
   * 数字的停靠方向
   *
   * {('start' | 'end' | 'center')}
   */
  @Input() sJustifyContent: 'start' | 'end' | 'center' = 'center';

  private _sNumber = '0';

  public numbers = [];

  // 生成ID,跟踪节点刷新动画
  generateID = (index: number, item: any) => {
    if (this.sMaxLength > 0) {
      return index + this.sMaxLength - this.numbers.length;
    }
    return index;
  }
}
