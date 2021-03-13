import { map } from 'rxjs/internal/operators';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityBase } from '../../../../utils/z-entity';
import { environment } from '../../../../environments/environment';

export class SearchParams extends EntityBase {
  public section: string = undefined; // T	时间区间
  public company_id = 'all'; // T 企业ID
}

export class StatisticCountEntity extends EntityBase {
  // 单车静止和行驶状态统计量
  public travel_count: number = undefined; // 行驶单车数量
  public static_count: number = undefined; // 静态单车数量

  public company_type: number = undefined; // 企业简称类型
  public company_id: string = undefined; // 企业id
  // 用户量
  public user_count: number = undefined; // 用户量
  // 各个投放状态的统计量
  public normal_count: number = undefined; // 普通单车数量
  public assistance_count: number = undefined; // 助力单车数量
  public put_in_count: number = undefined; // 已投放数量
  public not_put_count: number = undefined; // 未投放数量
  public maintenance_count: number = undefined; // 维修中数量
  public recovered_count: number = undefined; // 已回收数量
  // 企业当天的订单，单车调度，事件的统计量
  public order_count: number = undefined; // 订单数
  public dispatch_count: number = undefined; // 调度数
  public event_count: number = undefined; // 事件数
}

export class CompanyEntity extends EntityBase {
  public company_id: string = undefined; // string T	公司id
  public company_name: string = undefined; // string	T	公司名称
  public company_type: any = ''; // 企业类型 1:青桔 2:哈罗 3:摩拜
  public company_address: string = undefined; // string	T	公司地址
  public legal_person: string = undefined; // string T	公司法人
  public contacts: string = undefined; // string T	企业联系人
  public contacts_phone_num: string = undefined; // string T	企业联系人手机号
  public business_license: string = undefined; // string T	营业执照代码
  public business_license_image: string = undefined; // string T	营业执照照片
  public client_id: string = undefined; // string T	client_id
  public client_secret: string = undefined; // string T	client_secret
  public updated_time: number = undefined; // 	float	更新时间
  public created_time: number = undefined; // 	float	创建时间

  public toEditJson(): any {
    const json = this.json();
    delete json.company_id;
    delete json.client_id;
    delete json.client_secret;
    delete json.updated_time;
    delete json.created_time;
    return json;
  }
}

// 单车订单周转率统计
export class OrdersTurnoverStatisticsByDayEntity extends EntityBase {
  public order_turnover_statistics_by_day_id: string = undefined; // 主键id
  public company_id: string = undefined; // 企业id
  public company_type = 0; // 企业类型
  public turnover_rate: number = undefined; // float	周转率
  public put_in_count: number = undefined; // int	已投放单车数
  public total_count: number = undefined; // int	单车总数
  public time_point: number = undefined; // 统计时间点
  public updated_time: number = undefined; // 	float	更新时间
  public created_time: number = undefined; // 	float	创建时间
}

// 单车使用率统计
export class OrdersUtilizationStatisticsByDayEntity extends EntityBase {
  public order_utilization_statistics_by_day_id: string = undefined; // 主键id
  public company_id: string = undefined; // 企业id
  public company_type = 0; // 企业类型
  public utilization_rate: number = undefined; // float	使用率
  public absolutely_count: number = undefined; // int	去重单车数
  public total_count: number = undefined; // int	单车总数
  public time_point: number = undefined; // 统计时间点
  public updated_time: number = undefined; // 	float	更新时间
  public created_time: number = undefined; // 	float	创建时间
}

export class SearchBicycleParams extends EntityBase {
  public min_point: string = undefined; // T	矩形左下点坐标('12.34,12.34')
  public max_point: string = undefined; // T 矩形右上点坐标('12.34,12.34')
  public company_id: string = undefined; // T 企业ID
}

// 统计粒度
export class GranularityEntity extends EntityBase {
  public granularity_id: string = undefined; // 主键id
  public heat_map_layer_id: string = undefined; // 图层id
  public granularity_x: number = undefined; // 统计粒度横坐标设置
  public granularity_y: number = undefined; // 统计粒度纵坐标设置
  public min_scale: number = undefined; // 比例尺最小值
  public max_scale: number = undefined; // 比例尺最小值
  public color_configure: Array<ConfigureItemEntity> = undefined; // 颜色配置
  public threshold_configure: Array<ConfigureItemEntity> = undefined; // 阀值配置

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'threshold_configure' || propertyName === 'color_configure') {
      return ConfigureItemEntity;
    }
    return null;
  }

  public toEditJson(): any {
    const json = this.json();
    delete json.granularity_id;
    delete json.heat_map_layer_id;
    delete json.min_scale;
    delete json.max_scale;
    delete json.threshold_configure;
    return json;
  }
}

// 单车信息实体
export class BicycleStatisticsEntity extends EntityBase {
  public company_type: number = undefined; // string T	企业类型
  public bicycle_id: string = undefined; // string	T	单车id
  public bicycle_point: string = undefined; // string	T	单车坐标
}

export class BicycleRecordsEntity extends EntityBase {
  company_type: number = undefined;
  company_id: string = undefined;
  put_in_count: number = undefined;
  not_beian_count: number = undefined;
  zombied_count: number = undefined;

}

// 基础图层实体
export class BlockStatisticsEntity extends EntityBase {
  public block_statistics_id: string = undefined; // string T	主键id
  public block_center: string = undefined; // string	T	block中心点
  public layer_id: string = undefined; // string	T	图层id
  public block_id: string = undefined; // string T	区域id
  public count: number = undefined; // string T	单车数量
  public company_count = undefined; // T	公司单车数量详情
  public updated_time: number = undefined; // 	float	更新时间
  public created_time: number = undefined; // 	float	创建时间

  public skipParseObject(propertyName: string): boolean {
    return propertyName === 'company_count';
  }
}

// 区域统计信息实体
export class RegionalStatisticsEntity extends EntityBase {
  public regional_statistics_id: string = undefined; // string T	主键id
  public layer_id: string = undefined; // string	T	图层id
  public region_scope: string = undefined; // string	T区域范围(坐标点集合)
  public region_core: string = undefined; // string	T 区域中心点
  public region_name: string = undefined; // string T	区域名称
  public region_id: string = undefined; // string T	区域id(基础图层是block_id)
  public count: number = undefined; // int T	单车数量
  public warning_level: number = undefined; // int	预警级别 0,没有 1,正常 2,黄色 3,红色
  public region_alert_configure: Array<ConfigureEntity> = undefined; // ConfigureEntity	区域预警配置
  public company_count: any = undefined; // T	公司单车数量详情
  public updated_time: number = undefined; // 	float	更新时间
  public created_time: number = undefined; // 	float	创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region_alert_configure') {
      return ConfigureEntity;
    }
    return null;
  }
}


// 预警设置实体
export class ConfigureEntity extends EntityBase {
  public start_time: any = undefined; // string 开始时间
  public end_time: any = undefined; // string 结束时间
  public time_errors = false; // 时间范围判断
  public normal_range: string = undefined; // string 正常范围
  public normal_start_range: string = undefined; // string 正常范围
  public normal_end_range: string = undefined; // string 正常范围
  public normal_range_errors = false; // 正常范围判断
  public yellow_range: string = undefined; // string 黄色预警
  public yellow_start_range: number = undefined; // string 黄色预警
  public yellow_end_range: string = undefined; // string 黄色预警
  public yellow_range_errors = false; // 黄色预警范围判断
  public red_range: number = undefined; // string 红色预警
  public time = new Date().getTime(); // string 红色预警
}

export class ConfigureItemEntity extends EntityBase {
  public range: string = undefined; // 阀值范围 '0,200'或'800'
  public color: string = undefined; // 颜色
}

// 热力图图层实体
export class HeatMapLayerEntity extends EntityBase {
  public heat_map_layer_id: string = undefined; // string T	图层id
  public layer_name: string = undefined; // string	T	图层名称
  public layer_type: number = undefined; // int	T	图层类型 0,基础图层 1,自定义图层
  public granularity_status: number = undefined; // int T	统计粒度状态 0,没变 1,改变
  public region_status: number = undefined; // int T	关联区域状态 0,没变 1,改变
  public layer_core: string = undefined; // string T	图层中心
  public layer_core_name: string = undefined; // string T	图层中心名称
  public layer_area: number = undefined; // int T	图层面积
  public layer_color_configure: Array<ConfigureItemEntity> = undefined; // string T	图层颜色配置
  public remark: string = undefined; // string T	备注
  public updated_time: number = undefined; // 	float	更新时间
  public created_time: number = undefined; // 	float	创建时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'layer_color_configure') {
      return ConfigureItemEntity;
    }
    return null;
  }
}

export class RegionLabelListEntity extends EntityBase {
  region_name: string = undefined;
  count: number = undefined;
  region_ids: Array<string> = undefined;
}
export class RegionLabelCountEntity extends EntityBase {
  label_name: string = undefined;
  count: number = undefined;
  region_label_id: string = undefined;
  region_ids: Array<string> = undefined;
  tmpNum = '0';
}

export class InspectionResultsEntity extends EntityBase {
  company_type: number = undefined;
  company_id: string = undefined;
  total_count: number = undefined;
  beian_count: number = undefined;
  not_beian_count: number = undefined;
}

export class RegionEntity extends EntityBase {
  public region_id: string = undefined; // string	区域id
  public region_name: string = undefined; // string	区域名称
  public region_scope: any = undefined; // string	区域范围(坐标点集合)
  public region_area: number = undefined; // int 区域面积
  public region_core: string = undefined; // string	区域中心
  public region_core_name: string = undefined; // string	区域中心名称
  public region_alert_configure: Array<ConfigureEntity> = undefined; // ConfigureEntity	区域预警配置
  public created_time: number = undefined; // int	创建时间
  public updated_time: number = undefined; // int	更新时间

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'region_alert_configure') {
      return ConfigureEntity;
    }
    return null;
  }
}

@Injectable()
export class BikeHttpService {
  private domain = environment.BICYCLE_DOMAIN;

  constructor(
    private httpService: HttpService
  ) { }

  /**
   * 获取企业下各个投放状态的统计量
   * @param company_id 企业Id
   * @returns Observable<Array<StatisticCountEntity>>
   */
  public requestPutStatusCountData(company_id: string): Observable<Array<StatisticCountEntity>> {
    const httpUrl = `${this.domain}/companies/put_status_count`;
    const body = { company_id };
    return this.httpService.get(httpUrl, body).pipe(map(result => {
      const tempList: Array<StatisticCountEntity> = [];
      result.body.forEach((res: StatisticCountEntity) => {
        tempList.push(StatisticCountEntity.Create(res));
      });
      return tempList;
    }));
  }

  /**获取全部企业备案列表
   * @returns Observable<CompanyLinkResponse>
   */
  public requestEnterpriseRecordAllList(): Observable<CompanyLinkResponse> {
    return this.httpService.get(`${this.domain}/admin/beian/companys`, { all: 2 })
      .pipe(map(res => new CompanyLinkResponse(res)));
  }

  /*
 * 获取单车周转率统计列表
 * @param searchParams SearchParams 查询参数
 * @returns Observable<OrdersTurnoverStatisticsByDayResponse>
 */
  public requestOrdersTurnoverStatisticsByDayList(searchParams: SearchParams): Observable<OrdersTurnoverStatisticsByDayResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService
      .get(`${this.domain}/orders_turnover_statistics_by_day`, params)
      .pipe(map(res => new OrdersTurnoverStatisticsByDayResponse(res)));
  }

  // 大屏获取企业下单车种类数量(第一大屏企业单车种类数量对比)
  public requestBicycleTypeCountOfCompanyData(): Observable<Array<StatisticCountEntity>> {
    const httpUrl = `${this.domain}/screen/companies/type_count`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<StatisticCountEntity> = [];
      result.body.forEach((res: StatisticCountEntity) => {
        tempList.push(StatisticCountEntity.Create(res));
      });
      return tempList;
    }));
  }

  /*
 * 获取单车使用率统计列表
 * @param searchParams SearchParams 查询参数
 * @returns Observable<OrdersUtilizationStatisticsByDayResponse>
 */
  public requestOrdersUtilizationStatisticsByDayList(searchParams: SearchParams): Observable<OrdersUtilizationStatisticsByDayResponse> {
    const params = this.httpService.generateURLSearchParams(searchParams);
    return this.httpService
      .get(`${this.domain}/orders_utilization_statistics_by_day`, params)
      .pipe(map(res => new OrdersUtilizationStatisticsByDayResponse(res)));
  }

  /*
   * 获取矩形内的单车数据
   * @param searchBicycleParams SearchBicycleParams 查询参数
   * @returns Observable<BicycleStatisticsEntityLinkResponse>
   */
  public requestAllRectangleInfoList(searchBicycleParams: SearchBicycleParams): Observable<
    BicycleStatisticsEntityLinkResponse
  > {
    const params = this.httpService.generateURLSearchParams(searchBicycleParams);
    return this.httpService
      .get(`${this.domain}/admin/rectangle/bicycles`, params)
      .pipe(map(res => new BicycleStatisticsEntityLinkResponse(res)));
  }

  /*
     * 自定义图层(获取所有)
     * @param heat_map_layer_id string 查询参数
     * @returns Observable<RegionalStatisticsEntityLinkResponse>
     */
  public requestRegionalStatisticsInfoList(
    heat_map_layer_id: string
  ): Observable<RegionalStatisticsEntityLinkResponse> {
    return this.httpService
      .get(`${this.domain}/regional_statistics`, {
        heat_map_layer_id
      })
      .pipe(map(res => new RegionalStatisticsEntityLinkResponse(res)));
  }

  /*
   * 获取图层信息列表
   * @returns Observable<HeatMapLayerEntityLinkResponse>
   */
  public requestHeatMapLayerList(): Observable<HeatMapLayerEntityLinkResponse> {
    return this.httpService
      .get(`${this.domain}/heat_map_layers`)
      .pipe(map(res => new HeatMapLayerEntityLinkResponse(res)));
  }

  /*
* 基础图层(获取所有)
* @param granularity_id string 查询参数
* @returns Observable<BlockStatisticsLinkResponse>
*/
  public requestAllBlockStatisticsInfoList(granularity_id: string): Observable<
    BlockStatisticsLinkResponse
  > {
    return this.httpService
      .get(`${this.domain}/block_statistics`, { granularity_id })
      .pipe(map(res => new BlockStatisticsLinkResponse(res)));
  }


  /**获取不同比例尺下的统计粒度和阀值列表
   * @returns Observable<Array<GranularityEntity>>
   */
  public requestGranularityListData(): Observable<Array<GranularityEntity>> {
    const httpUrl = `${this.domain}/granularities`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<GranularityEntity> = [];
      result.body.forEach((res: GranularityEntity) => {
        tempList.push(GranularityEntity.Create(res));
      });
      return tempList;
    }));
  }

  // 大屏获取企业下单车行驶中数量(第一大屏单车行驶中实时数量)
  public requestBicycleTravelCountData(): Observable<Array<StatisticCountEntity>> {
    const httpUrl = `${this.domain}/screen/companies/status_count`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<StatisticCountEntity> = [];
      result.body.forEach((res: StatisticCountEntity) => {
        tempList.push(StatisticCountEntity.Create(res));
      });
      return tempList;
    }));
  }

  // 大屏获取企业下订单数量(第一大屏今日订单实时数量)
  public requestBicycleOrderCountData(): Observable<Array<StatisticCountEntity>> {
    const httpUrl = `${this.domain}/screen/companies/orders_count`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<StatisticCountEntity> = [];
      result.body.forEach((res: StatisticCountEntity) => {
        tempList.push(StatisticCountEntity.Create(res));
      });
      return tempList;
    }));
  }

  // 获取单车记录
  public requestBicycleRecords(): Observable<BicycleRecordsLinkResponse> {
    const url = `${this.domain}/screen/bicycle_record/message`;
    return this.httpService.get(url).pipe(map(res => new BicycleRecordsLinkResponse(res)));
  }

  // 获取单车商圈数量
  public requestRegionLabelCount(): Observable<BicycleRegionLableCountLinkResponse> {
    const url = `${this.domain}/screen/region_label/count`;
    return this.httpService.get(url).pipe(map(res => new BicycleRegionLableCountLinkResponse(res)));
  }

  // 获取单车巡检结果
  public requestInspectionResults(section: string): Observable<InspectionResultsLinkResponse> {
    const url = `${this.domain}/screen/inspection_record/count`;
    return this.httpService.get(url, { section }).pipe(map(res => new InspectionResultsLinkResponse(res)));
  }

  // 获取区域列表
  public requestRegionLabelList(regionLabelId: string): Observable<RegionLabelListLinkResponse> {
    const url = `${this.domain}/screen/region_labels/${regionLabelId}/count_list`;
    return this.httpService.get(url).pipe(map(res => new RegionLabelListLinkResponse(res)));
  }
}


export class RegionLabelListLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RegionLabelListEntity> {
    return results.map(res => RegionLabelListEntity.Create(res));
  }
}
export class InspectionResultsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<InspectionResultsEntity> {
    return results.map(res => InspectionResultsEntity.Create(res));
  }
}
export class BicycleRegionLableCountLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<RegionLabelCountEntity> {
    return results.map(res => RegionLabelCountEntity.Create(res));
  }
}
export class BicycleRecordsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BicycleRecordsEntity> {
    return results.map(res => BicycleRecordsEntity.Create(res));
  }
}
export class CompanyLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<CompanyEntity> {
    const tempList: Array<CompanyEntity> = [];
    results.forEach(res => {
      tempList.push(CompanyEntity.Create(res));
    });
    return tempList;
  }
}

export class OrdersTurnoverStatisticsByDayResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<OrdersTurnoverStatisticsByDayEntity> {
    const tempList: Array<OrdersTurnoverStatisticsByDayEntity> = [];
    results.forEach(res => {
      tempList.push(OrdersTurnoverStatisticsByDayEntity.Create(res));
    });
    return tempList;
  }
}

export class OrdersUtilizationStatisticsByDayResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<OrdersUtilizationStatisticsByDayEntity> {
    const tempList: Array<OrdersUtilizationStatisticsByDayEntity> = [];
    results.forEach(res => {
      tempList.push(OrdersUtilizationStatisticsByDayEntity.Create(res));
    });
    return tempList;
  }
}

export class RegionalStatisticsEntityLinkResponse extends LinkResponse {
  public generateEntityData(
    results: Array<any>
  ): Array<RegionalStatisticsEntity> {
    const tempList: Array<RegionalStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(RegionalStatisticsEntity.Create(res));
    });
    return tempList;
  }
}

export class BlockStatisticsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BlockStatisticsEntity> {
    const tempList: Array<BlockStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(BlockStatisticsEntity.Create(res));
    });
    return tempList;
  }
}


export class BicycleStatisticsEntityLinkResponse extends LinkResponse {
  public generateEntityData(
    results: Array<any>
  ): Array<BicycleStatisticsEntity> {
    const tempList: Array<BicycleStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(BicycleStatisticsEntity.Create(res));
    });
    return tempList;
  }
}

export class HeatMapLayerEntityLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<HeatMapLayerEntity> {
    const tempList: Array<HeatMapLayerEntity> = [];
    results.forEach(res => {
      tempList.push(HeatMapLayerEntity.Create(res));
    });
    return tempList;
  }
}
