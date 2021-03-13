import { map } from 'rxjs/internal/operators';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/http.service';
import { Injectable } from '@angular/core';
import { EntityBase } from 'src/utils/z-entity';

@Injectable({
  providedIn: 'root'
})
export class HomeHttpService {

  constructor(private http: HttpService) {

  }

  /**
   * 获取路内路外停车场数量,停车场总数
   */
  requestParkingCount(): Observable<ParkingCountEntity> {
    const url = environment.PARKING_DOMAIN + `/parkings/count_by_type`;
    return this.http.get(url).pipe(map(data => {
      const entity = new ParkingCountEntity();
      data.body && data.body.forEach(element => {
        if (element.parking_type === 1) {
          entity.inside_number = element.num;
        } else if (element.parking_type === 2) {
          entity.outside_number = element.num;
        }
      });
      entity.total_number = entity.inside_number + entity.outside_number;
      return entity;
    }));
  }

  /**
   * 获取各区停车场数量
   */
  requestParkingDistrictCount(adcode?: number): Observable<Array<ParkingDistrictCountEntity>> {
    const url = environment.PARKING_DOMAIN + `/parkings/count_by_district${adcode ? '?code=' + adcode : ''}`;
    return this.http.get(url).pipe(map(data => {
      const districtList: Array<ParkingDistrictCountEntity> = [];
      const dictObj = {};
      data.body && data.body.forEach(element => {
        if (!dictObj[element.district]) {
          // 如果不存在该区域则创建
          dictObj[element.district] = new ParkingDistrictCountEntity();
          dictObj[element.district].district_name = element.district;
          districtList.push(dictObj[element.district]);
        }
        const currentItem: ParkingDistrictCountEntity = dictObj[element.district];
        if (element.parking_type === 1) {
          currentItem.inside_number = element.num;
        } else if (element.parking_type === 2) {
          currentItem.outside_number = element.num;
        }
      });
      return districtList;
    }));
  }

  /**
   * 获取热点区域
   * @param section_time 从现在到前n时间的热点区域列表,单位秒,不传默认2小时
   */
  requestParkingHotSpotList(section_time?: number): Observable<Array<ParkingHotSpotEntity>> {
    const url = environment.PARKING_DOMAIN + `/hot_spots${section_time ? '?section_time=' + section_time : ''}`;
    return this.http.get(url).pipe(map(data => {
      if (data.body) {
        return data.body.map(item => ParkingHotSpotEntity.Create(item));
      }
      return [];
    }));
  }

  /**
   * 获取充电桩数量
   */
  requestPowerPoleCount(adcode?: number): Observable<PowerPoleCountEntity> {
    const url = environment.POWER_DOMAIN + `/pole_count_by_charging${adcode ? '?area_code=' + adcode : ''}`;
    return this.http.get(url).pipe(map(data => PowerPoleCountEntity.Create(data.body)));
  }

  /**
   * 获取新能源车辆数
   */
  requestPowerCarCount(): Observable<number> {
    const url = environment.POWER_DOMAIN + `/total_car_count`;
    return this.http.get(url).pipe(map(data => (data.body && data.body.count) ? data.body.count : 0));
  }

  /**
   * 获取城市区域单车数量
   * @param adcode 行政区code
   */
  requestBicycleDistrictCount(adcode?: number): Observable<BicycleDistrictCountEntity> {
    const url = environment.BICYCLE_DOMAIN + `/screen/city_region_bicycle/count${adcode ? '?region_code=' + adcode : ''}`;
    return this.http.get(url).pipe(map(data => BicycleDistrictCountEntity.Create(data.body)));
  }

  /**
   * 获取共享单车注册量和单车数量比
   */
  requestBicycleRatioData(): Observable<Array<BicycleRatioEntity>> {
    const url = environment.BICYCLE_DOMAIN + `/screen/user_bicycle/count`;
    return this.http.get(url).pipe(map(data => {
      if (data.body) {
        return data.body.map((item: any) => BicycleRatioEntity.Create(item));
      }
      return [];
    }));
  }

  /**
   * 获取道路拥堵指数列表
   */
  requestRoadCongestionData(): Observable<Array<RoadTrafficEntity>> {
    const url = environment.PARKING_DOMAIN + `/road_traffic_jams`;
    return this.http.get(url).pipe(map(data => {
      if (data.body) {
        return data.body.map((item: any) => RoadTrafficEntity.Create(item));
      }
      return [];
    }));
  }
}

export class ParkingCountEntity extends EntityBase {
  // parking_type: number = undefined; // 停车场类型 1-路内,2-路外
  // num: number = undefined; // 停车场数量
  inside_number: number = undefined;
  outside_number: number = undefined;
  total_number: number = undefined;
}

export class ParkingDistrictCountEntity extends EntityBase {
  // district: string; // 行政区
  // parking_type: number; // 停车场类型 1-路内,2-路外
  // num: number; // 停车场数量
  inside_number = 0;
  outside_number = 0;
  district_name: string = undefined;
}

export class ParkingHotSpotEntity extends EntityBase {
  hot_spot_id: string = undefined; // 	string(32)	T	热点区域id
  hot_spot_name: string = undefined; // 		string	T	热点区域名
  district: string = undefined; // 		string	T	热点区域所属行政区
  code: string = undefined; // 		string	T	行政区编码
  hot_rate: number = undefined; // 		int	T	出行热度 1-畅通,2-拥挤,3-爆满
  mark_time: number = undefined; // 		int	T	热点区域标记时间戳
  created_time: number = undefined; // 		double	T	创建时间戳
  updated_time: number = undefined; // 		double	T	修改时间戳
}

export class PowerPoleCountEntity extends EntityBase {
  total_count = 0;
  charging_count = 0;
}

export class BicycleDistrictCountEntity extends EntityBase {
  city_region_id: number = undefined;
  city_region_name: string = undefined;
  count: number = undefined;
}

export class BicycleRatioEntity extends EntityBase {
  company_type: number = undefined; // 企业类型1，青桔 2，哈罗 3，美团
  company_id: string = undefined;
  user_count = 0; // 总数
  put_in_count = 0; // 注册数
}

export class RoadTrafficEntity extends EntityBase {
  road_traffic_id: string = undefined; // 	string(32)	T	平台道路id
  remote_road_traffic_id: string = undefined; // 	string(32)	T	第三方道路id
  road_name: string = undefined; // 	string(50)	T	道路名称
  district: string = undefined; // 	string(20)	T	道路所属行政区
  code: number = undefined; // 	string(20)	T	行政区编码
  traffic_jam_rate: number = undefined; // 	int	T	拥堵指数
  created_time: number = undefined; // 	double	T	创建时间戳
  updated_time: number = undefined; // 	double	T	更新时间戳
}
