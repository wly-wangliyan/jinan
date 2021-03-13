import { TimerService, REFRESH_DURATION } from '../../../core/timer.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RoadTypeItem } from './components/city-four-roads-summary/city-four-roads-summary.component';
import {
  EmployeeEntity,
  EmployeeParams,
  InsideHttpService,
  RoadParams,
} from './inside-http.service';
import { Subscription } from 'rxjs';
import { GlobalConst } from '../../../share/global-const';
import { RoadModalComponent } from './components/road-modal/road-modal.component';
import { AmapInfoWindowHelper } from 'src/utils/amap-info-window-helper';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.less'],
})
export class InsideComponent implements OnInit, OnDestroy {
  private map: any;

  private mapCompleteEventListener: any;

  public markerList: Array<any> = [];

  public currentMarkerType = 1; // 默认为巡检员

  public searchRoadParams: RoadParams = new RoadParams();

  public parkingFlag = true;
  public employeeFlag = false;

  public isClickParkingBtn = false;

  private currentPolylineList: Array<any> = [];

  private currentMarkerList: Array<any> = [];

  private selectMapContentInfoWindow: any; // 当前信息窗体

  private colorList = ['#81ff5d', '#ff6f6f', '#f7b500', '#3473fe'];
  private currentRoadItem: RoadTypeItem;

  private timerSubscription: Subscription;
  private requestSubscription: Subscription;
  private roadSubscription: Subscription;
  private requestEmployeeSubscription: Subscription;

  private trackMarker = null;
  private trackPolyline = null;
  private trackPassedPolyline = null;
  @ViewChild('roadModal') private roadModal: RoadModalComponent;

  constructor(
    private timerService: TimerService,
    private insideHttpService: InsideHttpService
  ) {
    this.timerSubscription = this.timerService
      .intervalTime(REFRESH_DURATION)
      .subscribe(() => {
        this.employeeFlag && this.requestInspectorListData();
        this.parkingFlag && this.requestRoadInfo();
      });
  }

  ngOnInit(): void {
    this.initMap();
  }

  public ngOnDestroy(): void {
    this.mapCompleteEventListener &&
    AMap &&
    AMap.event.removeListener(this.mapCompleteEventListener);
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.roadSubscription && this.roadSubscription.unsubscribe();
    this.requestEmployeeSubscription && this.requestEmployeeSubscription.unsubscribe();
    this.removeEmployeeTrack();
  }

  public onChangeParking() {
    this.parkingFlag = !this.parkingFlag;
    if (this.parkingFlag) {
      this.isClickParkingBtn = true;
      this.searchRoadParams.road_type = 1;
      this.requestRoadInfo();
    } else {
      this.map.remove(this.currentPolylineList);
    }
  }

  public onChangeEmployee() {
    this.employeeFlag = !this.employeeFlag;
    if (this.employeeFlag) {
      this.requestInspectorListData();
    } else {
      this.selectMapContentInfoWindow && this.selectMapContentInfoWindow.close();
      this.map.remove(this.currentMarkerList);
    }
  }

  // 切换点标记类型
  public onChangeMarkerType(index: number): void {
    if (this.currentMarkerType === index) {
      return;
    }
    // this.roadSubscription && this.roadSubscription.unsubscribe();
    // this.requestSubscription && this.requestSubscription.unsubscribe();

    this.currentMarkerType = index;

    // this.map.remove(this.currentMarkerList);
    // this.map.remove(this.currentPolylineList);
    switch (index) {
      case 1:

        this.requestInspectorListData();
        break;
      case 0:
        this.searchRoadParams.road_type = undefined;

        this.requestRoadInfo();
        break;
    }
  }

  public onChangeRoadType(roadItem: RoadTypeItem) {
    this.currentRoadItem = roadItem;
    this.map.remove(this.currentPolylineList);
    if (roadItem.isShow) {
      roadItem.isShow = false;
      return;
    }
    this.isClickParkingBtn = false;
    roadItem.isShow = true;
    this.searchRoadParams.road_type = roadItem.roadType;
    this.parkingFlag = true;
    // this.map.remove(this.currentMarkerList);
    this.requestRoadInfo();
  }

  // 请求路段信息 点击道路类型，画线段
  public requestRoadInfo() {
    if (!this.isClickParkingBtn && (!this.currentRoadItem || !this.currentRoadItem.isShow)) {
      return;
    }
    this.map.remove(this.currentPolylineList);
    this.roadSubscription && this.roadSubscription.unsubscribe();
    this.roadSubscription = this.insideHttpService
      .requestRoadList(this.searchRoadParams)
      .subscribe((results) => {
        this.currentPolylineList = results.filter(res => res.road_path && res.road_path.length > 0).map((res) => {
          const path = res.road_path.map(
            (item) => new AMap.LngLat(item.lon, item.lat)
          );
          let spaceStatus = 4;
          if (res.road_parking.space_status === 1) {
            spaceStatus = 4;
          } else if (res.road_parking.space_status === 2) {
            spaceStatus = 3;
          } else {
            spaceStatus = 2;
          }
          const marker = new AMap.Marker({
            position: path[0],
            offset: new AMap.Pixel(-12, -31),
            icon: `/assets/images/icon_map_parking${spaceStatus}.png`,
            cursor: 'pointer',
          });
          // 准停道路才显示弹框
          if (res.road_type === 1) {
            marker.on('click', () => {
              this.selectMapContentInfoWindow &&
              this.selectMapContentInfoWindow.close();
              this.roadModal.show(res.road_parking);
            });
          }
          return marker;
        });

        // 将折线添加至地图实例
        this.map.add(this.currentPolylineList);
      });
  }

  private initMap(): void {
    // 初始化地图
    this.map = new AMap.Map('inside-map-container', {
      resizeEnable: false,
      center: GlobalConst.RegionCenter,
      zoom: 11,
      zooms: [10, 18],
      mapStyle: 'amap://styles/cbe873634cd94cf43b94eeebc85a1727',
      // keyboardEnable: false
    });
    // const myBounds = new AMap.Bounds([114.819254, 34.377352], [122.71596, 38.402247]);
    // this.map.setLimitBounds(myBounds);
    // 地图图块加载完成后触发事件
    this.mapCompleteEventListener = AMap.event.addListener(
      this.map,
      'complete',
      () => {
        this.isClickParkingBtn = true;
        this.searchRoadParams.road_type = 1;
        this.requestRoadInfo();
      }
    );
  }

  // 请求巡检员数据
  private requestInspectorListData(): void {
    this.map.remove(this.currentMarkerList);
    const params = new EmployeeParams();
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.requestSubscription = this.insideHttpService
      .requestEmployeeList(params)
      .subscribe((results) => {
        this.currentMarkerList = results
          .filter(
            (r) => r.employee_pos && r.employee_pos.lon && r.employee_pos.lat
          )
          .map((item) => {
            const marker = new AMap.Marker({
              position: new AMap.LngLat(
                item.employee_pos.lon,
                item.employee_pos.lat
              ),
              extData: {employee_id: item.employee_id},
              offset: new AMap.Pixel(-11, -28),
              icon: '/assets/images/icon_map_inspector.png',
            });
            marker.on('mouseover', () => {
              const position = new AMap.LngLat(
                item.employee_pos.lon,
                item.employee_pos.lat
              );
              this.selectMapContentInfoWindow = this.generateEmployeeInfoWindow(
                item
              );
              this.selectMapContentInfoWindow.open(this.map, position);
            });
            marker.on('mouseout', () => {
              this.selectMapContentInfoWindow &&
              this.selectMapContentInfoWindow.close();
            });
            marker.on('click', (event: any) => {
              const data = event.target.getExtData();
              this.requestEmployeeInfo(data.employee_id);
            });
            return marker;
          });
        this.map.add(this.currentMarkerList);
      });
  }

  // 请求员工轨迹列表
  private requestEmployeeInfo(employee_id: string): void {
    // 移除之前巡检员轨迹
    this.removeEmployeeTrack();
    this.requestEmployeeSubscription && this.requestEmployeeSubscription.unsubscribe();
    this.requestEmployeeSubscription = this.insideHttpService
      .requestEmployeePositionList(employee_id)
      .subscribe((data) => {
        const points = data
          .filter((d) => d.lon && d.lat)
          .map((d) => [d.lon, d.lat]);
        // 起始坐标确认一下
        if (points.length > 0) {
          this.reappearEmployeeTrack(points[0], points, true);
        }
      });
  }

  // 创建巡检员信息窗口
  private generateEmployeeInfoWindow(item: EmployeeEntity) {
    return AmapInfoWindowHelper.init(
      [
        {
          className: 'head',
          content:
            item.employee_icon || '/assets/images/icon_default_avatar.png',
          element: 'img',
          eventType: 'click',
          // func: () => {
          //   this.requestEmployeeInfo(item.employee_id);
          // },
        },
        {className: 'title center', content: item.real_name},
        {className: 'center', content: item.telephone},
        {className: 'center', content: item.employee_num},
        {className: 'center bottom', content: item.employee_pos.road_name},
      ],
      new AMap.Pixel(0, -46)
    );
  }

  /**
   * 重现员工巡检轨迹
   * @param startPosition 起始位置坐标[xx,xx]
   * @param trackPoints 轨迹点数组[[xx,xx],[xx,xx],...]
   * @param animation 是否启用动画效果
   */
  private reappearEmployeeTrack(
    startPosition: Array<number>,
    trackPoints: Array<any>,
    animation = false
  ) {
    // 制作轨迹线
    this.trackPolyline = new AMap.Polyline({
      map: this.map,
      path: trackPoints,
      showDir: animation,
      strokeColor: '#1995DE', // 线颜色
      // strokeOpacity: 1,     //线透明度
      strokeWeight: 6, // 线宽
      // strokeStyle: "solid"  //线样式
    });

    if (animation) {
      // 制作起点图标
      this.trackMarker = new AMap.Marker({
        map: this.map,
        position: startPosition,
        icon: '/assets/images/track_icon.png',
        offset: new AMap.Pixel(-14, -14),
        autoRotation: true,
        angle: -90,
      });
      // 制作移动后效果路径
      this.trackPassedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: '#FAC826', // 线颜色
        strokeWeight: 6, // 线宽
      });
      this.trackMarker &&
      this.trackMarker.on('moving', this.drawPassedPolyline);
      this.trackMarker && this.trackMarker.moveAlong(trackPoints, 200);
    }
  }

  /** 绘制移动中轨迹 */
  private drawPassedPolyline = (e) => {
    this.trackPassedPolyline && this.trackPassedPolyline.setPath(e.passedPath);
  };

  /**
   * 移除员工巡检轨迹
   */
  private removeEmployeeTrack() {
    this.trackMarker && this.trackMarker.off('moving', this.drawPassedPolyline);
    this.trackMarker && this.map.remove(this.trackMarker);
    this.trackPolyline && this.map.remove(this.trackPolyline);
    this.trackPassedPolyline && this.map.remove(this.trackPassedPolyline);
    this.trackMarker = this.trackPolyline = this.trackPassedPolyline = null;
  }
}
