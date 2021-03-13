import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { EntityBase } from 'src/utils/z-entity';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class CarCountsByTypesEntity extends EntityBase {
  vehicle_type: string = undefined; // 车辆型号
  count: string = undefined; // 车辆数量
}

export class CarCountsByManufacturerEntity extends EntityBase {
  manufacturer_name: string = undefined;
  count: string = undefined;
}

export class SubsidyCarCountsByMonthEntity extends EntityBase {
  time_point: number = undefined;
  car_count: string = undefined;
  month: number = undefined;
}

export class OperatorRanksEntity extends EntityBase {
  operator_name: string = undefined; // 运营商名称
  pole_count: number = undefined; // 充电桩数量
}
export class StationVolumesEntity extends EntityBase {
  station_name: string = undefined; // 充电站名称
  charging_volume: number = undefined; // 充电量
}

export class PoleCountsByStatusEntity extends EntityBase {
  equipment_status: number = undefined; // 充电桩状态 #0:正常,1:离线 2:故障
  count: number = undefined; // 充电桩数量
}

export class SubsidyCountsByOperatorEntity extends EntityBase {
  operator_name: string = undefined; // 运营商名称
  count: number = undefined; // 数量
}

export class ChargingStationsEntity extends EntityBase {
  station_id: number = undefined;
  station_name: number = undefined; // 充电站名称
  operator_name: string = undefined; // 运营商名称
  operator_id: string = undefined; // 运营商id
  station_short_name: string = undefined; // 充电站简称
  area_code: string = undefined; // 所属区域
  station_lng: string = undefined; // 经度
  station_lat: string = undefined; // 纬度
  using_terminal_count: number = undefined; // 使用充电枪数量
  charging_terminal_count: number = undefined; // 充电枪数量
  address: string = undefined; // 详细地址
  service_phone: string = undefined; // 服务电话
}

export class ChargingVolumesByMonthEntity extends EntityBase {
  time_point: number = undefined;  // 时间戳
  charging_volume: number = undefined; // 20.00
}

export class PoleCountByChargingEntity extends EntityBase {
  total_count: number = undefined; // 总充电桩数量
  charging_count: number = undefined; // 充电中充电桩数量
}

export class PoleCountsByTypeEntity extends EntityBase {
  pole_type: number = undefined; // #1:公共桩
  count: number = undefined; // 充电桩数量
}

export class NewEnergyEntity extends EntityBase {
  parking_relief: number = undefined; // 停车减免时长 单位秒
  recharge_relief: number = undefined;  // 充电减免时长
}

@Injectable()
export class PowerHttpService {

  public domain = environment.POWER_DOMAIN;
  public parkingDomain = environment.PARKING_DOMAIN;

  constructor(
    private httpSerivce: HttpService
  ) { }

  // 获取新能源汽车总数  返回{count:0}
  public requestTotalCarCount() {
    const url = `${this.domain}/total_car_count`;
    return this.httpSerivce.get(url);
  }

  // 获取充电用户数 返回{count:0}
  public requestChargingUserCount() {
    const url = `${this.domain}/charging_user_count`;
    return this.httpSerivce.get(url);
  }

  // 获取充电终端数
  public requestChargingTerminalCount() {
    const url = `${this.domain}/charging_terminal_count`;
    return this.httpSerivce.get(url);
  }

  // 获取充电电额 return {'charging_amount':0}  本年充电电额
  public requstChargingAmount(section: string) {
    const url = `${this.domain}/charging_amount`;
    return this.httpSerivce.get(url, { section });
  }

  // 获取充电次数 count 今日充电次数今月充电次数今年充电次数
  public requestChargingCount(section: string) {
    const url = `${this.domain}/charging_count`;
    return this.httpSerivce.get(url, { section });
  }

  // 获取充电站数
  public requestChargingStationCount() {
    const url = `${this.domain}/charging_station_count`;
    return this.httpSerivce.get(url);
  }

  // 获取充电电量 return {'charging_volume':0}
  public requestChargingVolume(section: string) {
    const url = `${this.domain}/charging_volume`;
    return this.httpSerivce.get(url, { section });
  }

  // 获取每种类型新能源车辆数列表  类型-新能源汽车概况
  public requestCarCountsByType(): Observable<CarCountsByTypesLinkResponse> {
    const url = `${this.domain}/car_counts_by_type`;
    return this.httpSerivce.get(url).pipe(map(res => new CarCountsByTypesLinkResponse(res)));
  }

  // 获取每个厂商新能源车辆数列表 厂家-新能源汽车概况
  public requestCarCountsByManufacturer(): Observable<CarCountsByManufacturerLinkResponse> {
    const url = `${this.domain}/car_counts_by_manufacturer`;
    return this.httpSerivce.get(url).pipe(map(res => new CarCountsByManufacturerLinkResponse(res)));
  }

  // 获取每月充电补贴车辆数列表 近一年充电补贴车辆数
  public requestSubsidyCarCountsByMonth(section: string): Observable<SubsidyCarCountsByMonthLinkResponse> {
    const url = `${this.domain}/subsidy_car_counts_by_month`;
    return this.httpSerivce.get(url, { section }).pipe(map(res => new SubsidyCarCountsByMonthLinkResponse(res)));
  }

  // 获取运营商充电桩列表
  public requestOperatorRanks(): Observable<OperatorRanksLinkResponse> {
    const url = `${this.domain}/operator_pole_counts`;
    return this.httpSerivce.get(url).pipe(map(res => new OperatorRanksLinkResponse(res)));
  }

  // 获取充电站电量列表
  public requestStationVolumes(section: string): Observable<StationVolumesLinkResponse> {
    const url = `${this.domain}/station_volumes`;
    return this.httpSerivce.get(url, { section }).pipe(map(res => new StationVolumesLinkResponse(res)));
  }

  // 设备概况 充电桩每种状态数量列表
  public requestPoleCountsByStatus(): Observable<PoleCountsByStatusLinkResponse> {
    const url = `${this.domain}/pole_counts_by_status`;
    return this.httpSerivce.get(url).pipe(map(res => new PoleCountsByStatusLinkResponse(res)));
  }

  // 获取充电补贴次数 今日充电补贴车次累计充电补贴车次 return count
  public requestChargingSubsidyCount(section?: string) {
    const url = `${this.domain}/charging_subsidy_count`;
    if (section) {
      return this.httpSerivce.get(url, { section });
    } else {
      return this.httpSerivce.get(url);
    }
  }

  // 获取按运营商的补贴次数列表 充电补贴车次柱状图
  public requestSubsidyCountsByOperator(): Observable<SubsidyCountsByOperatorLinkResponse> {
    const url = `${this.domain}/subsidy_counts_by_operator`;
    return this.httpSerivce.get(url).pipe(map(res => new SubsidyCountsByOperatorLinkResponse(res)));
  }
  // 充电站列表
  public requestChargingStations(area_code: string, operator_name?: string): Observable<ChargingStationsLinkResponse> {
    const url = `${this.domain}/charging_stations`;
    let params = {};
    operator_name ? params = { area_code, operator_name } : params = { area_code };
    return this.httpSerivce.get(url, params).pipe(map(res => new ChargingStationsLinkResponse(res)));
  }

  // 充电桩充电的数量 充电桩类型占比 充电中/全部
  public requestPoleCountByCharging(): Observable<PoleCountByChargingEntity> {
    const url = `${this.domain}/pole_count_by_charging`;
    return this.httpSerivce.get(url).pipe(map(res => PoleCountByChargingEntity.Create(res.body)));
  }

  // 充电桩每种类型数量列表 充电桩类型占比 全部/公共
  public requestPoleCountsByType(): Observable<PoleCountsByTypeLinkResponse> {
    const url = `${this.domain}/pole_counts_by_type`;
    return this.httpSerivce.get(url).pipe(map(res => new PoleCountsByTypeLinkResponse(res)));
  }

  // 获取按月的充电电量列表  近一年充电量
  public requestChargingVolumesByMonth(section: string): Observable<ChargingVolumesByMonthLinkResponse> {
    const url = `${this.domain}/charging_volumes_by_month`;
    return this.httpSerivce.get(url, { section }).pipe(map(res => new ChargingVolumesByMonthLinkResponse(res)));
  }

  // 获取新能源车辆停车减免时长,充电减免时长
  public requestNewEnergyData(): Observable<NewEnergyEntity> {
    const url = `${this.parkingDomain}/parkings/new_energy`;
    return this.httpSerivce.get(url).pipe(map(res => NewEnergyEntity.Create(res.body)));
  }

  public requestSubsidyCarCounts(section: string) {
    const url = `${this.domain}/subsidy_car_counts`;
    return this.httpSerivce.get(url, { section });
  }
}

export class CarCountsByTypesLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarCountsByTypesEntity> {
    return results.map(res => CarCountsByTypesEntity.Create(res));
  }
}
export class CarCountsByManufacturerLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CarCountsByManufacturerEntity> {
    return results.map(res => CarCountsByManufacturerEntity.Create(res));
  }
}
export class SubsidyCarCountsByMonthLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<SubsidyCarCountsByMonthEntity> {
    return results.map(res => SubsidyCarCountsByMonthEntity.Create(res));
  }
}
export class OperatorRanksLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<OperatorRanksEntity> {
    return results.map(res => OperatorRanksEntity.Create(res));
  }
}
export class StationVolumesLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<StationVolumesEntity> {
    return results.map(res => StationVolumesEntity.Create(res));
  }
}
export class PoleCountsByStatusLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PoleCountsByStatusEntity> {
    return results.map(res => PoleCountsByStatusEntity.Create(res));
  }
}
export class SubsidyCountsByOperatorLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<SubsidyCountsByOperatorEntity> {
    return results.map(res => SubsidyCountsByOperatorEntity.Create(res));
  }
}
export class ChargingStationsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ChargingStationsEntity> {
    return results.map(res => ChargingStationsEntity.Create(res));
  }
}
export class PoleCountsByTypeLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<PoleCountsByTypeEntity> {
    return results.map(res => PoleCountsByTypeEntity.Create(res));
  }
}
export class ChargingVolumesByMonthLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<ChargingVolumesByMonthEntity> {
    return results.map(res => ChargingVolumesByMonthEntity.Create(res));
  }
}
