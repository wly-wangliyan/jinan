import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zHeatMap'
})
export class ZHeatMapPipe implements PipeTransform {

  /**
   * 转换方法
   * @param value 状态值
   * @returns {any}
   */
  public transform(value: any): any {
    if (value <= 10) {
      return 19;
    } else if (value <= 25) {
      return 18;
    } else if (value <= 50) {
      return 17;
    } else if (value <= 100) {
      return 16;
    } else if (value <= 200) {
      return 15;
    } else if (value <= 500) {
      return 14;
    } else if (value <= 1000) {
      return 13;
    } else if (value <= 2000) {
      return 12;
    } else if (value <= 5000) {
      return 11;
    } else if (value <= 10000) {
      return 10;
    } else if (value <= 20000) {
      return 9;
    } else if (value <= 30000) {
      return 8;
    } else if (value <= 50000) {
      return 7;
    } else if (value <= 100000) {
      return 6;
    } else if (value <= 200000) {
      return 5;
    } else if (value <= 500000) {
      return 4;
    } else if (value <= 1000000) {
      return 3;
    } else if (value > 1000000) {
      return 2;
    }
    return 20;
  }
  /**
   * 逆向转换方法
   * @param value 状态值
   * @returns {any} 单位米
   */
  public zoomTransformToScale(zoom: number): number {
    if (zoom === 20) {
      return 10;
    } else if (zoom === 19) {
      return 20;
    } else if (zoom === 18) {
      return 50;
    } else if (zoom === 17) {
      return 100;
    } else if (zoom === 16 || zoom === 15) {
      return 200;
    } else if (zoom === 14) {
      return 500;
    } else if (zoom === 13) {
      return 1000;
    } else if (zoom === 12) {
      return 2000;
    } else if (zoom === 11) {
      return 5000;
    }
    return 5000;
  }
}
