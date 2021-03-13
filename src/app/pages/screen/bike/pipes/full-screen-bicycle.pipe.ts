import { Pipe, PipeTransform } from '@angular/core';
import echarts from 'echarts';

@Pipe({
  name: 'fullBicycleColor'
})
export class FullBicycleColorPipe implements PipeTransform {

  /**
   * 转换方法
   * @param value 状态值
   * @param forColor 是否转换出来颜色,默认不转换出来颜色
   * @returns {any}
   */
  public transform(value: any): any {
    if (value === 1 || value === '1') {// 青桔
      // return new echarts.graphic.LinearGradient(
      //   0, 0, 0, 1,
      //   [
      //     { offset: 1, color: 'rgba(66, 224, 252, 0)' },
      //     { offset: 0, color: 'rgba(66, 224, 252, 1)' }
      //   ]
      // );
      return 'rgba(66, 224, 252, 1)';
    }
    if (value === 2 || value === '2') {// 哈罗
      // return new echarts.graphic.LinearGradient(
      //   0, 0, 0, 1,
      //   [
      //     { offset: 1, color: 'rgba(52, 115, 254, 0)' },
      //     { offset: 0, color: 'rgba(52, 115, 254, 1)' }
      //   ]
      // );
      return 'rgba(52, 115, 254, 1)';
    }
    if (value === 3 || value === '3') {// 美团
      // return new echarts.graphic.LinearGradient(
      //   0, 0, 0, 1,
      //   [
      //     { offset: 1, color: 'rgba(247, 181, 0, 0)' },
      //     { offset: 0, color: 'rgba(247, 181, 0, 1)' }
      //   ]
      // );
      return 'rgba(247, 181, 0, 1)';
    }
    // return new echarts.graphic.LinearGradient(
    //   0, 0, 0, 1,
    //   [
    //     { offset: 1, color: 'rgba(255, 111, 111, 0)' },
    //     { offset: 0, color: 'rgba(255, 111, 111, 1)' }
    //   ]
    // );
    return 'rgba(255, 111, 111, 1)';
  }
}


@Pipe({
  name: 'fullBarBicycleColor'
})
export class FullBarBicycleColorPipe implements PipeTransform {

  /**
   * 转换方法
   * @param value 状态值
   * @param forColor 是否转换出来颜色,默认不转换出来颜色
   * @returns {any}
   */
  public transform(value: any): any {
    if (value === 1 || value === '1') {// 青桔
      return new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
          { offset: 1, color: 'rgba(66, 224, 252, 0)' },
          { offset: 0, color: 'rgba(66, 224, 252, 1)' }
        ]
      );
    }
    if (value === 2 || value === '2') {// 哈罗
      return new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
          { offset: 1, color: 'rgba(52, 115, 254, 0)' },
          { offset: 0, color: 'rgba(52, 115, 254, 1)' }
        ]
      );
    }
    if (value === 3 || value === '3') {// 美团
      return new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
          { offset: 1, color: 'rgba(247, 181, 0, 0)' },
          { offset: 0, color: 'rgba(247, 181, 0, 1)' }
        ]
      );
    }
    return new echarts.graphic.LinearGradient(
      0, 0, 0, 1,
      [
        { offset: 1, color: 'rgba(255, 111, 111, 0)' },
        { offset: 0, color: 'rgba(255, 111, 111, 1)' }
      ]
    );
  }
}

@Pipe({
  name: 'fullBicycleDateColor'
})
export class FullBicycleDateColorPipe implements PipeTransform {

  /**
   * 获取时间
   */
  // public getValueDate(value: any): string {
  //   return new Date(value).toLocaleString().substring(0, 10);
  // }

  /**
   * 转换方法
   * @param value 状态值
   * @param forColor 是否转换出来颜色,默认不转换出来颜色
   * @returns {any}
   */
  public transform(value: any): any {
    // const valueDate = this.getValueDate(value * 1000);
    // const todayDate = this.getValueDate(new Date());
    // const yesterdayDate = this.getValueDate(new Date().getTime() - 24 * 60 * 60 * 1000);
    if (value === 1) {// 今天
      return '#FF0000';
    }
    if (value === 2) {// 昨天
      return '#0096FF';
    }
    return '#' +
      '';
  }
}

@Pipe({
  name: 'fullCompanyType'
})
export class FullCompanyTypePipe implements PipeTransform {

  /**
   * 转换方法
   * @param value 状态值
   * @returns {any}
   */
  public transform(value: any): any {
    if (value === 1 || value === '1') {
      return '青桔';
    }
    if (value === 2 || value === '2') {
      return '哈罗';
    }
    if (value === 3 || value === '3') {
      return '美团';
    }
    return '总计';
  }
}

/** 预警级别颜色 */
const WarningLevelColor = {
  1: '#38B549',
  2: '#FF9700',
  3: '#FF0000',
};

@Pipe({
  name: 'warningLevelColor'
})
export class WarningLevelColorPipe implements PipeTransform {
  public transform(value: any): any {
    if (!value) {
      return '#';
    }
    if (value) {
      // 当直接传递字符串时的处理
      return WarningLevelColor[value];
    } else {
      return WarningLevelColor[value];
    }
  }
}

/** 预警级别提示信息 */
const WarningLevelText = {
  1: '正常状态',
  2: '饱和状态',
  3: '超限状态',
};

@Pipe({
  name: 'warningLevelText'
})
export class WarningLevelTextPipe implements PipeTransform {
  public transform(value: any): any {
    if (!value) {
      return '#';
    }
    if (value) {
      // 当直接传递字符串时的处理
      return WarningLevelText[value];
    } else {
      return WarningLevelText[value];
    }
  }
}

/** 事件类型 */
const EventType = {
  1: '违规停车',
  2: '超时用车',
  3: '超范围骑行'
};

@Pipe({
  name: 'eventType'
})
export class EventTypePipe implements PipeTransform {
  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }

    result = EventType[value] || '--';

    return result;
  }
}

@Pipe({
  name: 'zMaxLength'
})
export class ZMaxLengthPipe implements PipeTransform {

  /**
   * 转换方法
   * @param message 文本
   * @returns any
   */
  public transform(message: any, maxLength = 10, dot = true): string {
    if (message && message.length > maxLength) {
      return message.substr(0, maxLength - 1) + (dot ? '...' : '');
    }
    return message;
  }
}

/** 预警级别 */
const FullWarningLevel = {
  1: '正常',
  2: '饱和',
  3: '超限',
};

@Pipe({
  name: 'fullWarningLevel'
})
export class FullWarningLevelPipe implements PipeTransform {
  public transform(value: any, args?: any): any {
    let result = '--';
    if (value === null || value === undefined || value === '') {
      return result;
    }

    result = FullWarningLevel[value] || '--';

    return result;
  }
}

@Pipe({
  name: 'fullCompanyName'
})
export class FullCompanyNamePipe implements PipeTransform {

  /**
   * 转换方法
   * @param value 状态值
   * @returns {any}
   */
  public transform(value: string): any {
    if (value == 'qingjvc123单车') {
      return '青桔单车';
    }
    if (value == 'qingjvc123助力车') {
      return '青桔助力车';
    }
    if (value == 'haluoc123单车') {
      return '哈罗单车';
    }
    if (value == 'haluoc123助力车') {
      return '哈罗助力车';
    }
    if (value == 'mobaic123单车') {
      return '美团单车';
    }
    if (value == 'mobaic123助力车') {
      return '美团助力车';
    }
    return '总计';
  }
}



