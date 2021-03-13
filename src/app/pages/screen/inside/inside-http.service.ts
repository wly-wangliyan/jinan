import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { EntityBase, noJson } from '../../../../utils/z-entity';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsideHttpService {

  constructor(private http: HttpService) {
  }

  private serialize(params: any): string {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }

  /**
   * 获取道路列表
   * @param params
   */
  public requestRoadInfo(params: RoadParams): Observable<Array<RoadEntity>> {
    const url = `${environment.PARKING_DOMAIN}/city_roads`;
    return this.http.get(url, params.json()).pipe(map(res => res.body.map(item => RoadEntity.Create(item))));
  }

  /**
   * 获取全部道路列表
   * @param params
   */
  public requestRoadList(params: RoadParams): Observable<Array<RoadEntity>> {
    const body = this.serialize(params.json());
    const url = `${environment.PARKING_DOMAIN}/city_roads?${body}`;
    const subject = new Subject<Array<RoadEntity>>();
    this.requestLinkAllRoadList(url, [], subject);
    return subject;
  }

  private requestLinkAllRoadList(url: string, dataArray: Array<RoadEntity>,
                                 subject: Subject<Array<RoadEntity>>) {
    this.http.get(url).subscribe(data => {
      // 数据转换
      const results = data.body.map(jsonObj => RoadEntity.Create(jsonObj));
      dataArray = [...dataArray, ...results];

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRoadList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取全市道路汇总信息
   */
  public requestCityRoadInfo(): Observable<Array<CityRoadEntity>> {
    const url = `${environment.PARKING_DOMAIN}/city_roads/count_all`;
    return this.http.get(url).pipe(map(res => res.body.map(item => CityRoadEntity.Create(item))));
  }

  /**
   * 获取各区道路汇总信息
   */
  public requestDistrictRoadTypeInfo(): Observable<Array<DistrictRoadTypeEntity>> {
    const url = `${environment.PARKING_DOMAIN}/city_roads/count_by_district`;
    return this.http.get(url).pipe(map(res => res.body.map(item => DistrictRoadTypeEntity.Create(item))));
  }

  /**
   * 获取今日订单量,停车时长,当日注册用户数,总注册用户数
   */
  public requestParkingDynamicInfo(parking_id?: string): Observable<ParkingDynamicEntity> {
    const body = parking_id ? {parking_id} : {};
    const url = `${environment.PARKING_DOMAIN}/parking_dynamic_info`;
    return this.http.get(url, body).pipe(map(res => ParkingDynamicEntity.Create(res.body)));
  }

  /**
   * 停车时长统计
   */
  public requestParkingTimeStatisticInfo(): Observable<ParkingTimeEntity> {
    const url = `${environment.PARKING_DOMAIN}/statistics/parking_time`;
    return this.http.get(url).pipe(map(res => ParkingTimeEntity.Create(res.body)));
  }

  /**
   * 获取欠费率统计信息
   */
  public requestArrearageStatisticInfo(): Observable<ArrearageRecordEntity> {
    const url = `${environment.PARKING_DOMAIN}/statistics/arrearage_records`;
    return this.http.get(url).pipe(map(res => ArrearageRecordEntity.Create(res.body)));
  }

  /**
   * 员工(巡检员)信息
   * @param params
   */
  public requestEmployeeList(params: EmployeeParams): Observable<Array<EmployeeEntity>> {
    const tempParams = this.http.serialize(params);
    const url = `${environment.PARKING_DOMAIN}/employees?page_num=1&page_size=100&${tempParams}`;
    const subject = new Subject<Array<EmployeeEntity>>();
    this.requestLinkAllEmployeeList(url, [], subject);
    return subject;
  }

  private requestLinkAllEmployeeList(url: string, dataArray: Array<EmployeeEntity>,
                                     subject: Subject<Array<EmployeeEntity>>) {
    this.http.get(url).subscribe(data => {
      // 数据转换
      const results = data.body.map(jsonObj => EmployeeEntity.Create(jsonObj));
      dataArray = [...dataArray, ...results];

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllEmployeeList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 员工轨迹列表
   * @param employee_id
   */
  public requestEmployeePositionList(employee_id: string): Observable<Array<EmployeeDetailEntity>> {
    const url = `${environment.PARKING_DOMAIN}/employees/${employee_id}`;
    return this.http.get(url).pipe(map(res => res.body.map(item => EmployeeDetailEntity.Create(item))));
  }

  /**
   * 车场周转率。利用率
   */
  public requestDynamicInfo(params: ParkingDynamicParams): Observable<Array<DynamicInfoEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings/dynamic_infos`;
    return this.http.get(url, params.json()).pipe(map(res => res.body.map(item => DynamicInfoEntity.Create(item))));
  }

  /**
   * 车场周转率。利用率
   */
  public requestAllDynamicInfo(params: ParkingDynamicParams): Observable<Array<DynamicInfoEntity>> {
    const paramStr = Object.keys(params).filter(key => params[key]).map(key => `${key}=${params[key]}`).join('&');
    const url = `${environment.PARKING_DOMAIN}/parkings/dynamic_infos?${paramStr}`;
    const subject = new Subject<Array<DynamicInfoEntity>>();
    this.requestLinkAllDynamicList(url, [], subject);
    return subject;
  }

  private requestLinkAllDynamicList(url: string, dataArray: Array<DynamicInfoEntity>,
                                    subject: Subject<Array<DynamicInfoEntity>>) {
    this.http.get(url).subscribe(data => {
      // 数据转换
      const results = data.body.map(jsonObj => DynamicInfoEntity.Create(jsonObj));
      dataArray = [...dataArray, ...results];

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllDynamicList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取所有停车场泊位列表
   * @param parking_id 停车场id
   */
  public requestAllParkingSpots(parking_id: string): Observable<Array<ParkingSpotEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings/${parking_id}/parking_spots?page_num=1&page_size=100`;
    const subject = new Subject<Array<ParkingSpotEntity>>();
    this.requestLinkAllParkingSpotList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取所有停车场泊位列表
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllParkingSpotList(url: string, dataArray: Array<ParkingSpotEntity>,
                                        subject: Subject<Array<ParkingSpotEntity>>) {
    this.http.get(url).subscribe(data => {
      // 数据转换
      const results = data.body.map(jsonObj => ParkingSpotEntity.Create(jsonObj));
      dataArray = [...dataArray, ...results];

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllParkingSpotList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }

  /**
   * 获取所有停车记录列表
   * @param parking_id 停车场id
   */
  public requestAllParkingRecords(parking_id: string): Observable<Array<ParkingRecordEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings/${parking_id}/parking_records?page_num=1&page_size=100&exit_section=inf,`;
    const subject = new Subject<Array<ParkingRecordEntity>>();
    this.requestLinkAllParkingRecordList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取所有停车记录列表
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllParkingRecordList(url: string, dataArray: Array<ParkingRecordEntity>,
                                          subject: Subject<Array<ParkingRecordEntity>>) {
    this.http.get(url).subscribe(data => {
      // 数据转换
      const results = data.body.map(jsonObj => ParkingRecordEntity.Create(jsonObj));
      dataArray = [...dataArray, ...results];

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllParkingRecordList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }
}

export class RoadParams extends EntityBase {
  public road_name: string = undefined; // string(50)	F	道路名称
  public road_type: number = undefined; // int	F	道路类型 1-准停,2-禁停,3-限停,4-临停
  public district: string = undefined; // string(20)	F	道路所属行政区
  public code: string = undefined; // string(20)	F	行政区编码
  public page_num: number = undefined; // int	F	页数 默认1
  public page_size: number = undefined; // int	F	每页数量 默认45
}

export class RoadEntity extends EntityBase {
  public code: string = undefined;
  public created_time: number = undefined;
  public district: string = undefined;
  public remote_road_id: string = undefined;
  public road_id: string = undefined;
  public road_name: string = undefined;
  public road_path: Array<RoadPathEntity> = undefined;
  public road_type: number = undefined;
  public updated_time: number = undefined;
  public road_parking: RoadParkingEntity = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'road_path') {
      return RoadPathEntity;
    } else if (propertyName === 'road_parking') {
      return RoadParkingEntity;
    }
    return null;
  }
}

export class RoadPathEntity extends EntityBase {
  public lat: string = undefined;
  public lon: string = undefined;
}

export class RoadParkingEntity extends EntityBase {
  public parking_id: string = undefined; // string(32)	T	平台停车场id
  public parking_name: string = undefined; // string(50)	T	停车场名称
  public parking_type: string = undefined; // int	T	停车场类型 1-路内,2-路外
  public parking_space_count: string = undefined; // int	T	车位总数
  public real_time_exist_spots: string = undefined; // int	T	实施剩余车位数
  public share_space: string = undefined; // int	T	共享车位总数
  public real_time_used_spots: string = undefined; // int	T	实时占用泊位数
  public real_time_surplus_spots: string = undefined; // int	T	实时剩余泊位数
  public space_status: number = undefined;
}

export class CityRoadEntity extends EntityBase {
  public road_type: number = undefined; // 道路类型 1-准停,2-禁停,3-限停,4-临停
  public num: number = undefined; // 数量
}

export class DistrictRoadTypeEntity extends EntityBase {
  public district: string = undefined; // 行政区
  public code: string = undefined; // 行政区编码
  public road_type: number = undefined; // 道路类型 1-准停,2-禁停,3-限停,4-临停
  public num = 0; // 道路数量

  constructor(district?: string, code?: string, road_type?: number) {
    super();
    if (district) {
      this.district = district;
    }
    if (code) {
      this.code = code;
    }
    if (road_type) {
      this.road_type = road_type;
    }
  }
}

export class ParkingDynamicEntity extends EntityBase {
  public order_num = 0; // 今日订单量,传parkin_id参数只计算该停车场的订单量
  public parking_time = 0; // 停车时长,单位小时,向下取整
  public today_register_users = 0; // 当日注册用户数
  public total_register_users = 0; // 总注册用户数
}

export class ParkingTimeEntity extends EntityBase {
  public under_two: string = undefined; // 2小时以下
  public two_four: string = undefined; // 2-4小时
  public four_six: string = undefined; // 4-6小时
  public six_eight: string = undefined; // 6-8小时
  public eight_ten: string = undefined; //  8-10小时
  public over_ten: string = undefined; // 10小时已上
  public parking_time: string = undefined; // 今日总停车时长,单位秒
}

export class ArrearageRecordEntity extends EntityBase {
  public under_one: string = undefined; // 100元以下,百分比,精确到两位小数的字符串,下同
  public one_two: string = undefined; // 100-200元
  public two_five: string = undefined; // 200-500元
  public five_ten: string = undefined; // 500-1000元
  public over_ten: string = undefined; // 1000元已上
}

export class EmployeeParams extends EntityBase {
  public employee_name: string = undefined; // string(50)	F	员工名
  public real_name: string = undefined; // string	F	员工真实姓名
  public sex: number = undefined; // int	F	性别 1-男,2-女
  public telephone: string = undefined; // string(20)	F	电话
  public employee_num: string = undefined; // string(20)	F	工号
  public employee_status: number = undefined; // int	F	状态 1-在职,2-离职
  public page_num: number = undefined; // int	F	页数 默认1
  public page_size: number = undefined; // int	F	每页数量 默认45
  public parking_id: string = undefined; // string(32)	F	停车场id
}

export class EmployeeEntity extends EntityBase {
  public employee_id: string = undefined; // string(32)	T	平台员工id
  public remote_employee_id: string = undefined; // string	T	第三方员工id
  public employee_name: string = undefined; // string(50)	T	用户名
  public real_name: string = undefined; // string(50)	T	真实姓名
  public sex: number = undefined; // int	T	性别 1-男,2-女
  public telephone: string = undefined; // string(50)	T	电话
  public employee_icon: string = undefined; // string	T	头像
  public employee_num: string = undefined; // string(50)	T	工号
  public employee_status: number = undefined; // int	T	状态 1-在职,2-离职
  public employee_score: number = undefined; // int	T	积分
  public employee_violate: number = undefined; // int	T	违规次数
  public parking_ids: string = undefined; // Json[]	T	关联的停车场
  public created_time: number = undefined; // double	T	创建时间戳
  public updated_time: number = undefined; // double	T	更新时间戳
  public employee_pos: EmployeePositionEntity = undefined; // 坐标信息

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'employee_pos') {
      return EmployeePositionEntity;
    }
    return null;
  }
}

export class EmployeePositionEntity extends EntityBase {
  public lat: number = undefined;
  public lon: number = undefined;
  public road_name: string = undefined; // 道路名称
}

export class EmployeeDetailEntity extends EntityBase {
  public created_time: number = undefined;
  public employee_id: string = undefined;
  public id: string = undefined;
  public lat: number = undefined;
  public lon: number = undefined;
  public pos_time: number = undefined;
  public remote_employee_id: string = undefined;
  public road_name: string = undefined;
  public updated_time: number = undefined;
}

export class DynamicInfoEntity extends EntityBase {
  public parking_turnover_rate: number = undefined; // 周转率
  public parking_use_rate: number = undefined; // 利用率
  public parking_name: string = undefined; // 停车场名称
  public offline_time: number = undefined; // int	T	离线时间
  public district: string = undefined; // 停车场所属行政区
}

export class ParkingDynamicParams extends EntityBase {
  public parking_type: number = undefined; // int	F	停车场类型 1-路内,2-路外
  public district: string = undefined; // string(20)	F	区
  public code: string = undefined; // string(20)	F	行政区编码
  public online_status: number = undefined; // int	F	在线状态 1-在线,2-离线
  public page_num: number = undefined; // int	F	页数 默认1
  public page_size: number = undefined; // int	F	每页数量 默认45
}

export class ParkingSpotEntity extends EntityBase {
  public spot_id: string = undefined; // string	T	平台泊位id
  public remote_spot_id: string = undefined; // string	T	第三方泊位id
  public remote_spot_num: string = undefined; // string	T	第三方泊位号
  public parking_id: string = undefined; // string	T	停车场id
  public can_reservation: boolean = undefined; // bool	T	是否可以预约
  public can_share: boolean = undefined; // bool	T	是否可以共享
  public status: number = undefined; // int	T	状态 1-空闲,2-占用,3-已预约
  public created_time: number = undefined; // double	T	创建时间戳
  public updated_time: number = undefined; // double	T	更新时间戳

  @noJson public car_id: string = undefined; // 默认展示泊位号，有车牌号展示车牌号；
  @noJson public has_car = false; // 该泊位是否有车

  @noJson
  public set carId(value: string) {
    this.car_id = value;
    this.has_car = true;
  }
}

export class ParkingRecordEntity extends EntityBase {
  public parking_record_id: string = undefined; // string	T	平台停车记录id
  public remote_parking_record_id: string = undefined; // string	T	第三方停车记录id
  public parking_id: string = undefined; // string	T	平台停车场id
  public car_id: string = undefined; // string	T	车牌号码
  public car_id_color: string = undefined; // int	T	车牌颜色：1-蓝,2-黄,3-绿,4-黄绿,5-白,6-黑,100-其它,如果空值默认为蓝
  public remote_spot_id: string = undefined; // string	T	第三方泊位id
  public remote_spot_num: string = undefined; // string	T	第三方泊位号
  public entrance_time: number = undefined; // double	T	入场时间戳
  public exit_time: number = undefined; // double	F	离场时间戳
  public created_time: number = undefined; // double	T	创建时间戳
  public updated_time: number = undefined; // double	T	更新时间戳
}
