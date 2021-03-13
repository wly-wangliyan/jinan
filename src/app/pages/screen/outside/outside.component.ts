import { REFRESH_DURATION } from '../../../core/timer.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TimerService } from '../../../core/timer.service';
import { Observable, Subscription } from 'rxjs';
import { OutsideHttpService, ParkingEntity, ParkingParams, ParkingTotalInfoEntity } from './outside-http.service';
import { GlobalConst } from '../../../share/global-const';
import { AmapInfoWindowHelper, InfoWindow } from 'src/utils/amap-info-window-helper';
import { RoadModalComponent } from '../inside/components/road-modal/road-modal.component';
import { ParkingMonitorComponent } from './components/parking-monitor/parking-monitor.component';

@Component({
  selector: 'app-outside',
  templateUrl: './outside.component.html',
  styleUrls: ['./outside.component.less']
})
export class OutsideComponent implements OnInit, OnDestroy {

  public searchParams: ParkingParams = new ParkingParams();

  public isStartSelect = false; // 开始选取

  public totalParkingInfo: ParkingTotalInfoEntity = new ParkingTotalInfoEntity();

  private parkingList: Array<ParkingEntity> = [];

  private map: any;

  private mapCompleteEventListener: any;

  private markerList: Array<any> = [];

  private selectMapContentInfoWindow: any; // 当前信息窗体

  private rectangle: any;

  private mouseTool: any;

  private isRefreshRectTotalData = false;

  private timerSubscription: Subscription;

  private requestSubscription: Subscription;

  private requestRectSubscription: Subscription;

  @ViewChild('parkingMonitorModal') private parkingMonitorModal: ParkingMonitorComponent;

  constructor(private timerService: TimerService, private outsideHttpService: OutsideHttpService) {
    this.searchParams.parking_type = 2;
    this.searchParams.page_size = 2000;
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestParkingListData();
    });
  }

  ngOnInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.mapCompleteEventListener && AMap && AMap.event.removeListener(this.mapCompleteEventListener);
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.removeRectangle();
  }

  // 开始选取|关闭选取
  public onChangeSelectMap(isStartSelect: boolean): void {
    this.isStartSelect = isStartSelect;
    this.removeRectangle();
    if (!isStartSelect) {
      this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
      return;
    }
    this.mouseTool = new AMap.MouseTool(this.map);
    this.mouseTool.rectangle({
      strokeColor: '#1995DE',
      strokeWeight: 1,
      fillColor: '#040A22',
      fillOpacity: 0.6
    });
    this.mouseTool.on('draw', this.drawRect);
  }

  private removeRectangle() {
    this.rectangle && this.map.remove(this.rectangle);
    this.mouseTool && this.mouseTool.off('draw', this.drawRect);
    this.mouseTool && this.mouseTool.close(true);
    this.requestRectSubscription && this.requestRectSubscription.unsubscribe();
  }

  private drawRect = (event) => {
    this.mouseTool.close(true);
    const path = event.obj.getPath();
    this.rectangle = new AMap.Rectangle({
      bounds: new AMap.Bounds(path[0], path[2]),
      strokeColor: '#1995DE',
      strokeWeight: 1,
      fillColor: '#040A22',
      fillOpacity: 0.6,
      cursor: 'pointer'
    });
    this.isRefreshRectTotalData = true;
    const centerLng = (path[0].lng + path[1].lng) / 2,
      centerLat = (path[1].lat + path[2].lat) / 2;
    const centerPos = new AMap.LngLat(centerLng, centerLat);
    this.rectangle.on('mouseover', () => {
      this.requestRectTotalInfo().subscribe(() => {
        this.selectMapContentInfoWindow = this.generateAreaInfoWindow();
        this.selectMapContentInfoWindow.open(this.map, centerPos);
      });
    });
    this.rectangle.on('mouseout', () => {
      this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
    });

    this.rectangle.setMap(this.map);
  };

  // 批量获取停车场总车位数,总实时占用车位数,总共享车位数
  public requestRectTotalInfo() {
    return new Observable(observer => {
      if (!this.isRefreshRectTotalData) {
        observer.next();
        observer.complete();
        return;
      }
      this.isRefreshRectTotalData = false;
      const parkingIds = this.parkingList
        .filter(p => this.rectangle && this.rectangle.contains(new AMap.LngLat(p.lon, p.lat)))
        .map(p => p.parking_id).join(',');
      this.requestRectSubscription = this.outsideHttpService.requestParkingTotalInfo(parkingIds).subscribe(result => {
        this.totalParkingInfo = result;
        observer.next();
        observer.complete();
      }, err => {
        observer.error();
      });
    });
  }

  // 点击领域
  public onParkingFieldChange(parkingField: number): void {
    this.searchParams.parking_field = parkingField;
    this.requestParkingListData();
  }

  private initMap(): void {
    // 初始化地图
    this.map = new AMap.Map('outside-map-container', {
      resizeEnable: false,
      center: GlobalConst.RegionCenter,
      zoom: 11,
      zooms: [10, 18],
      mapStyle: 'amap://styles/cbe873634cd94cf43b94eeebc85a1727',
      // keyboardEnable: false
    });
    // 地图图块加载完成后触发事件
    this.mapCompleteEventListener = AMap.event.addListener(this.map, 'complete', () => {
      this.requestParkingListData();
    });
  }

  // 请求停车场数据
  private requestParkingListData(): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.outsideHttpService.requestParkingInfo(this.searchParams).subscribe(results => {
      this.parkingList = results;
      if (this.isStartSelect) {
        this.isRefreshRectTotalData = true;
        this.requestRectTotalInfo().subscribe();
      }
      const markerList = results.filter(r => r.lon && r.lat)
        .map(result => {
          let spaceStatus = 4;
          if (result.space_status === 1) {
            spaceStatus = 4;
          } else if (result.space_status === 2) {
            spaceStatus = 3;
          } else {
            spaceStatus = 2;
          }
          const marker = new AMap.Marker({
            position: new AMap.LngLat(result.lon, result.lat),
            offset: new AMap.Pixel(-12, -31),
            icon: `/assets/images/icon_map_parking${spaceStatus}.png`,
            cursor: 'pointer',
          });
          marker.on('mouseover', (event: any) => {
            if (!this.isStartSelect) {
              const position = new AMap.LngLat(result.lon, result.lat);
              this.selectMapContentInfoWindow = this.generateParkingInfoWindow(result);
              this.selectMapContentInfoWindow.open(this.map, position);
            }
          });
          marker.on('mouseout', (event: any) => {
            this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
          });
          return marker;
        });
      this.map.remove(this.markerList);
      this.markerList = markerList;
      this.map.add(markerList);
    });
  }

  // 选取区域信息窗体
  private generateAreaInfoWindow(): any {
    return AmapInfoWindowHelper.init([
      { className: 'title', content: `停车数据` },
      { content: `停车场数量：${this.totalParkingInfo.parking_count}` },
      { content: `车位总数：${this.totalParkingInfo.total_spots}` },
    ], new AMap.Pixel(0, 0));
  }

  // 创建停车场信息窗体
  private generateParkingInfoWindow(item: ParkingEntity): any {
    const initArr: Array<InfoWindow> = [
      { className: 'title', content: item.parking_name },
      { content: `总泊位数：${item.parking_space_count}` },
      { className: 'bottom', content: `剩余泊位数：${item.real_time_surplus_spots}` },
    ];
    if (item.app_key && item.app_secret) {
      initArr.push({
        className: 'monitor', content: `实时监控`, eventType: 'click',
        func: () => {
          this.parkingMonitorModal.show(item);
        }
      })
    }
    return AmapInfoWindowHelper.init(initArr, new AMap.Pixel(0, -46));
  }
}
