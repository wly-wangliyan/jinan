import {Injectable} from '@angular/core';
import {EntityBase} from '../../../utils/z-entity';
import {HttpService, LinkResponse} from "../../core/http.service";
import {UserEntity} from "../../core/auth.service";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/internal/operators";
import {HttpResponse} from "@angular/common/http";

export class SystemUserEntity extends EntityBase {
  public company_name: string = undefined; // 	string 活动配置ID
  public system_name: string = undefined; // 	string	活动名称
  public telephone_number = ''; // string 显示端口(1小程序 2APP)
}

export class PlatformUserEntity extends EntityBase {
  public name: string = undefined; // 	string	活动名称
  public password = ''; // string 显示端口(1小程序 2APP)
  public user_name: number = undefined; // 	Integer	显示方式(1浮窗 2弹框 3固定位置)
  public telephone: string = undefined; // 	string	浮窗图片
  public role = '1'; // 	Integer	落地页类型(1H5 2原生页 3第三方小程序 4客服)
  public permission = undefined; // 	string	appId

  // public toEditJson(): any {
  //   const json = this.json();
  //   delete json.activity_id;
  //   delete json.status;
  //   delete json.click_num;
  //   delete json.exposure_num;
  //   delete json.updated_time;
  //   delete json.created_time;
  //   return json;
  // }
}

export class SearchEmployeeParams extends EntityBase {
  public page_size = 45; // 	integer	F	每页条数 默认：15
  public page_num = 1; // 	integer	F	页码 默认:1
  public username: string = undefined; // String	F	用户名
  public realname: string = undefined; // String F	姓名
  public telephone: string = undefined; // String	F	联系电话
  public role = '1'; // 	Integer	落地页类型(1H5 2原生页 3第三方小程序 4客服)
}

export class UserLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<UserEntity> {
    const tempList: Array<UserEntity> = [];
    results.forEach(res => {
      tempList.push(UserEntity.Create(res));
    });
    return tempList;
  }
}



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) {
  }


  /**员工管理列表
   * @param searchParams 查询参数
   * @returns Observable<UserLinkResponse>
   */
  public requestUsersList(searchParams: SearchEmployeeParams): Observable<any> {
    // const params = this.httpService.generateURLSearchParams(searchParams);
    // return this.httpService.get(environment.PARKING_DOMAIN + `/admin/users`,
    //     params).pipe(map(res => new UserLinkResponse(res)));
    const userTest = new UserEntity();
    userTest.username = 'wang';
    userTest.realname = '123';
    userTest.role = '1';
    userTest.telephone = '13899991111';
    userTest.password = '33sdf';
    userTest.show_terminal = '1,2';
    return of([userTest]);
  }


  /**
   * 通过linkUrl继续请求获取相机列表
   * @param string url linkUrl
   * @returns Observable<UserLinkResponse>
   */
  public continueUsersList(url: string): Observable<UserLinkResponse> {
    return this.httpService.get(url).pipe(map(res => new UserLinkResponse(res)));
  }

  /**
   * 新建检车线活动
   * @param string carline_id 检车线ID
   * @param params ActivityParams 数据源
   * @returns Observable<HttpResponse<any>>
   */
  public requestCreateActivityData(params: UserEntity): Observable<HttpResponse<any>> {
    return this.httpService.post(environment.PARKING_DOMAIN + `/admin/carlines/activities`, params);
  }

  /**
   * 编辑检车线活动
   * @param string carline_id 检车线ID
   * @param CarLinesEntity carLinesDetailData 数据源
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditActivityData(carline_id: string, params: UserEntity): Observable<HttpResponse<any>> {
    return this.httpService.put(environment.PARKING_DOMAIN + `/admin/carlines/${carline_id}/activities/`, params);
  }

  /**
   * 请求删除用户
   * @param username 用户名
   * @returns {Observable<HttpResponse<any>>}
   */
  public requestDeleteUser(username: string): Observable<HttpResponse<any>> {
    return this.httpService.delete(environment.PARKING_DOMAIN + '/users/' + username);
  }
}
