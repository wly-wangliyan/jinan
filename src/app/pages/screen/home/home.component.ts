import {REFRESH_DURATION, TimerService} from '../../../core/timer.service';
import {HomeHttpService, ParkingCountEntity} from './home-http.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, interval, Subscription, timer} from 'rxjs';
import districts from './map-districts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private homeHttpService: HomeHttpService, private timerService: TimerService) {
    // fromEvent(window, 'resize').subscribe(() => {
    //   console.log(Number(devicePixelRatio.toFixed(1)));
    // });
  }

  private map: any;
  private disProvince: any;
  private disList = [];
  private correctDisList = districts;  // 矫正描画位置后的列表
  private pushColor = 'rgba(21, 157, 235, 1)';
  private normalColor = 'rgba(27, 63, 115, 1)';
  private currentDistrictIndex = 0; // 轮播区域序号
  public currentDistrict: { name: string, adcode: number } = {name: '历城区', adcode: 370112};
  public districtsLoop = [{NAME_CHN: '历城区', adcode: 370112},
    {NAME_CHN: '历下区', adcode: 370102},
    {NAME_CHN: '天桥区', adcode: 370105},
    {NAME_CHN: '槐荫区', adcode: 370104},
    {NAME_CHN: '市中区', adcode: 370103},
    {NAME_CHN: '长清区', adcode: 370113},
    {NAME_CHN: '平阴县', adcode: 370124},
    {NAME_CHN: '商河县', adcode: 370126},
    {NAME_CHN: '济阳区', adcode: 370115},
    {NAME_CHN: '章丘区', adcode: 370114},
    {NAME_CHN: '莱芜区', adcode: 370116},
    {NAME_CHN: '钢城区', adcode: 370117}];

  public parkingCountEntity: ParkingCountEntity = new ParkingCountEntity();
  public totalData: TotalDataItem; // 各类总数数据
  private timerSubscription: Subscription;
  private dataSubscription: Subscription;
  private disProvinceSubscription: Subscription;

  ngOnInit(): void {
    this.initMap();
    timer(10).subscribe(() => {
      this.initBackground();
      this.initPro();
      this.requestAllData();
    });
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestAllData();
    });
  }

  ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.disProvinceSubscription && this.disProvinceSubscription.unsubscribe();
  }

  /**
   * 初始化主地图
   */
  initMap() {
    this.map = new AMap.Map('map-container', {
      zoom: 9,
      viewMode: '3D',
      dragEnable: false,
      zoomEnable: false,
      center: [117.187532, 36.6827847272],
      pitch: 0,
      mapStyle: 'amap://styles/cbe873634cd94cf43b94eeebc85a1727'
    });
    this.map.setDefaultCursor('default');
    this.map.setFeatures([]);
  }

  /**
   * 初始化背景图
   */
  initBackground() {
    const bounds = this.map.getBounds().bounds;
    const imageLayer = new AMap.ImageLayer({
      url: './assets/images/home/home_bg.png',
      bounds: new AMap.Bounds([bounds[3].lng, bounds[3].lat],
        [bounds[1].lng, bounds[1].lat])
    });
    imageLayer.setMap(this.map);
  }

  // 初始化区域地图
  initPro() {
    this.disProvince && this.disProvince.setMap(null);

    this.disProvince = new AMap.DistrictLayer.Province({
      zIndex: 12,
      adcode: [370100],
      depth: 2,
      styles: {
        'county-stroke': 'rgb(18,155,235)',
        'city-stroke': 'rgb(18,155,235)',
        fill: (everyItem: any) => {
          this.disList.push(everyItem);
          return this.currentDistrict && (everyItem.adcode === this.currentDistrict.adcode) ? this.pushColor : this.normalColor;
        }
      },
    });

    this.loopDistrict();

    this.disProvince.setMap(this.map);

    this.disProvince.on('complete', () => {
      this.initText();
    });

    // this.map.on('mousemove', (ev: any) => {
    //   const px = ev.pixel;
    //   const selectItem = this.disProvince.getDistrictByContainerPos(px);
    //   this.disProvince.setStyles({
    //     'county-stroke': 'rgb(18,155,235)',
    //     'city-stroke': 'rgb(18,155,235)',
    //     'fill': (everyItem: any) => {
    //       return selectItem && (everyItem.adcode === selectItem.adcode) ? this.pushColor : this.normalColor;
    //     }
    //   });
    // });

    this.map.on('click', (ev: any) => {
      const px = ev.pixel;
      const selectItem = this.disProvince.getDistrictByContainerPos(px);
      if (selectItem) {
        this.disProvinceSubscription && !this.disProvinceSubscription.closed && this.disProvinceSubscription.unsubscribe();
        // 选中行政区 更新顺序索引
        this.currentDistrictIndex = this.districtsLoop.findIndex(item => item.NAME_CHN === selectItem.NAME_CHN);
        this.setCurrentDistrict(selectItem);
      }
    });

    this.map.on('mousemove', (ev: any) => {
      const px = ev.pixel;
      const selectItem = this.disProvince.getDistrictByContainerPos(px);
      if (!selectItem) {
        this.loopDistrict();
      }
    });
  }


  // 轮播显示区域
  loopDistrict() {
    if (!this.disProvinceSubscription || this.disProvinceSubscription.closed) {
      this.disProvinceSubscription = interval(10 * 1000).subscribe(() => {
        this.currentDistrictIndex = this.currentDistrictIndex < this.districtsLoop.length - 1 ? this.currentDistrictIndex + 1 : 0;
        const selectItem = {
          NAME_CHN: this.districtsLoop[this.currentDistrictIndex].NAME_CHN,
          adcode: this.districtsLoop[this.currentDistrictIndex].adcode
        };
        this.setCurrentDistrict(selectItem);
      });
    }
  }

  // 设置当前行政区域
  setCurrentDistrict(selectItem: any) {
    this.currentDistrict = {name: selectItem.NAME_CHN, adcode: selectItem.adcode};
    this.disProvince.setStyles({
      'county-stroke': 'rgb(18,155,235)',
      'city-stroke': 'rgb(18,155,235)',
      fill: (everyItem: any) => {
        return selectItem && (everyItem.adcode === selectItem.adcode) ? this.pushColor : this.normalColor;
      }
    });
  }

  /**
   * 初始化区域名称
   */
  initText() {
    const textMarkers = [];
    this.correctDisList.forEach(item => {
      const text = new AMap.Text({
        text: item.NAME_CHN,
        clickable: false,
        bubble: true,
        cursor: 'default',
        style: {
          'background-color': 'transparent',
          'border-width': 0,
          'font-size': '12px',
          'color': 'white',
          'font-weight': 'normal',
        },
        position: [item.x, item.y]
      });
      textMarkers.push(text);
    });
    this.map.add(textMarkers);
  }

  requestAllData() {
    const httpList = [this.homeHttpService.requestParkingCount(),
      this.homeHttpService.requestPowerPoleCount(),
      this.homeHttpService.requestPowerCarCount(),
      this.homeHttpService.requestBicycleDistrictCount()];
    this.dataSubscription = forkJoin(httpList).subscribe((results: any[]) => {
      const tmpTotalData = new TotalDataItem();
      if (results[0]) {
        // 停车场
        this.parkingCountEntity = results[0];
        tmpTotalData.totalParkingCount = this.parkingCountEntity.total_number;
      }
      if (results[1]) {
        // 充电桩
        tmpTotalData.totalPoleCount = results[1].total_count;
      }
      if (results[2]) {
        // 新能源
        tmpTotalData.totalPowerCarCount = results[2];
        tmpTotalData.totalNormalCarCount = 2100000;
      }
      if (results[3]) {
        // 单车
        tmpTotalData.totalBicycleCount = results[3].count;
      }

      this.totalData = tmpTotalData;
    });
  }
}

class TotalDataItem {
  totalParkingCount = 0;
  totalBicycleCount = 0;
  totalPoleCount = 0;
  totalPowerCarCount = 0;
  totalNormalCarCount = 0; // 非新能源车辆
}
