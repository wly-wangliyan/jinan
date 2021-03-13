import { Pipe, PipeTransform } from '@angular/core';
import { Observable, from } from 'rxjs';

import { distinct } from 'rxjs/operators';

export const DefaultUserType = ['tmp', 'timely', 'count', 'white', 'black', 'visitor', 'space_sharing', 'reservation', 'other'];

const userTypeObj = {
  '1': '游客',
  '2': '数据运维人员',
};

@Pipe({
  name: 'userTypePipe'
})
export class UserTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    }
    if (value) {
      // 当直接传递字符串时的处理
      return userTypeObj[String(value)] ? userTypeObj[String(value)] : '--';
    } else if (value && value.length > 0) {
      // 当传递数组类型时的处理
      let str = '';
      from(value).pipe(distinct()).subscribe((code: any) => {
        // 拼接字符串
        const userType = userTypeObj[code] ? userTypeObj[code] : '';
        if (userType) {
          str = str ? str + ',' + userType : userType;
        }
      });
      return str ? str : '--';
    } else {
      return '--';
    }
  }
}
