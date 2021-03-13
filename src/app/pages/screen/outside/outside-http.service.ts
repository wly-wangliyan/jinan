import { Injectable } from '@angular/core';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';
import { EntityBase } from '../../../../utils/z-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class OutsideHttpService {

  constructor(private http: HttpService) {
  }

  /**
   * 获取所有停车场
   */
  public requestParkingInfo(params: ParkingParams): Observable<Array<ParkingEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings`;
    return this.http.get(url, params.json()).pipe(map(res => res.body.map(item => ParkingEntity.Create(item))));
  }

  /**
   * 获取停车场列表
   */
  public requestParkingInfoList(params: ParkingParams): Observable<ParkingEntityLinkResponse> {
    const url = `${environment.PARKING_DOMAIN}/parkings`;
    return this.http.get(url, params.json()).pipe(map(res => new ParkingEntityLinkResponse(res)));
  }

  /**
   * 继续获取停车场列表
   */
  public continueRequestParkingInfoList(linkUrl: string): Observable<ParkingEntityLinkResponse> {
    return this.http.get(linkUrl).pipe(map(res => new ParkingEntityLinkResponse(res)));
  }

  /**
   * 获取停车场总数,车位总数,预警数
   */
  public requestParkingStaticInfo(): Observable<ParkingStaticEntity> {
    const url = `${environment.PARKING_DOMAIN}/parking_static_info`;
    return this.http.get(url).pipe(map(res => ParkingStaticEntity.Create(res.body)));
  }

  /**
   * 获取各区领域停车场数量
   */
  public requestFieldParkingCountInfo(): Observable<Array<FieldParkingCountEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings/count_by_field`;
    return this.http.get(url).pipe(map(res => res.body.map(item => FieldParkingCountEntity.Create(item))));
  }

  /**
   * 获取停车场计费类型占比
   */
  public requestParkingChargeTypeInfo(): Observable<Array<ParkingChargeTypeEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings/count_by_charge_type`;
    return this.http.get(url).pipe(map(res => res.body.map(item => ParkingChargeTypeEntity.Create(item))));
  }

  /**
   * 获取今日预约列表
   * @param params
   */
  public requestParkingReservationRecordInfo(params: ReservationRecordParams): Observable<Array<ReservationRecordEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parking_reservation_records`;
    return this.http.get(url, params.json()).pipe(map(res => res.body.map(item => ReservationRecordEntity.Create(item))));
  }

  /**
   * 获取已预约车位数与总预约车位数占比
   */
  public requestParkingReservationSpots(params: ReservationSpotParams): Observable<ParkingReservationSpotEntity> {
    const url = `${environment.PARKING_DOMAIN}/statistics/reservation_spots`;
    return this.http.get(url, params.json()).pipe(map(res => ParkingReservationSpotEntity.Create(res.body)));
  }

  /**
   * 车场接入排行榜
   * @param params
   */
  public requestDistrictParkingCount(params: ParkingCountParams): Observable<Array<DistrictParkingCountEntity>> {
    const url = `${environment.PARKING_DOMAIN}/parkings/spots_by_district`;
    return this.http.get(url, params.json()).pipe(map(res => res.body.map(item => DistrictParkingCountEntity.Create(item))));
  }

  /**
   * 批量获取停车场总车位数,总实时占用车位数,总共享车位数
   * @param parking_ids 停车场id,多个使用逗号分割
   */
  public requestParkingTotalInfo(parking_ids: string): Observable<ParkingTotalInfoEntity> {
    const url = `${environment.PARKING_DOMAIN}/batch_parking_dynamic_info`;
    return this.http.get(url, { parking_ids }).pipe(map(res => ParkingTotalInfoEntity.Create(res.body)));
  }

  /**
   * 获取监控地址token
   * @param app_key
   * @param app_secret
   */
  public requestMonitorToken(app_key:string,app_secret:string){
    const  url=`${environment.PARKING_DOMAIN}/camera_config_token`
    return this.http.get(url, { app_key, app_secret });
  }
}

export class ParkingParams extends EntityBase {
  public parking_name: string = undefined; // string(50)	F	停车场名称
  public parking_type: number = undefined; // int	F	停车场类型 1-路内,2-路外
  public province: string = undefined; // string(20)	F	省
  public city: string = undefined; // string(20)	F	市
  public district: string = undefined; // string(20)	F	区
  public code = ''; // string(20)	F	行政区编码
  public page_num: number = undefined; // int	F	页数 默认1
  public page_size: number = undefined; // int	F	每页数量 默认45
  public parking_field: number = undefined; // 停车场所属领域 0-其他类型,1-交通枢纽,2-人防工程,3-老旧小区,4-旅游景区,5-医院
}

export class ParkingEntity extends EntityBase {
  public parking_id: string = undefined; // string(32)	T	平台停车场id
  public remote_parking_id: string = undefined; // string	T	第三方停车场id
  public parking_name: string = undefined; // string(50)	T	停车场名称
  public parking_type: number = undefined; // int	T	停车场类型 1-路内,2-路外
  public begin_time: string = undefined; // string	T	营业开始时间 HH:MM:SS
  public end_time: string = undefined; // string	T	营业结束时间 HH:MM:SS
  public short_info: string = undefined; // string(200)	T	简介
  public charge_standard: string = undefined; // string(200)	T	收费标准
  public parking_space_count: number = undefined; // int	T	车位总数
  public real_time_exist_spots: number = undefined; // 已占用车位数
  public real_time_surplus_spots: number = undefined; // 剩余泊位数
  public share_space: number = undefined; // int	T	共享车位总数
  public height_limit: number = undefined; // int	T	限高,单位厘米,-1为不限高
  public telephone: string[] = undefined; // string[]	T	电话
  public images: string[] = undefined; // string[]	T	图片
  public province: string = undefined; // string(20)	T	省
  public city: string = undefined; // string(20)	T	市
  public district: string = undefined; // string(20)	T	区
  public code: string = undefined; // string(20)	T	行政区编码
  public address: string = undefined; // string(50)	T	地址
  public is_delete: boolean = undefined; // bool	T	是否删除
  public created_time: number = undefined; // double	T	创建时间戳
  public updated_time: number = undefined; // double	T	修改时间戳
  public lon: number = undefined; // float	T	经度
  public lat: number = undefined; // float	T	纬度
  public parking_score: number = undefined;
  public space_status: number = undefined;
  public parking_field: number = undefined; // 停车场所属领域 0-其他类型,1-交通枢纽,2-人防工程,3-老旧小区,4-旅游景区,5-医院
  // 视频相关字段
  public app_key: string = undefined;
  public app_secret: string = undefined;
  public videos: Array<ParkingVideoEntity> = [];

  // 占用状态
  public get occupyState(): number {
    if (isNullOrUndefined(this.real_time_surplus_spots) || isNullOrUndefined(this.parking_space_count)) {
      return 3;
    }
    if (this.parking_space_count === 0) {
      return 2; // 红色 爆满
    }
    if (this.real_time_surplus_spots > 40) {
      return 3; // 绿色 空闲
    } else if (this.real_time_surplus_spots <= 10) {
      return 2; // 红色 爆满
    } else {
      return 1; // 黄色 紧张
    }
  }

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'videos') {
      return ParkingVideoEntity;
    }
    return null;
  }
}

export class ParkingVideoEntity extends EntityBase {
  public name: string = undefined;
  public url: string = undefined;
}

export class ParkingStaticEntity extends EntityBase {
  public total_parkings: number = undefined; // 停车场总数
  public total_parking_spots: number = undefined; // 车位总数
  public alert_num: number = undefined; // 预警数
}

export class FieldParkingCountEntity extends EntityBase {
  public parking_field: number = undefined; // 停车场所属领域 0-其他类型,1-交通枢纽,2-人防工程,3-老旧小区,4-旅游景区,5-医院
  public num = 0; // 停车场数量
  constructor(parking_field: number) {
    super();
    this.parking_field = parking_field;
  }
}

export class ParkingChargeTypeEntity extends EntityBase {
  public charge_type: number = undefined; // 收费类型 1-政府定价,2-政府指导价,3-市场调节价
  public num: number = undefined; // 停车场数量
}

export class ReservationRecordParams extends EntityBase {
  public parking_id: string = undefined; // string	F	停车场id
  public district: string = undefined; // string	F	停车场所属行政区
  public user_name: string = undefined; // string	F	预约用户姓名
  public car_id: string = undefined; // string	F	车牌号码
  public remote_spot_id: string = undefined; // string	F	第三方泊位id
  public remote_spot_num: string = undefined; // string	F	第三方泊位号
  public reservation_status: number = undefined; // int	F	预约状态 0-失败,1-成功
  public page_num: number = undefined; // int	F	页数 默认1
  public page_size: number = undefined; // int	F	每页数量 默认45
  public code: string = undefined;
}

export class ReservationRecordEntity extends EntityBase {
  public reservation_id: string = undefined; // string	T	平台预约记录id
  public remote_reservation_id: string = undefined; // string	T	第三方预约记录id
  public parking_id: string = undefined; // string	T	停车场id
  public district: string = undefined; // string	T	停车场所属行政区
  public user_name: string = undefined; // string	T	预约用户姓名
  public car_id: string = undefined; // string	T	车牌号码
  public remote_spot_id: string = undefined; // string	T	第三方泊位id
  public remote_spot_num: string = undefined; // string	T	第三方泊位号
  public reservation_time: number = undefined; // double	T	预约时间戳
  public expire_time: number = undefined; // double	T	预约过期时间戳
  public reservation_status: number = undefined; // int	T	预约状态 0-失败,1-成功
  public created_time: number = undefined; // double	T	创建时间戳
  public updated_time: number = undefined; // double	T	更新时间戳
}

export class ReservationSpotParams extends EntityBase {
  public code: string = undefined;
}

export class ParkingReservationSpotEntity extends EntityBase {
  public already_res_spots: number = undefined; // 已预约泊位数
  public total_res_spots: number = undefined; // 总预约泊位数
}

export class ParkingCountParams extends EntityBase {
  public district: string = undefined; // string(20)	F	行政区
  public code: string = undefined; // string(20)	F	行政区编码
  public parking_type: number = undefined; // 停车场类型 1-路内,2-路外
}

export class DistrictParkingCountEntity extends EntityBase {
  public district: string = undefined; // 行政区
  public code: string = undefined; // 行政区编码
  public parking_type: number = undefined; // 停车场类型 1-路内,2-路外
  public num: number = undefined; // 停车场数量
}

export class ParkingEntityLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ParkingEntity> {
    const tempList: Array<ParkingEntity> = [];
    results.forEach(res => {
      tempList.push(ParkingEntity.Create(res));
    });
    return tempList;
  }
}

export class ParkingTotalInfoEntity extends EntityBase {
  public total_spots: number = 0; // 总车位数
  public share_space: number = 0; // 总共享车位数
  public real_time_used_spots: number = 0; // 总实时占用车位数
  public parking_count: number = 0; // 停车场总数
}
