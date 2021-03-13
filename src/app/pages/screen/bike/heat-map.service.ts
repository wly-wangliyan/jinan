import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { EntityBase } from '../../../../utils/z-entity';
import { ConfigureEntity } from './bike-http.service';
import { HttpService, LinkResponse } from '../../../core/http.service';
import { environment } from '../../../../environments/environment';

export class ConfigureItemEntity extends EntityBase {
  public range: string = undefined; // 阀值范围 '0,200'或'800'
  public color: string = undefined; // 颜色
}

export class SearchBicycleParams extends EntityBase {
  public min_point: string = undefined; // T	矩形左下点坐标('12.34,12.34')
  public max_point: string = undefined; // T 矩形右上点坐标('12.34,12.34')
  public company_id: string = undefined; // T 企业ID
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

export class CompanyCountEntity extends EntityBase {
  public company_count = undefined; // {企业id : 企业单车数量}
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
    // if (propertyName === 'company_count') {
    //   return CompanyCountEntity;
    // }
    return null;
  }

  public skipParseObject(propertyName: string): boolean {
    return propertyName === 'company_count';
  }
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

  public getPropertyClass(propertyName: string): typeof EntityBase {
    // if (propertyName === 'company_count') {
    //   return CompanyCountEntity;
    // }
    return null;
  }

  public skipParseObject(propertyName: string): boolean {
    return propertyName === 'company_count';
  }
}

// 单车信息实体
export class BicycleStatisticsEntity extends EntityBase {
  public company_type: number = undefined; // string T	企业类型
  public bicycle_id: string = undefined; // string	T	单车id
  public bicycle_point: string = undefined; // string	T	单车坐标
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

export class BlockStatisticsLinkResponse extends LinkResponse {
  public generateEntityData(results: Array<any>): Array<BlockStatisticsEntity> {
    const tempList: Array<BlockStatisticsEntity> = [];
    results.forEach(res => {
      tempList.push(BlockStatisticsEntity.Create(res));
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

@Injectable({
  providedIn: 'root'
})
export class HeatMapService {
  private domain = environment.BICYCLE_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**** 实时信息 ****/

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
}
