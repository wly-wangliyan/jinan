import {Pipe, PipeTransform} from '@angular/core';

export const DefaultUserType = ['tmp', 'timely', 'count', 'white', 'black', 'visitor', 'space_sharing', 'reservation', 'other'];

const userTypeObj = {
  1: '超级管理员',
  2: '管理员',
  3: '数据运维人员',
  4: '普通用户',
  5: '政府机关人员'
};

@Pipe({
  name: 'userTypePipe'
})
export class UserTypePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return userTypeObj[value];
  }
}

const stopTypeObj = {
  '1': '停用',
  '2': '启用',
};

@Pipe({
  name: 'stopTypePipe'
})
export class StopTypePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '--';
    } else {
      return stopTypeObj[String(value)];
    }
  }
}
