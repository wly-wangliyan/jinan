import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PowerOverviewModalListenerService } from './power-overview-modal-listener.service';
import districts from '../home/map-districts';
import { GlobalConst } from '../../../share/global-const';
import { ChargingStationsEntity, PowerHttpService } from './power-http.service';
import { AmapInfoWindowHelper } from 'src/utils/amap-info-window-helper';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.less']
})
export class PowerComponent implements OnInit, OnDestroy {

  private map: any;

  private mapCompleteEventListener: any;

  public markerList: Array<any> = [];

  public data = { parking_relief: '', recharge_relief: '' };

  public chargingStationsList: Array<ChargingStationsEntity> = [];

  public operatorList = [];

  public selectedDistrictValue = '';
  public selectedOperatorValue = '';

  public districts = districts;

  private selectMapContentInfoWindow: any; // 当前信息窗体

  private powerOverviewClickSubscription$: Subscription;
  @ViewChild('leftSideRef') public leftSideRef: ElementRef;

  constructor(
    private powerOverviewModalListenerService: PowerOverviewModalListenerService,
    private renderer2: Renderer2,
    private powerService: PowerHttpService
  ) {
    this.requestData();
  }

  ngOnInit(): void {
    this.initMap();
    this.onDistrictChange('');
    this.searchBtnClick();

    this.powerOverviewClickSubscription$ && this.powerOverviewClickSubscription$.unsubscribe();
    this.powerOverviewClickSubscription$ = this.powerOverviewModalListenerService.powerOverviewModalClick$.subscribe((res) => {
      if (res === 'back') {
        this.renderer2.setStyle(this.leftSideRef.nativeElement, 'left', '12px');
      } else {
        this.renderer2.setStyle(this.leftSideRef.nativeElement, 'left', '-500px');
      }
    });
  }

  public requestData() {
    this.powerService.requestNewEnergyData().subscribe(res => {
      this.data.parking_relief = Math.round(res.parking_relief / 3600).toString();
      this.data.recharge_relief = Math.round(res.recharge_relief / 3600).toString();
    });
  }

  // 去重
  public unique(arr) {
    return Array.from(new Set(arr));
  }

  public ngOnDestroy(): void {
    this.mapCompleteEventListener && AMap && AMap.event.removeListener(this.mapCompleteEventListener);
  }

  private initMap(): void {
    // 初始化地图
    this.map = new AMap.Map('power-map-container', {
      resizeEnable: true,
      center: GlobalConst.RegionCenter,
      zoom: 11,
      zooms: [11, 18],
      mapStyle: 'amap://styles/cbe873634cd94cf43b94eeebc85a1727',
      // keyboardEnable: false
    });
    // 地图图块加载完成后触发事件
    this.mapCompleteEventListener = AMap.event.addListener(this.map, 'complete', () => {
      // this.requestParkingListData();
    });
  }

  public onBtnClick(value: string) {
    this.powerOverviewModalListenerService.powerOverviewModalClick$.next(value);
  }

  // 获取区域下运营商
  public onDistrictChange(code: string) {
    this.operatorList = [];
    this.selectedOperatorValue = '';
    this.selectedDistrictValue = code;
    this.powerService.requestChargingStations(code).subscribe(res => {
      this.operatorList = res.results.map(item => item.operator_name);
      this.operatorList = this.unique(this.operatorList);
    });
  }

  // 获取充电站
  public onOperatorChange(operator: string) {
    this.selectedOperatorValue = operator;
  }

  // 搜索点击
  public searchBtnClick() {
    this.map.clearMap();

    this.powerService.requestChargingStations(this.selectedDistrictValue, this.selectedOperatorValue).subscribe(res => {
      this.chargingStationsList = res.results;

      this.chargingStationsList.forEach(item => {
        const percent = Number(item.using_terminal_count) / Number(item.charging_terminal_count);
        let img = '';
        // switch (item.operator_id) {
        //   case '13287b3a3ab511ebb5150242ac122b04':
        //     // 星星充电
        //     break;
        //   case '1336c2d03ab511ebb5150242ac122b04':
        //     // 特来电
        //     break;
        //   case '133970a23ab511ebb5150242ac122b04':
        //     // 积成智通
        //     break;
        //   default:
        //     // 其他
        //     break
        // }
        if (percent < 0.7) {
          img = '/assets/power-images/green.png';
        } else {
          img = '/assets/power-images/red.png';
        }

        const marker = new AMap.Marker({
          position: new AMap.LngLat(item.station_lng, item.station_lat),
          offset: new AMap.Pixel(-12, -31),
          icon: img,
          cursor: 'pointer'
        });
        marker.on('mouseover', (event: any) => {
          const position = new AMap.LngLat(item.station_lng, item.station_lat);
          this.selectMapContentInfoWindow = this.generateContentInfoWindow(item);
          this.selectMapContentInfoWindow.open(this.map, position);
        });
        marker.on('mouseout', (event: any) => {
          this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
        });
        this.map.add(marker);
      });
    });

  }

  // 创建信息窗口
  private generateContentInfoWindow(data?: ChargingStationsEntity) {
    return AmapInfoWindowHelper.init([
      { content: `运营商简称：${data.operator_name}` },
      { content: `电站名称：${data.station_name}` },
      { content: `充电枪数量：${data.charging_terminal_count}` },
      { content: `充电枪使用量：${data.using_terminal_count}` },
    ], new AMap.Pixel(0, -46));
  }

}
