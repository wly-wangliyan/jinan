import { BikeHttpService } from '../../bike-http.service';
import { REFRESH_DURATION } from '../../../../../core/timer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs/index';
import { GlobalConst } from '../../../../../share/global-const';
import {
  BicycleStatisticsEntity,
  BlockStatisticsEntity,
  GranularityEntity,
  RegionalStatisticsEntity,
  SearchBicycleParams
} from '../../bike-http.service';
import { HeatMapService } from '../../heat-map.service';
import { ZHeatMapPipe } from '../../pipes/z-heat-map.pipe';
import { TimerService } from '../../../../../core/timer.service';
import { HeatMapLayerService } from '../../heat-map-layer.service';
import { BicycleAreaNumListenerService } from '../../bicycle-area-num-listener.service';
import { WarningLevelColorPipe, WarningLevelTextPipe } from '../../pipes/full-screen-bicycle.pipe';

@Component({
  selector: 'app-heat-map-level',
  templateUrl: './heat-map-level.component.html',
  styleUrls: ['./heat-map-level.component.less']
})
export class HeatMapLevelComponent implements OnInit, OnDestroy {
  public isShowBasicHeatMap = true; // 默认显示基础图层
  public isShowCustomHeatMap = true; // 默认显示自定义图层
  private heatBasicPoints = []; // 基础图层热力图
  public companyId = '';
  private infoWindow: any; // 信息窗体
  public isCompletedMap = false; // 标记地图是否加载完成
  public companyList: Array<any> = [];
  private granularityList: Array<GranularityEntity> = []; // 统计粒度信息
  private markerList: Array<any> = []; // 预警图层marker列表

  private map: any; // 地图图层
  private heatMap: any; // 热力图图层
  public get heatMapH() {
    return this.heatMap;
  }

  private polygon: any; // 自定义图层
  private bicycleMarker: any; // 单车数量图层
  private regionCenter = GlobalConst.RegionCenter; // 基础图层中心点
  private cluster: any; // 聚合图层
  private clusterMarkers = []; // 单车点(聚合)
  private count: number;
  private mapCompleteEventListener: any; // 地图图块加载完成后触发事件
  private mapMoveStartEventListener: any; // 地图平移时触发事件
  private mapDragStartEventListener: any; // 地图拖拽开始时触发事件
  private mapDragEndEventListener: any; // 地图拖拽结束时触发事件
  private mapZoomStartEventListener: any; // 地图缩放开始时触发事件
  private mapZoomEndEventListener: any; // 地图缩放结束时触发事件
  private mapClickEventListener: any; // 地图点击事件
  private timerTenMinutesSubscription: Subscription;
  private heatBasicStatistics: Array<BlockStatisticsEntity> = []; // 基础图层数据
  private heatCustomStatistics: Array<RegionalStatisticsEntity> = []; // 自定义图层数据
  private initBasicStatistics: Array<BlockStatisticsEntity> = []; // 基础图层数据
  private initCustomStatistics: Array<RegionalStatisticsEntity> = []; // 自定义图层数据
  public get initCustomStatisticsH() {
    return this.initCustomStatistics;
  }

  private searchBicycleParams: SearchBicycleParams = new SearchBicycleParams(); // 矩形内范围
  private defaultColor = [
    {range: '', color: '#00ffc6'},
    {range: '', color: '#001eff'},
    {range: '', color: '#04e508'},
    {range: '', color: '#F9CB11'},
    {range: '', color: '#FD1318'}]; // 系统默认颜色
  private searchText$ = new Subject<any>();
  private requestBicycleSubscription$: Subscription; // 订阅矩形内单车信息分发
  private heatMapRadius = 100; // 热力图中单个点的半径，默认：30，单位：pixel
  private heatBasicMapMax = 3; // 基础图层热力图显示的权值
  private heatBasicColorConfig = []; // 基础图层热力颜色及阀值
  private heatCustomColorConfig = []; // 自定义图层区域颜色
  private polygonList = []; // 区域集合
  private bicycleMarkerList = []; // 单车数据集合
  private autocomplete: any; // 输入提示
  public tipList = []; // 提示检索结果，最多10条不可分页
  private bicycleIcons = {
    1: {icon: '/assets/bike-images/qingju.png', color: '#81C1B0'},
    2: {icon: '/assets/bike-images/haluo.png', color: '#0195FF'},
    3: {icon: '/assets/bike-images/mobai.png', color: '#F15A49'}
  }; // 企业单车图标

  private areaBicycleNumDivClickSubscription$: Subscription;

  private selectMapContentInfoWindow: any; // 当前信息窗体

  private regionIds = []; // 弹窗传入数据

  constructor(
    private heatMapService: HeatMapService,
    private heatMapLayerService: HeatMapLayerService,
    private timerService: TimerService,
    private bicycleAreaNumListenerSerivice: BicycleAreaNumListenerService,
    private bikeService: BikeHttpService
  ) {
  }

  public ngOnInit() {
    this.timerService.startTimer();
    this.initBasicMap();
    this.initMapEvents();
    this.getHeatMapData(1);
    this.timerTenMinutesSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.getHeatMapData(2);
    });
    // 获取单车数据
    this.searchText$.pipe(debounceTime(500)).subscribe(res => {
      this.requestBicycleData();
    });

    this.getCompanyList();

    this.areaBicycleNumDivClickSubscription$ && this.areaBicycleNumDivClickSubscription$.unsubscribe();
    this.areaBicycleNumDivClickSubscription$ = this.bicycleAreaNumListenerSerivice.areaBicycleNumDivClick$.subscribe((res) => {
      if (res === 'back') {
        this.isShowBasicHeatMap && this.heatMap && this.heatMap.show();
        this.removeBicycleMarkerLayer();
        if (this.companyId) {
          this.isShowCustomHeatMap && this.showCustomMapInfo(this.heatCustomStatistics);
        } else {
          this.isShowCustomHeatMap && this.showCustomMapInfo(this.initCustomStatistics);
        }
      } else {
        this.regionIds = res.region_ids;
        this.heatMap && this.heatMap.hide();
        if (this.companyId) {
          this.isShowBasicHeatMap && this.showMarkerMapInfo(this.heatCustomStatistics);
          this.isShowCustomHeatMap && this.showCustomMapInfo(this.heatCustomStatistics);
        } else {
          this.isShowBasicHeatMap && this.showMarkerMapInfo(this.initCustomStatistics);
          this.isShowCustomHeatMap && this.showCustomMapInfo(this.initCustomStatistics);
        }
      }
    });
  }

  public getCompanyList() {
    this.bikeService.requestEnterpriseRecordAllList().subscribe(res => {
      this.companyList = res.results;
    });
  }

  // 获取矩形框内单车信息
  private requestBicycleData(): void {
    this.requestBicycleSubscription$ = this.heatMapService.requestAllRectangleInfoList(
      this.searchBicycleParams).subscribe(res => {
      if (this.map.getZoom() < 15) {
        this.handelBasicHeatMapData(res.results || []);
        this.isShowBasicHeatMap && this.heatMap && this.heatMap.show();
      } else {
        this.heatMap && this.heatMap.hide();
      }
      this.handelBicycleClusterData(res.results || []);
    });
  }

  /**
   * 初始化地图及组件
   */
  private initBasicMap(): void {
    // 初始化地图
    this.map = new AMap.Map('bike-map-container', {
      resizeEnable: true,
      expandZoomRange: false,
      center: GlobalConst.RegionCenter,
      zoom: 11,
      zooms: [11, 20], // 式样:比例尺不能高于5公里
      mapStyle: 'amap://styles/cbe873634cd94cf43b94eeebc85a1727',
    });
    this.map.setFeatures(['bg', 'point', 'road']);
  }

  /**
   * 生成预警点标记
   * @param point Array<number> 区域中心点坐标
   * @param regionItem 单个区域统计信息
   */
  private generateMarker(point: Array<number> = [], regionItem: RegionalStatisticsEntity): any {
    // 只显示饱和及超限状态
    if (regionItem && regionItem.warning_level !== 1) {
      const markerDiv = document.createElement('div');
      const markerDivCenter = document.createElement('div');
      markerDivCenter.className = 'flashing-marker-center';
      markerDiv.className = 'flashing-marker';
      markerDivCenter.appendChild(markerDiv);
      markerDivCenter.style.background = new WarningLevelColorPipe().transform(regionItem.warning_level);
      markerDiv.style.background = new WarningLevelColorPipe().transform(regionItem.warning_level);
      const marker = new AMap.Marker({
        content: markerDivCenter,
        position: new AMap.LngLat(Number(point[0]), Number(point[1])),
        address: '',
        offset: new AMap.Pixel(0, 0), // 此处在css已对闪烁点做偏移
        extData: {
          geocoder: null, // 地理编码
          regeocode: null // 逆向编码信息
        },
      });
      marker.on('click', (event: any) => {
        this.onShowRangeInfo(regionItem, event.lnglat, true);
      });
      return marker;
    } else {
      return null;
    }
  }


  /**
   * 初始化预警点标记信息（位于区域中心点）
   * @param pointList Array<number> 区域中心点坐标
   * @param regionItem 单个区域统计信息
   */
  private initMarkerInfo(pointList: Array<any>, regionItem: RegionalStatisticsEntity): void {
    if (pointList && pointList.length > 0) {
      const marker = this.generateMarker(pointList, regionItem);
      if (marker) {
        this.markerList.push(marker);
      }
    }
  }

  /**
   * 初始化地图事件
   */
  private initMapEvents(): void {
    // 地图图块加载完成后触发事件
    this.mapCompleteEventListener = AMap.event.addListener(
      this.map, 'complete', () => {
        this.isCompletedMap = true;
        // 地图点击时触发事件
        this.mapClickEventListener = AMap.event.addListener(this.map, 'click', () => {
          this.mapStatusChanged();
          this.infoWindow && this.infoWindow.close();
        });

        // 地图平移时触发事件
        this.mapMoveStartEventListener = AMap.event.addListener(this.map, 'movestart', () => {
          this.mapStatusChanged();
        });

        // 地图拖拽开始时触发事件
        this.mapDragStartEventListener = AMap.event.addListener(this.map, 'dragstart', () => {
          this.mapStatusChanged();
          this.infoWindow && this.infoWindow.close();
        });

        // 地图拖拽结束时触发事件;
        this.mapDragEndEventListener = AMap.event.addListener(
          this.map, 'dragend', () => {
            this.getBicycleClusterData();
            this.isShowBasicHeatMap && this.handelBasicHeatMapConfigure();
          });

        // 地图缩放开始时触发事件
        this.mapZoomStartEventListener = AMap.event.addListener(this.map, 'zoomstart', () => {
          this.mapStatusChanged();
          this.infoWindow && this.infoWindow.close();
        });

        // 地图拖拽结束时触发事件
        this.mapZoomEndEventListener = AMap.event.addListener(
          this.map, 'zoomend', () => {
            this.getBicycleClusterData();
            this.isShowBasicHeatMap && this.handelBasicHeatMapConfigure();
          }
        );
        // this.map.plugin(['AMap.Scale'], () => {
        //   this.map.addControl(new AMap.Scale());
        // });

        AMap.plugin('AMap.Autocomplete', () => {
          const autoOptions = {
            // city 限定城市，默认全国
            city: GlobalConst.RegionID,
            citylimit: true
          };
          this.autocomplete = new AMap.Autocomplete(autoOptions);
        });

        // AMap.plugin('AMap.PlaceSearch', () => {
        //   this.placeSearch = new AMap.PlaceSearch({
        //     city: GlobalConst.RegionID,
        //     autoFitView: true,
        //     // pageSize: 1,
        //     map: this.map
        //   });
        // });
      }
    );
  }

  /* 地图状态变更时进行同步 */
  private mapStatusChanged(): void {
    // this.inputTipsComponent && this.inputTipsComponent.shrinkBox();
  }

  /**
   * 初始化热力图图层
   */
  private initHeatMap(): void {
    if (this.heatMap) {
      this.isShowBasicHeatMap && this.heatMap.show();
    } else {
      // 初始化地图插件
      this.map.plugin(['AMap.Heatmap'], () => {
        // 初始化heatmap对象
        this.heatMap = new AMap.Heatmap(this.map, {
          radius: this.heatMapRadius, // 给定半径
          opacity: [0, 0.8],
          gradient: {
            [this.getThreshold(0)]: this.heatBasicColorConfig[0].color,
            [this.getThreshold(1)]: this.heatBasicColorConfig[1].color,
            [this.getThreshold(2)]: this.heatBasicColorConfig[2].color,
            [this.getThreshold(3)]: this.heatBasicColorConfig[3].color,
            1: this.heatBasicColorConfig[4].color,
          }
        });
      });
    }
  }

  /* 请求基础图层粒度配置列表 */
  private getGranularityListData(): void {
    this.heatMapLayerService.requestGranularityListData()
      .subscribe(res => {
        this.granularityList = res;
        this.handelBasicHeatMapConfigure();
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  // 处理图层颜色配置数据
  private handelBasicHeatMapConfigure(): void {
    const zoomNum = this.map.getZoom();
    this.granularityList.forEach(item => {
      const min_scale = new ZHeatMapPipe().transform(item.min_scale);
      const max_scale = new ZHeatMapPipe().transform(item.max_scale);
      if (max_scale <= zoomNum && zoomNum < min_scale) {
        this.heatBasicColorConfig = item.color_configure && item.color_configure.length !== 0
          ? item.color_configure : this.defaultColor;

        if (zoomNum < 17) {
          this.requestBasicBlockData(item.granularity_id);
        }
      }
    });
  }

  /**** 请求图层数据 ****/

  /* 请求基础图层所有数据 */
  private requestBasicBlockData(granularity_id: string): void {
    this.heatMapService.requestAllBlockStatisticsInfoList(granularity_id)
      .subscribe(res => {
        this.initBasicStatistics = res.results;
        this.initHeatMap();
        this.handelBasicHeatMapBlockData(this.initBasicStatistics);
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  /* 请求自定义图层所有数据 */
  private requestCustomData(heat_map_layer_id: string): void {
    this.heatMapService.requestRegionalStatisticsInfoList(heat_map_layer_id)
      .subscribe(res => {
        this.initCustomStatistics = res.results;
        this.isShowCustomHeatMap && this.showCustomMapInfo(this.initCustomStatistics);
      });
  }

  // 获取图层
  private getHeatMapData(type: number): void {
    this.heatMapService.requestHeatMapLayerList().subscribe(res => {
      const results = res.results;
      // 防止定时刷新后中心点重置，页面漂移
      if (type === 1) {
        const regionCenter = results[0].layer_core ? results[0].layer_core.split(',') : GlobalConst.RegionCenter;
        this.regionCenter = regionCenter.map((LngLat: any) => Number(LngLat));
        this.map && this.map.setCenter(this.regionCenter);
      }
      results.forEach(i => {
        if (i.layer_type === 0) {
          this.isShowBasicHeatMap && this.getGranularityListData();
        } else {
          this.heatCustomColorConfig = i.layer_color_configure && i.layer_color_configure.length !== 0
            ? i.layer_color_configure : this.defaultColor;
          this.requestCustomData(i.heat_map_layer_id);
          // debugger;
        }
      });
    });
  }

  /**** 基础图层渲染 ****/

  // 获取热力图颜色key值
  private getThreshold(num: number): any {
    let threshold = 1;
    const range = this.heatBasicColorConfig[num].range ? this.heatBasicColorConfig[num].range.split(',')[1] : 0;
    threshold = Number(range) / (Number(this.heatBasicColorConfig[4].range) + 1);
    return threshold;
  }

  // 处理基础图层数据 - block
  private handelBasicHeatMapBlockData(list: Array<BlockStatisticsEntity>): void {
    const newList = list.map(item => ({
      lng: Number(item.block_center.split(',')[0]),
      lat: Number(item.block_center.split(',')[1]),
      count: item.count
    }));
    this.updateBasicHeatMapData(Number(this.heatBasicColorConfig[4].range) + 1, newList);
  }

  // 处理基础图层热力数据 - 单车
  private handelBasicHeatMapData(bicycleList: Array<BicycleStatisticsEntity>): void {
    const newList = bicycleList.map(item => ({
      lng: Number(item.bicycle_point.split(',')[0]),
      lat: Number(item.bicycle_point.split(',')[1]),
      count: 1
    }));

    this.updateBasicHeatMapData(Number(this.heatBasicColorConfig[4].range) + 1, newList);
  }

  /* 更新基础图层相关数据 */
  private updateBasicHeatMapData(max: number, points: Array<{ lng: number, lat: number, count: number }>): void {
    let needUpdate = true;
    if (this.heatBasicPoints && this.heatBasicPoints.length === points.length) {
      let equalFlag = true;
      for (let index = 0; index < this.heatBasicPoints.length; index++) {
        const sourcePoint = this.heatBasicPoints[index];
        const targetPoint = points[index];
        if (!(sourcePoint.lng === targetPoint.lng && sourcePoint.lat === targetPoint.lat
          && sourcePoint.count === targetPoint.count)) {
          equalFlag = false;
          break;
        }
      }
      if (equalFlag && this.heatBasicMapMax === max) {
        needUpdate = false;
      }
    }
    this.heatBasicMapMax = max;
    this.heatBasicPoints = points;

    // 更新热力图数据,并同步一次显示状态
    if (this.heatMap && needUpdate) {
      this.heatMap.setDataSet({
        data: this.heatBasicPoints,
        max: this.heatBasicMapMax
      });
    }
  }

  /**** 自定义图层渲染 ****/

  // 获取自定义图层颜色
  private getColor(item: any): any {
    let color = '';
    if (Number(item.color[0].range.split(',')[0]) <= item.count && item.count <= Number(item.color[0].range.split(',')[1])) {
      return color = item.color[0].color;
    } else if (Number(item.color[1].range.split(',')[0]) < item.count && item.count <= Number(item.color[1].range.split(',')[1])) {
      return color = item.color[1].color;
    } else if (Number(item.color[2].range.split(',')[0]) < item.count && item.count <= Number(item.color[2].range.split(',')[1])) {
      return color = item.color[2].color;
    } else if (Number(item.color[3].range.split(',')[0]) < item.count && item.count <= Number(item.color[3].range.split(',')[1])) {
      return color = item.color[3].color;
    } else if (Number(item.color[4].range) < item.count) {
      return color = item.color[4].color;
    }
  }

  // 渲染单车数量图层
  public showMarkerMapInfo(heatCustomStatistics: Array<RegionalStatisticsEntity>): void {
    this.removeBicycleMarkerLayer();

    if (this.regionIds.length > 0) {
      const tmpList = [];
      this.regionIds.map(regionId => {
        const tmp = heatCustomStatistics.find(statistics => statistics.region_id === regionId);
        tmp && tmpList.push(tmp);
      });

      tmpList.forEach(regionItem => {
        if (regionItem.region_scope) {
          let range = [];
          if (typeof regionItem.region_scope === 'string') {
            range = JSON.parse(regionItem.region_scope.replace(/'/g, '"'));
          } else {
            range = regionItem.region_scope;
          }
          const newRange = range.map(i => new AMap.LngLat(i.lng, i.lat));
          const path = {
            color: this.heatCustomColorConfig,
            range: newRange,
            ...regionItem
          };
          this.generateMaker(path);
        }
      });
    }

  }

  // 渲染自定义图层
  public showCustomMapInfo(heatCustomStatistics: Array<RegionalStatisticsEntity>): void {
    this.removeCustomLayer();
    const rangePath = [];
    heatCustomStatistics.forEach(regionItem => {
      const region_core = regionItem.region_core ? regionItem.region_core.split(',') : [];
      this.initMarkerInfo(region_core, regionItem);
      if (regionItem.region_scope) {
        let range = [];
        if (typeof regionItem.region_scope === 'string') {
          range = JSON.parse(regionItem.region_scope.replace(/'/g, '"'));
        } else {
          range = regionItem.region_scope;
        }
        const newRange = range.map(i => new AMap.LngLat(i.lng, i.lat));
        const path = {
          color: this.heatCustomColorConfig,
          range: newRange,
          ...regionItem
        };
        this.generatePolygon(path);
        rangePath.push(path);
      }
    });
    if (this.map && this.markerList && this.markerList.length > 0) {
      this.map && this.map.add(this.markerList);
    }
  }

  // 生成区域数据
  private generatePolygon(pathItem: any): void {
    const fill_color = this.getColor(pathItem);
    this.polygon = new AMap.Polygon({
      path: pathItem.range,
      strokeStyle: 'solid',
      fillColor: fill_color, // 多边形填充颜色
      fillOpacity: 0.2,
      borderWeight: 2, // 线条宽度，默认为 1
      strokeColor: fill_color, // 线条颜色
      strokeOpacity: 0.4,
      strokeWeight: 1,
    });
    this.polygonList.push(this.polygon);
    this.map.add(this.polygon);
    this.polygon.on('click', (event: any) => {
      this.onShowRangeInfo(pathItem, event.lnglat, true);
    });
  }

  // 生成点数据
  private generateMaker(pathItem: any): void {
    const img = '/assets/images/bicycle_icon.png';
    const lng = pathItem.region_core.split(',')[0];
    const lat = pathItem.region_core.split(',')[1];
    this.bicycleMarker = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),
      offset: new AMap.Pixel(-12, -31),
      icon: img,
      cursor: 'pointer'
    });

    this.bicycleMarker.on('mouseover', (event: any) => {
      const position = new AMap.LngLat(lng, lat);
      this.selectMapContentInfoWindow = this.generateContentInfoWindow(pathItem);
      this.selectMapContentInfoWindow.open(this.map, position);
    });
    this.bicycleMarker.on('mouseout', (event: any) => {
      this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
    });

    this.bicycleMarkerList.push(this.bicycleMarker);
    this.map.add(this.bicycleMarker);
  }

  // 清空单车数据图层
  public removeBicycleMarkerLayer(): void {
    this.infoWindow && this.infoWindow.close();
    this.map && this.map.remove(this.bicycleMarkerList);
    this.bicycleMarkerList = [];
  }

  // 创建信息窗口
  private generateContentInfoWindow(data?: any) {
    const info = document.createElement('div');
    info.className = 'inside-amap-content-window';

    const row1 = document.createElement('div');
    row1.className = 'amap-content-window-row title';
    row1.innerHTML = `${data.region_name}`;
    info.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'amap-content-window-row';
    row2.innerHTML = `合计：${data.count}`;
    info.appendChild(row2);

    this.getRegionBicycleCount(info, data);

    const infoWindow = new AMap.InfoWindow({
      isCustom: true,  // 使用自定义窗体
      content: info,
      offset: new AMap.Pixel(0, -46)
    });
    return infoWindow;
  }

  // 在指定位置打开信息窗体
  public onShowRangeInfo(pathItem: ShowPathItem, lnglat: any, isShowRegionInfo: boolean): void {
    // debugger;
    this.infoWindow && this.infoWindow.close();
    this.infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -23),
    });
    let markerAddress = '';
    if (pathItem.region_name) {
      markerAddress = pathItem.region_name;
      this.renderInfoWindow(pathItem, lnglat, markerAddress.replace('山东省济南市', ''), isShowRegionInfo);
    } else {
      this.getPositionRegeocode((regeocode: any) => {
        markerAddress = regeocode ? regeocode.formattedAddress.replace('山东省济南市', '') : '无';
        this.renderInfoWindow(pathItem, lnglat, markerAddress, isShowRegionInfo);
      }, lnglat);
    }
  }

  // 渲染信息窗体
  private renderInfoWindow(pathItem: RenderPathItem, lnglat: any, markerAddress: string, isShowRegionInfo: boolean): void {
    const contentDiv = this.createInfoWindowContent(markerAddress);
    const infoUl = document.createElement('ul');
    if (isShowRegionInfo) {
      this.getRegionBicycleCount(infoUl, pathItem);
      const countDiv = document.createElement('div');
      countDiv.style.marginTop = '10px';
      const countLabel = document.createElement('label');
      const countSpan = document.createElement('span');
      countLabel.className = 'count_label';
      countSpan.className = 'count_span';
      countLabel.innerHTML = '区域车辆超限阈值：';
      const redRange = pathItem.region_alert_configure && pathItem.region_alert_configure.length > 0 ? pathItem.region_alert_configure[0].red_range : 0;
      countSpan.innerHTML = redRange;
      contentDiv.appendChild(countDiv);
      countDiv.appendChild(countLabel);
      countDiv.appendChild(countSpan);
      contentDiv.appendChild(infoUl);

      const total = document.createElement('div');
      total.style.margin = '-12px 0 10px 0';
      const totalLabel = document.createElement('label');
      totalLabel.className = 'count_label';
      totalLabel.innerHTML = '合计：';
      const totalSpan = document.createElement('span');
      totalSpan.className = 'count_span';
      totalSpan.innerHTML = pathItem.count;
      total.append(totalLabel);
      total.append(totalSpan);

      contentDiv.appendChild(total);
      const warningLevelDiv = document.createElement('div');
      warningLevelDiv.className = 'warning_text';
      warningLevelDiv.style.color = new WarningLevelColorPipe().transform(pathItem.warning_level);
      warningLevelDiv.innerHTML = `此区域处于【${new WarningLevelTextPipe().transform(pathItem.warning_level)}】`;
      contentDiv.appendChild(warningLevelDiv);
    } else {
      contentDiv.appendChild(infoUl);
      this.getClusterBicycleCount(infoUl, pathItem);
    }
    this.infoWindow.setContent(contentDiv);
    this.infoWindow.open(this.map, lnglat);
  }

  // 获取聚合点下单车数量
  private getClusterBicycleCount(infoUl: any, markers: any): void {
    const bicycleCountList = new Array(3).fill(0);
    bicycleCountList.forEach((bicycleItem, index) => {
      const type = index + 1;
      this.appendInfoWindowContent(
        infoUl,
        type === 1 ? '青桔' : type === 2 ? '哈罗' : '美团',
        `${markers.filter((markerItem: any) => markerItem.getExtData() === type).length}`);
    });
  }

  // 获取区域内单车数量
  private getRegionBicycleCount(infoUl: any, pathItem: { company_count: object }): void {
    for (const key of Object.keys(pathItem.company_count)) {
      console.log(this.companyList);
      this.companyList.forEach((companyItem) => {
        const company_type = companyItem.company_type;
        if (companyItem.company_id === key) {

          this.appendInfoWindowContent(
            infoUl,
            company_type === 1 ? '青桔：' : company_type === 2 ? '哈罗：' : '美团：',
            pathItem.company_count[key], this.bicycleIcons[company_type].color);
        }
      });
    }
  }

  // 十六进制转rgba
  private colorRgba(str: any, opacity: number): any {
    let sColor = str.toLowerCase();
    if (sColor) {
      // 补全六位颜色值
      if (sColor.length === 4) {
        let sColorNew = '#';
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      // 处理六位的颜色值
      const sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2), 16));
      }
      return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')';
    } else {
      return sColor;
    }
  }

  /**
   * 逆向获取地理编码
   * @param callback
   */
  private getPositionRegeocode(callback: any, position: Array<any>): any {
    this.map.plugin(['AMap.Geocoder'], () => {
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      });
      geocoder.getAddress(position, (status: any, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          if (callback) {
            callback(result.regeocode);
          }
        }
      });
    });
  }


  /**** 企业检索数据处理 ****/

  // 获取企业数据
  // public getCompanyList(event: any): void {
  //   this.companyList = event.companyList;
  // }

  // 企业检索
  public onSelectedCompany(event: any): void {
    this.map.clearMap();
    this.companyId = event.company_id;
    this.searchBicycleParams.company_id = this.companyId;
    // 检索基础图层企业下单车热力图
    if (this.isShowBasicHeatMap) {
      if (event.company_id) {
        this.heatBasicStatistics = this.initBasicStatistics.filter(i => Object.keys(i.company_count)[0] === event.company_id);
      } else {
        this.heatBasicStatistics = this.initBasicStatistics;
      }
      this.handelBasicHeatMapBlockData(this.heatBasicStatistics);
    }
    // 检索自定义图层企业下单车热力图
    if (this.isShowCustomHeatMap) {
      if (event.company_id) {
        this.heatCustomStatistics = this.initCustomStatistics.filter(i => Object.keys(i.company_count)[0] === event.company_id);
      } else {
        this.heatCustomStatistics = this.initCustomStatistics;
      }
      this.showCustomMapInfo(this.heatCustomStatistics);
    }
    // 检索矩形内的单车数据
    this.getBicycleClusterData();
  }

  /**** 渲染点聚合 ****/

  // 获取矩形内的单车数据
  private getBicycleClusterData(): void {
    this.removeCluster();
    if (this.map.getZoom() > 15) {// 比例尺100米显示聚合
      this.searchBicycleParams.min_point = this.map.getBounds().getSouthWest();
      this.searchBicycleParams.max_point = this.map.getBounds().getNorthEast();
      if (this.searchBicycleParams.min_point && this.searchBicycleParams.max_point) {
        this.searchText$.next();
      }
    } else {
      this.removeCluster();
    }
  }

  // 处理矩形内的单车数据
  private handelBicycleClusterData(points: Array<any>): void {
    this.clusterMarkers = [];
    for (const point of points) {
      const marker = point.bicycle_point ? point.bicycle_point.split(',') : [];
      const iconContent = point.company_type ? `<img src=${this.bicycleIcons[point.company_type].icon} />`
        : `<div class="bicycle-icon">单</div>`;
      this.clusterMarkers.push(new AMap.Marker({
        position: marker,
        content: iconContent,
        offset: new AMap.Pixel(-22, -22),
        extData: point.company_type
      }));
    }
    this.count = points.length;
    this.addCluster();
  }

  // 自定义点聚合气泡
  private renderClusterMarker(context: any): void {
    const clusterMarkerDiv = document.createElement('div');
    const clusterMarkerImg = document.createElement('img');
    const clusterMarkerSpan = document.createElement('span');
    clusterMarkerImg.src = '/assets/bike-images/cluster.png';
    const size = Math.round(30 + Math.pow(context.count / this.count, 1 / 5) * 20);
    clusterMarkerSpan.innerHTML = context.count > 99 ? '99+' : context.count;
    clusterMarkerSpan.style.color = 'rgba(255,255,255,1)';
    clusterMarkerSpan.style.fontSize = '16px';
    clusterMarkerSpan.style.fontFamily = 'Source Han Sans SC';
    clusterMarkerSpan.style.fontWeight = '400';
    clusterMarkerSpan.style.position = 'absolute';
    clusterMarkerSpan.style.left = context.count < 10 ? '25px' : context.count > 99 ? '19px' : '22px';
    clusterMarkerSpan.style.top = '18px';
    clusterMarkerDiv.style.textAlign = 'center';
    clusterMarkerDiv.appendChild(clusterMarkerImg);
    clusterMarkerDiv.appendChild(clusterMarkerSpan);
    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
    context.marker.setContent(clusterMarkerDiv);
  }

  // 添加聚合点
  private addCluster(): void {
    if (this.cluster) {
      this.cluster.setMap(null);
    }
    this.map.plugin(['AMap.MarkerClusterer'], () => {
      this.cluster = new AMap.MarkerClusterer(this.map, this.clusterMarkers, {
        gridSize: 60,
        maxZoom: 19,
        renderClusterMarker: (context) => {
          this.renderClusterMarker(context);
        }
      });
    });
  }

  // 移除聚合点
  private removeCluster(): void {
    this.requestBicycleSubscription$ && this.requestBicycleSubscription$.unsubscribe();
    if (this.cluster) {
      this.cluster.removeMarkers(this.clusterMarkers);
      this.clusterMarkers = [];
    }
    this.infoWindow && this.infoWindow.close();
  }

  /**** 图层显示 ****/

  // 清空自定义图层
  public removeCustomLayer(): void {
    this.infoWindow && this.infoWindow.close();
    this.map && this.map.remove(this.polygonList);
    this.polygonList = [];
    this.map && this.map.remove(this.markerList);
    this.markerList = [];
  }

  // 生成信息窗体主体
  private createInfoWindowContent(address: any): any {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content_info';
    const rangeDiv = document.createElement('div');
    const iconDiv = document.createElement('span');
    const rangeSpan = document.createElement('span');
    rangeSpan.innerHTML = address;
    rangeSpan.className = 'range_span';
    iconDiv.className = 'img_div';
    rangeDiv.appendChild(iconDiv);
    rangeDiv.appendChild(rangeSpan);
    contentDiv.appendChild(rangeDiv);

    return contentDiv;
  }

  // 填充信息窗体内容
  private appendInfoWindowContent(infoUl: any, label: string, span: any, formatColor?: string) {
    const typeLi = document.createElement('div');
    const typeLiLabel = document.createElement('label');
    const typeLiSpan = document.createElement('span');
    typeLi.className = 'info_li';
    typeLiLabel.innerHTML = label;
    typeLiSpan.innerHTML = span;
    // if (formatColor) {
    //   typeLiLabel.style.color = formatColor;
    //   typeLiSpan.style.color = formatColor;
    //   typeLi.style.backgroundColor = this.colorRgba(formatColor, 0.1);
    // }
    typeLi.appendChild(typeLiLabel);
    typeLi.appendChild(typeLiSpan);
    infoUl.appendChild(typeLi);
  }

  // 地图内双击阻止冒泡
  public onMapDoubleClick(event: any): void {
    event.stopPropagation();
  }

  public ngOnDestroy() {
    this.timerTenMinutesSubscription && this.timerTenMinutesSubscription.unsubscribe();
    this.mapCompleteEventListener && AMap && AMap.event.removeListener(this.mapCompleteEventListener);
    this.mapClickEventListener && AMap && AMap.event.removeListener(this.mapClickEventListener);
    this.mapMoveStartEventListener && AMap && AMap.event.removeListener(this.mapMoveStartEventListener);
    this.mapZoomStartEventListener && AMap && AMap.event.removeListener(this.mapZoomStartEventListener);
    this.mapDragStartEventListener && AMap && AMap.event.removeListener(this.mapDragStartEventListener);
    this.mapDragEndEventListener && AMap && AMap.event.removeListener(this.mapDragEndEventListener);
    this.mapZoomEndEventListener && AMap && AMap.event.removeListener(this.mapZoomEndEventListener);
    this.searchText$ && this.searchText$.unsubscribe();
    this.timerService.stopTimer();
  }
}

interface RenderPathItem {
  region_alert_configure: Array<any>;
  company_count: object;
  count: any;
  warning_level: any;
}

interface ShowPathItem {
  region_name: string;
  region_alert_configure: Array<any>;
  company_count: object;
  count: any;
  warning_level: any;
}
