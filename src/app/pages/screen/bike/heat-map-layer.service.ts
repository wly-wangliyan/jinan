import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EntityBase } from '../../../../utils/z-entity';
import { HttpService } from '../../../core/http.service';
import { ConfigureItemEntity, HeatMapLayerEntity, RegionEntity } from './bike-http.service';

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


// 阀值
export class RangeEntity extends EntityBase {
  public start: number = undefined; // 阀值范围 '0,200'或'800'
  public end: number = undefined; // 颜色
}

// 颜色配置
export class ColorConfigureEntity extends ConfigureItemEntity {
  public rangeObject: RangeEntity = undefined;

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'rangeObject') {
      return RangeEntity;
    }
    return null;
  }
}

// 热力图层
export class HeatMapLayerItem extends HeatMapLayerEntity {
  public granularity: GranularityEntity = undefined; // 统计粒度
  public regions: Array<RegionEntity> = undefined; // 区域集合

  public getPropertyClass(propertyName: string): typeof EntityBase {
    if (propertyName === 'granularity') {
      return GranularityEntity;
    }
    if (propertyName === 'regions') {
      return RegionEntity;
    }
    if (propertyName === 'layer_color_configure') {
      return ConfigureItemEntity;
    }
    return null;
  }
}

// 编辑自定义图层
export class EditCuntomLayerParams extends EntityBase {
  public region_ids: string = undefined; // 区域id集合
  public remark: string = undefined; // 备注
}


@Injectable({
  providedIn: 'root'
})
export class HeatMapLayerService {
  private domain = environment.BICYCLE_DOMAIN;

  constructor(private httpService: HttpService) { }

  /**获取图层信息列表
   * @returns Observable<Array<HeatMapLayerItem>>
   */
  public requestHeatMapLayerListData(): Observable<Array<HeatMapLayerItem>> {
    const httpUrl = `${this.domain}/heat_map_layers`;
    return this.httpService.get(httpUrl).pipe(map(result => {
      const tempList: Array<HeatMapLayerItem> = [];
      result.body.forEach((res: HeatMapLayerItem) => {
        tempList.push(HeatMapLayerItem.Create(res));
      });
      return tempList;
    }));
  }

  /**图层信息详情
   * @param heat_map_layer_id string 图层ID
   * @returns Observable<HeatMapLayerItem>
   */
  public requestHeatMapLayerDetailData(heat_map_layer_id: string): Observable<HeatMapLayerItem> {
    const httpUrl = `${this.domain}/heat_map_layers/${heat_map_layer_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => HeatMapLayerItem.Create(res.body)));
  }

  /**
   * 编辑基础图层统计粒度
   * @param granularity_id string 主键id
   * @param editParams GranularityEntity
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditGranularityData(granularity_id: string, editParams: GranularityEntity
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/granularities/${granularity_id}`;
    return this.httpService.put(httpUrl, editParams.toEditJson());
  }

  /**获取单个基础图层粒度配置信息
   * @param granularity_id string 主键id
   * @returns Observable<GranularityEntity>
   */
  public requestGranularityDetailData(granularity_id: string): Observable<GranularityEntity> {
    const httpUrl = `${this.domain}/granularities/${granularity_id}`;
    return this.httpService.get(httpUrl).pipe(map(res => GranularityEntity.Create(res.body)));
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

  /**
   * 设置热力颜色
   * @param heat_map_layer_id string 图层ID
   * @param editParams  Array<ColorConfigureEntity>
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditLayerColorConfigureData(heat_map_layer_id: string, editParams: Array<ColorConfigureEntity>
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/heat_map_layers/${heat_map_layer_id}/layer_color_configure`;
    const body = { layer_color_configure: editParams };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 编辑自定义图层信息
   * @param heat_map_layer_id string 图层ID
   * @param editParams  EditCuntomLayerParams
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditCustomLayerData(heat_map_layer_id: string, editParams: EditCuntomLayerParams
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/heat_map_layers/${heat_map_layer_id}`;
    return this.httpService.put(httpUrl, editParams.json());
  }

  /**
   * 修改基础图层粒度配置信息阀值
   */
  public requestEditThresholdConfigure(granularity_id: string, editParams: Array<ColorConfigureEntity>): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/granularities/${granularity_id}/threshold_configure`;
    return this.httpService.patch(httpUrl, { threshold_configure: editParams });
  }

  /**
   * 设置基础图层中心点
   * @param heat_map_layer_id string 图层ID
   * @param layer_core string 中心点坐标
   * @param layer_core_name string 图层中心点名称
   * @returns Observable<HttpResponse<any>>
   */
  public requestEditBaseLayerCenterPointData(heat_map_layer_id: string, layer_core: string, layer_core_name: string
  ): Observable<HttpResponse<any>> {
    const httpUrl = `${this.domain}/heat_map_layers/${heat_map_layer_id}/layer_core`;
    const body = { layer_core, layer_core_name };
    return this.httpService.patch(httpUrl, body);
  }

  /**
   * 获取所有区域列表
   * @returns Subject<[Array<RegionEntity>]
   */
  public requestAllRegionListData(): Observable<Array<RegionEntity>> {
    const url = `${this.domain}/regions?page_num=1&page_size=100`;
    const subject = new Subject<Array<any>>();
    this.requestLinkAllRegionList(url, [], subject);
    return subject;
  }

  /**
   * 递归获取所有区域列表
   * @param url linkUrl
   * @param dataArray 数据
   * @param subject 通知
   */
  private requestLinkAllRegionList(url: string, dataArray: Array<any>, subject: Subject<Array<any>>) {
    this.httpService.get(url).subscribe(data => {
      // 数据转换
      const results = data.body;
      results.forEach(jsonObj => {
        const dataEntity: RegionEntity = RegionEntity.Create(jsonObj);
        dataArray.push(dataEntity);
      });

      // 查看是否有分页,如果有则继续获取
      const linkInfo: string = data.headers.get('Link');
      if (linkInfo) {
        const linkUrl = linkInfo.split('>')[0].split('<')[1];
        this.requestLinkAllRegionList(linkUrl, dataArray, subject);
      } else {
        subject.next(dataArray);
        subject.complete();
      }
    }, err => {
      subject.error(err);
    });
  }
}
